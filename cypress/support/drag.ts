// eslint-disable-next-line n/file-extension-in-import
import { convertPosition } from './common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // triggerHover: (elements: NodeListOf<HTMLElement>) => void;
      drag(target: string | HTMLElement | JQuery<HTMLElement>, options?: { dropSide?: DropSide }): Chainable<any>;
      dragOutside(
        viewport?: string,
        ms?: number,
        px?: number,
        options?: { parentSelector?: string; scrollbarDimension?: number; rowHeight?: number }
      ): Chainable<HTMLElement>;
      dragStart(options?: { cellWidth?: number; cellHeight?: number }): Chainable<HTMLElement>;
      dragCell(addRow: number, addCell: number, options?: { cellWidth?: number; cellHeight?: number }): Chainable<HTMLElement>;
      dragEnd(gridSelector?: string): Chainable<HTMLElement>;
    }
  }
}

export type DropSide = 'auto' | 'center' | 'left' | 'right';

// Elements the drag command can pick up when given an inner child.
const DRAGGABLE_ITEM_SELECTOR = '.slick-header-column, .slick-dropped-grouping, [draggable="true"]';

/** Create a drag-family event carrying a DataTransfer and real coordinates. */
export function createDragLikeEvent(eventName: string, x: number, y: number, dataTransfer: DataTransfer): Event {
  const event = new Event(eventName, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  Object.defineProperty(event, 'clientX', { value: x });
  Object.defineProperty(event, 'clientY', { value: y });
  Object.defineProperty(event, 'pageX', { value: x });
  Object.defineProperty(event, 'pageY', { value: y });
  Object.defineProperty(event, 'screenX', { value: x });
  Object.defineProperty(event, 'screenY', { value: y });
  return event;
}

/** Create a mouse event with explicit page/client coordinates. */
export function createMouseLikeEvent(win: Window, eventName: string, x: number, y: number, buttons = 1): MouseEvent {
  const event = win.document.createEvent('MouseEvent');
  event.initMouseEvent(eventName, true, true, win, 0, x, y, x, y, false, false, false, false, buttons, null);
  Object.defineProperty(event, 'pageX', { configurable: true, value: x });
  Object.defineProperty(event, 'pageY', { configurable: true, value: y });
  return event;
}

/** Dispatch the pointer/mouse press that precedes a native HTML5 drag. */
export function pressPointer(el: HTMLElement, x: number, y: number): void {
  const init = { bubbles: true, cancelable: true, button: 0, buttons: 1, clientX: x, clientY: y };
  el.dispatchEvent(new PointerEvent('pointerdown', { ...init, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
  el.dispatchEvent(new MouseEvent('mousedown', init));
}

/** Dispatch the pointer/mouse release that follows a native HTML5 drag. */
export function releasePointer(el: HTMLElement, x: number, y: number): void {
  const init = { bubbles: true, cancelable: true, button: 0, buttons: 0, clientX: x, clientY: y };
  el.dispatchEvent(new PointerEvent('pointerup', { ...init, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
  el.dispatchEvent(new MouseEvent('mouseup', init));
}

// Keep the repository's drag/drop simulation available for every spec, including specs
// that use cy.drag() without importing this module directly.
Cypress.Commands.overwrite('drag', (_originalFn: any, subject: any, target: any, options: { dropSide?: DropSide } = {}) => {
  const dropSide: DropSide = options.dropSide ?? 'auto';

  return cy.wrap(subject, { log: false }).then(($source: JQuery<HTMLElement>) => {
    const rawSource = $source?.[0] as HTMLElement | undefined;
    const source = rawSource?.closest<HTMLElement>(DRAGGABLE_ITEM_SELECTOR) ?? rawSource;
    const targetChain = typeof target === 'string' ? cy.get(target, { log: false }) : cy.wrap(target, { log: false });

    return targetChain.then(($target: JQuery<HTMLElement>) => {
      const rawTarget = ($target?.[0] ?? $target) as HTMLElement | undefined;
      // Headers and grouping pills resolve to their draggable owner, but a
      // grouping dropzone is deliberately droppable-only. Keep the raw target
      // when it has no draggable ancestor so cross-list header drops reach
      // Sortable's dropzone instance.
      const targetElement = rawTarget?.closest<HTMLElement>(DRAGGABLE_ITEM_SELECTOR) ?? rawTarget;
      if (!source || !targetElement) {
        return cy.wrap($source, { log: false });
      }

      const dataTransfer = new DataTransfer();
      const sourceRect = source.getBoundingClientRect();
      const sourceX = sourceRect.left + sourceRect.width / 2;
      const sourceY = sourceRect.top + sourceRect.height / 2;
      pressPointer(source, sourceX, sourceY);
      source.dispatchEvent(createDragLikeEvent('dragstart', sourceX, sourceY, dataTransfer));

      return cy.wait(20, { log: false }).then(() => {
        const targetRect = targetElement.getBoundingClientRect();
        let side = dropSide;
        if (side === 'auto') {
          side = source.parentElement === targetElement.parentElement && sourceRect.left !== targetRect.left
            ? sourceRect.left < targetRect.left ? 'right' : 'left'
            : 'center';
        }
        const fraction = side === 'right' ? 0.75 : side === 'left' ? 0.25 : 0.5;
        const targetX = targetRect.left + targetRect.width * fraction;
        const targetY = targetRect.top + targetRect.height / 2;
        targetElement.dispatchEvent(createDragLikeEvent('dragenter', targetX, targetY, dataTransfer));
        targetElement.dispatchEvent(createDragLikeEvent('dragover', targetX, targetY, dataTransfer));

        return cy.wait(20, { log: false }).then(() => {
          targetElement.dispatchEvent(createDragLikeEvent('drop', targetX, targetY, dataTransfer));
          source.dispatchEvent(createDragLikeEvent('dragend', targetX, targetY, dataTransfer));
          releasePointer(source, targetX, targetY);
          return cy.wrap($source, { log: false });
        });
      });
    });
  });
});

// @ts-ignore
Cypress.Commands.add('dragStart', { prevSubject: true }, (subject: HTMLElement, { cellWidth = 80, cellHeight = 25 } = {}) => {
  return cy
    .wrap(subject)
    .click({ force: true })
    .trigger('mousedown', { which: 1, force: true })
    .trigger('mousemove', cellWidth / 3, cellHeight / 3, { force: true });
});

// use a different command name than 'drag' so that it doesn't conflict with the '@4tw/cypress-drag-drop' lib
Cypress.Commands.add(
  'dragCell',
  // @ts-ignore
  { prevSubject: true },
  (subject: HTMLElement, addRow: number, addCell: number, { cellWidth = 80, cellHeight = 25 } = {}) => {
    return cy.wrap(subject).trigger('mousemove', cellWidth * (addCell + 0.5), cellHeight * (addRow + 0.5), { force: true });
  }
);

Cypress.Commands.add(
  'dragOutside',
  (viewport = 'topLeft', ms = 0, px = 0, { parentSelector = 'div[class^="slickgrid_"]', scrollbarDimension = 17 } = {}) => {
    const $parent = cy.$$(parentSelector);
    const parentElement = $parent[0] as HTMLElement | undefined;
    const parentRect = parentElement?.getBoundingClientRect();
    const viewportElement = $parent.find('.slick-viewport')[0] as HTMLElement | undefined;
    const viewportRect = viewportElement?.getBoundingClientRect() || parentRect;
    let clientX = viewportRect ? viewportRect.left + viewportRect.width / 2 : 0;
    let clientY = viewportRect ? viewportRect.top + viewportRect.height / 2 : 0;
    const position = convertPosition(viewport);
    if (position.x === 'left') {
      clientX = (viewportRect?.left || 0) - scrollbarDimension - px;
    } else if (position.x === 'right') {
      clientX = (viewportRect?.right || 0) + 3 + px;
    }
    if (position.y === 'top') {
      clientY = (viewportRect?.top || 0) - scrollbarDimension - px;
    } else if (position.y === 'bottom') {
      clientY = (viewportRect?.bottom || 0) + 3 + px;
    }

    // Cypress' positional trigger overload converts coordinates relative to
    // its subject into a real page/client position. Supplying pageX/pageY in
    // the options object is not equivalent: Cypress re-normalizes those
    // values for a nested viewport, which made a downward drag appear inside
    // the viewport (and kept vertical scrollTop at 0). Dispatch from the grid
    // container, as the original helper did, while deriving the point from the
    // actual body viewport so docking remains correct.
    const parentLeft = parentRect?.left ?? 0;
    const parentTop = parentRect?.top ?? 0;
    const move = cy.wrap(parentElement, { log: false }).trigger(
      'mousemove',
      clientX - parentLeft,
      clientY - parentTop,
      { button: 0, force: true, which: 1 }
    );

    return ms ? move.wait(ms, { log: false }) : move;
  }
);

Cypress.Commands.add('dragEnd', { prevSubject: 'optional' }, (_subject, gridSelector = 'div[class^="slickgrid_"]') => {
  return cy
    .get('body', { log: false })
    .trigger('mouseup', { force: true })
    .then(() => cy.get(gridSelector, { log: false }).trigger('mouseup', { force: true }));
});

export function getScrollDistanceWhenDragOutsideGrid(
  selector: string,
  viewport: string,
  dragDirection: string,
  fromRow: number,
  fromCol: number,
  px = 140
) {
  return (cy as any).convertPosition(viewport).then((_viewportPosition: { x: string; y: string }) => {
    const viewportSelector = `${selector} .slick-viewport-${_viewportPosition.x}.slick-viewport-${_viewportPosition.y}`;
    const cellViewport = cy.$$(selector).find('.slick-viewport').length === 1 ? 'topLeft' : viewport;
    return (cy as any).getNthCell(fromRow, fromCol, cellViewport, { parentSelector: selector }).dragStart().then(() => cy.get(selector)).then(($grid) => {
      // Pinning uses one dedicated horizontal scroll owner. Keep this helper
      // compatible with both the legacy pane viewport and the new proxy so
      // drag auto-scroll assertions observe the actual scroll position.
      const viewport = ($grid.find(viewportSelector)[0] || $grid.find('.slick-vertical-scroller')[0]) as HTMLElement;
      const horizontalScroller = $grid.find('.slick-horizontal-scroller')[0] as HTMLElement | undefined;
      const horizontalOwner = horizontalScroller || viewport;
      const scrollTopBefore = viewport.scrollTop;
      const scrollLeftBefore = horizontalOwner.scrollLeft;
      return cy.dragOutside(dragDirection, 300, px, { parentSelector: selector }).then(() => cy.get(selector)).then(($gridAfter) => {
        const viewportAfter = ($gridAfter.find(viewportSelector)[0] || $gridAfter.find('.slick-vertical-scroller')[0]) as HTMLElement;
        const horizontalScrollerAfter = $gridAfter.find('.slick-horizontal-scroller')[0] as HTMLElement | undefined;
        const horizontalOwnerAfter = horizontalScrollerAfter || viewportAfter;
        const scrollTopAfter = viewportAfter.scrollTop;
        const scrollLeftAfter = horizontalOwnerAfter.scrollLeft;
        return cy.dragEnd(selector).then(() => {
          horizontalOwnerAfter.scrollLeft = 0;
          viewportAfter.scrollTop = 0;
          return cy.wrap({
            scrollTopBefore,
            scrollLeftBefore,
            scrollTopAfter,
            scrollLeftAfter,
          });
        });
      });
    });
  });
}
