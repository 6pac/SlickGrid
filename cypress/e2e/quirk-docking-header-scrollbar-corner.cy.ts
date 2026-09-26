describe('Quirk - header chrome above the vertical scrollbar', () => {
  // Header chrome spans the viewport's full width, including the strip above the vertical
  // scrollbar, while its content translates with the horizontal scroll. A cover hides that
  // strip. It lets clicks through, and elementFromPoint skips anything that does, so every
  // pseudo-element is made hit-testable while sampling: a point then resolves to whatever is
  // painted on top of it.
  const paintedAt = (doc: Document, x: number, y: number) => {
    const style = doc.createElement('style');
    style.textContent = '#myGrid *::before, #myGrid *::after { pointer-events: auto !important; }';
    doc.head.appendChild(style);
    const topmost = doc.elementFromPoint(x, y) as HTMLElement | null;
    style.remove();
    return topmost;
  };

  const isOpaque = (color: string) => {
    const channels = /rgba?\(([^)]+)\)/.exec(color)?.[1].split(',') || [];
    return channels.length === 3 || (channels.length === 4 && Number(channels[3]) === 1);
  };

  const titleShownAboveScrollbar = (win: any, container: string, cellSelector: string): string[] => {
    const doc = win.document;
    const viewport = doc.querySelector('#myGrid .slick-viewport') as HTMLElement;
    const holder = doc.querySelector(`#myGrid ${container}`) as HTMLElement;
    const gutter = viewport.offsetWidth - viewport.clientWidth;
    const rtl = doc.querySelector('#myGrid')!.classList.contains('slick-rtl');
    const vp = viewport.getBoundingClientRect();
    const box = holder.getBoundingClientRect();
    // Sample the whole strip, not only its middle, so a title's edge cannot slip past.
    const stripStart = rtl ? vp.left : vp.right - gutter;
    const found: string[] = [];
    for (let x = stripStart + 1; x < stripStart + gutter; x += 3) {
      const topmost = paintedAt(doc, x, box.top + box.height / 2);
      const cell = topmost?.closest(cellSelector) as HTMLElement | null;
      if (cell) {
        found.push(cell.getAttribute('data-id') || cell.className.split(' ').join('.'));
      } else if (topmost && getComputedStyle(topmost, '::after').content !== 'none' && !isOpaque(getComputedStyle(topmost, '::after').backgroundColor)) {
        found.push(`a see-through cover on ${topmost.className.split(' ').join('.')}`);
      }
    }
    return found;
  };

  const sweep = (page: string, checks: Array<[string, string]>, setup?: (win: any) => void) => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/${page}.html`);
    cy.get('#myGrid .slick-header-column').should('exist');
    if (setup) {
      cy.window().then((win: any) => setup(win));
    }
    cy.window().then((win: any) => {
      const doc = win.document;
      const viewport = doc.querySelector('#myGrid .slick-viewport') as HTMLElement;
      expect(viewport.offsetWidth - viewport.clientWidth, 'the example shows a vertical scrollbar').to.be.greaterThan(0);

      const scroller = doc.querySelector('#myGrid .slick-docking-horizontal-scroller') as HTMLElement;
      const rtl = doc.querySelector('#myGrid')!.classList.contains('slick-rtl');
      const max = scroller.scrollWidth - scroller.clientWidth;
      const leaks: string[] = [];
      for (let step = 0; step <= 20; step++) {
        const target = Math.round((max * step) / 20);
        scroller.scrollLeft = rtl ? -target : target;
        scroller.dispatchEvent(new win.Event('scroll'));
        checks.forEach(([container, cellSelector]) => {
          const shown = titleShownAboveScrollbar(win, container, cellSelector);
          if (shown.length) {
            leaks.push(`${container} at ${step * 5}%: ${Array.from(new Set(shown)).join(', ')}`);
          }
        });
      }
      expect(leaks, 'header content drawn above the vertical scrollbar').to.deep.eq([]);
    });
  };

  it('keeps the header clear above the scrollbar, left to right, with sticky columns', () => {
    sweep('example-sticky-financial-report', [['.slick-header', '.slick-header-column']]);
  });

  it('keeps the header and header row clear above the scrollbar, left to right, with left pins only', () => {
    // A right-pinned band sits at the trailing edge and happens to cover the strip, so this
    // example drops its right pins to let the scrolling columns reach it.
    sweep(
      'example-pinning-columns-and-rows',
      [
        ['.slick-header', '.slick-header-column'],
        ['.slick-headerrow', '.slick-headerrow-column'],
      ],
      (win) => win.grid.setOptions({ pinning: { columns: { left: 1, right: 0 } } })
    );
  });

  it('keeps the header clear above the scrollbar, right to left, where the scrollbar is on the left', () => {
    sweep('example-pinning-rtl', [['.slick-header', '.slick-header-column']]);
  });

  it('keeps the header clear above the scrollbar with the classic stylesheet, where the header is positioned', () => {
    sweep('example-pinning-columns-tabs', [['.slick-header', '.slick-header-column']]);
  });

  it('keeps the grid menu button visible above the cover', () => {
    // The grid menu narrows the header and places its button above the scrollbar on purpose.
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-column-group.html`);
    cy.get('#myGrid .slick-gridmenu-button').should(($button) => {
      const rect = $button[0].getBoundingClientRect();
      const topmost = paintedAt($button[0].ownerDocument, rect.left + rect.width / 2, rect.top + rect.height / 2);
      expect(topmost === $button[0] || $button[0].contains(topmost), 'the grid menu button is painted on top').to.eq(true);
    });
  });
});
