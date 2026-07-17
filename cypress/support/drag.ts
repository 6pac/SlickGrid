import { convertPosition } from './common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // triggerHover: (elements: NodeListOf<HTMLElement>) => void;
      drag(target: string | HTMLElement | JQuery<HTMLElement>, options?: { dropSide?: DropSide; }): Chainable<any>;
      dragOutside(viewport?: string, ms?: number, px?: number, options?: { parentSelector?: string, scrollbarDimension?: number; rowHeight?: number; }): Chainable<HTMLElement>;
      dragStart(options?: { cellWidth?: number; cellHeight?: number; }): Chainable<HTMLElement>;
      dragCell(addRow: number, addCell: number, options?: { cellWidth?: number; cellHeight?: number; }): Chainable<HTMLElement>;
      dragEnd(gridSelector?: string): Chainable<HTMLElement>;
    }
  }
}

export type DropSide = 'auto' | 'center' | 'left' | 'right';

// elements the `drag` command can pick up when given an inner child (e.g. the header name span)
const DRAGGABLE_ITEM_SELECTOR = '.slick-header-column, .slick-dropped-grouping, [draggable="true"]';

/** Create a drag-family event (dragstart/dragenter/dragover/drop/dragend/drag) carrying a DataTransfer and real coordinates */
export function createDragLikeEvent(eventName: string, x: number, y: number, dataTransfer: DataTransfer): Event {
  const evt = new Event(eventName, { bubbles: true, cancelable: true });
  Object.defineProperty(evt, 'dataTransfer', { value: dataTransfer });
  Object.defineProperty(evt, 'clientX', { value: x });
  Object.defineProperty(evt, 'clientY', { value: y });
  Object.defineProperty(evt, 'pageX', { value: x });
  Object.defineProperty(evt, 'pageY', { value: y });
  Object.defineProperty(evt, 'screenX', { value: x });
  Object.defineProperty(evt, 'screenY', { value: y });
  return evt;
}

/** Dispatch the pointer/mouse press that precedes a native HTML5 drag (SortableJS only arms itself from pointerdown/mousedown) */
export function pressPointer(el: HTMLElement, x: number, y: number): void {
  const init = { bubbles: true, cancelable: true, button: 0, buttons: 1, clientX: x, clientY: y };
  el.dispatchEvent(new PointerEvent('pointerdown', { ...init, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
  el.dispatchEvent(new MouseEvent('mousedown', init));
}

/** Dispatch the pointer/mouse release that follows a native HTML5 drag */
export function releasePointer(el: HTMLElement, x: number, y: number): void {
  const init = { bubbles: true, cancelable: true, button: 0, buttons: 0, clientX: x, clientY: y };
  el.dispatchEvent(new PointerEvent('pointerup', { ...init, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
  el.dispatchEvent(new MouseEvent('mouseup', init));
}

// Replace the `@4tw/cypress-drag-drop` simulation with our own HTML5 DnD event sequence (ported from Slickgrid-Universal).
// It dispatches pointerdown/mousedown -> dragstart -> dragenter/dragover -> drop -> dragend -> pointerup/mouseup with a
// shared DataTransfer and real coordinates, i.e. the same sequence a browser fires for a real drag. `dropSide` controls
// where on the target the drop lands; 'auto' aims decisively past the target's midpoint (75%/25%) so the before/after
// insertion intent is unambiguous regardless of which drag engine (SortableJS or native) interprets it.
Cypress.Commands.overwrite('drag', (_originalFn: any, subject: any, target: any, options: { dropSide?: DropSide; } = {}) => {
  const dropSide: DropSide = options?.dropSide ?? 'auto';

  return cy.wrap(subject, { log: false }).then(($source: JQuery<HTMLElement>) => {
    const rawSourceElm = $source?.[0] as HTMLElement | undefined;
    const sourceElm = rawSourceElm?.closest<HTMLElement>(DRAGGABLE_ITEM_SELECTOR) ?? rawSourceElm;
    const targetChain = typeof target === 'string' ? cy.get(target, { log: false }) : cy.wrap(target, { log: false });

    return targetChain.then(($target: any) => {
      const rawTargetElm = ($target?.[0] ?? $target) as HTMLElement | undefined;
      const targetElm = rawTargetElm?.closest?.(DRAGGABLE_ITEM_SELECTOR) as HTMLElement ?? rawTargetElm;

      if (!sourceElm || !targetElm) {
        return cy.wrap($source, { log: false });
      }

      const dataTransfer = new DataTransfer();
      const sourceRect = sourceElm.getBoundingClientRect();
      const sourceX = sourceRect.left + sourceRect.width / 2;
      const sourceY = sourceRect.top + sourceRect.height / 2;

      pressPointer(sourceElm, sourceX, sourceY);
      sourceElm.dispatchEvent(createDragLikeEvent('dragstart', sourceX, sourceY, dataTransfer));

      // SortableJS activates the drag on the next macrotask, so yield before dragging over the target
      return cy.wait(20, { log: false }).then(() => {
        const targetRect = targetElm.getBoundingClientRect();
        let side = dropSide;
        if (side === 'auto') {
          if (sourceElm.parentElement === targetElm.parentElement && sourceRect.left !== targetRect.left) {
            side = sourceRect.left < targetRect.left ? 'right' : 'left';
          } else {
            side = 'center';
          }
        }
        const fraction = side === 'right' ? 0.75 : side === 'left' ? 0.25 : 0.5;
        const targetX = targetRect.left + targetRect.width * fraction;
        const targetY = targetRect.top + targetRect.height / 2;

        targetElm.dispatchEvent(createDragLikeEvent('dragenter', targetX, targetY, dataTransfer));
        targetElm.dispatchEvent(createDragLikeEvent('dragover', targetX, targetY, dataTransfer));

        return cy.wait(20, { log: false }).then(() => {
          targetElm.dispatchEvent(createDragLikeEvent('drop', targetX, targetY, dataTransfer));
          sourceElm.dispatchEvent(createDragLikeEvent('dragend', targetX, targetY, dataTransfer));
          releasePointer(sourceElm, targetX, targetY);
          return cy.wrap($source, { log: false });
        });
      });
    });
  });
});

// @ts-ignore
Cypress.Commands.add('dragStart', { prevSubject: true }, (subject, { cellWidth = 80, cellHeight = 25 } = {}) => {
  return cy.wrap(subject).click({ force: true })
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', cellWidth / 3, cellHeight / 3);
});

// use a different command name than "drag" so that it doesn't conflict with the "@4tw/cypress-drag-drop" lib
// @ts-ignore
Cypress.Commands.add('dragCell', { prevSubject: true }, (subject, addRow, addCell, { cellWidth = 80, cellHeight = 25 } = {}) => {
  return cy.wrap(subject).trigger('mousemove', cellWidth * (addCell + 0.5), cellHeight * (addRow + 0.5), { force: true });
});

Cypress.Commands.add('dragOutside', (viewport = 'topLeft', ms = 0, px = 0, { parentSelector = 'div[class^="slickgrid_"]', scrollbarDimension = 17 } = {}) => {
  const $parent = cy.$$(parentSelector);
  const gridWidth = $parent.width();
  const gridHeight = $parent.height();
  let x = gridWidth / 2;
  let y = gridHeight / 2;
  const position = convertPosition(viewport);
  if (position.x === 'left') {
    x = -px;
  } else if (position.x === 'right') {
    x = gridWidth - scrollbarDimension + 3 + px;
  }
  if (position.y === 'top') {
    y = -px;
  } else if (position.y === 'bottom') {
    y = gridHeight - scrollbarDimension + 3 + px;
  }

  cy.get(parentSelector).trigger('mousemove', x, y, { force: true });
  if (ms) {
    cy.wait(ms);
  }
  return;
});

Cypress.Commands.add('dragEnd', { prevSubject: 'optional' }, (subject, gridSelector = 'div[class^="slickgrid_"]') => {
  cy.get(gridSelector).trigger('mouseup', { force: true });
  return;
});

export function getScrollDistanceWhenDragOutsideGrid(selector, viewport, dragDirection, fromRow, fromCol, px = 100) {
  return (cy as any).convertPosition(viewport).then((_viewportPosition: { x: number; y: number; }) => {
    const viewportSelector = `${selector} .slick-viewport-${_viewportPosition.x}.slick-viewport-${_viewportPosition.y}`;
    (cy as any).getNthCell(fromRow, fromCol, viewport, { parentSelector: selector })
      .dragStart();
    return cy.get(viewportSelector).then($viewport => {
      const scrollTopBefore = $viewport.scrollTop();
      const scrollLeftBefore = $viewport.scrollLeft();
      cy.dragOutside(dragDirection, 300, px, { parentSelector: selector });
      return cy.get(viewportSelector).then($viewportAfter => {
        cy.dragEnd(selector);
        const scrollTopAfter = $viewportAfter.scrollTop();
        const scrollLeftAfter = $viewportAfter.scrollLeft();
        cy.get(viewportSelector).scrollTo(0, 0, { ensureScrollable: false });
        return cy.wrap({
          scrollTopBefore,
          scrollLeftBefore,
          scrollTopAfter,
          scrollLeftAfter
        });
      });
    });
  });
}
