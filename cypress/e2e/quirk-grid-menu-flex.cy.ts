const harness = `<!doctype html>
<link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css">
<link rel="stylesheet" href="/dist/styles/css/slick.gridmenu.css">
<style>
  /* Classic 16px scrollbars on every platform: the trailing-column checks below need a scrollbar gutter at least as wide as the menu slot. */
  ::-webkit-scrollbar { width: 16px; height: 16px; }
  .wide-icon { display: inline-block; width: 20px; height: 20px; background: #000; }
  .glyph-icon::before { content: 'WWW'; font-size: 20px; line-height: 1; white-space: nowrap; }
</style>
<div id="grid" style="width:600px;height:250px"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script src="/dist/browser/controls/slick.gridmenu.js"></script>`;

describe('Grid Menu flex layout', () => {
  beforeEach(() => {
    cy.intercept('/grid-menu-flex.html', { headers: { 'content-type': 'text/html' }, body: harness });
    cy.visit('/grid-menu-flex.html');
  });

  for (const placement of ['header', 'preheader'] as const) {
    for (const rtl of [false, true]) {
      it(`reserves a flex slot in the ${placement} with rtl=${rtl} and restores it on destroy`, () => {
        cy.window().then((win: any) => {
          const columns = Array.from({ length: 3 }, (_, i) => ({ id: `c${i}`, field: `c${i}`, name: `Column ${i}`, width: 100 }));
          const slotWidth = placement === 'header' ? 14 : 22;
          const grid = new win.Slick.Grid('#grid', [{ c0: 'a' }], columns, {
            rtl, createPreHeaderPanel: true, showPreHeaderPanel: true, showHeaderRow: true,
            gridMenu: { iconButtonContainer: placement, ...(placement === 'preheader' ? { menuWidth: 20 } : {}) },
          });
          const root = grid.getContainerNode();
          const header = root.querySelector('.slick-header');
          const filter = root.querySelector('.slick-headerrow');
          const target = root.querySelector(placement === 'header' ? '.slick-header' : '.slick-preheader-panel');
          const originalWidth = target.getBoundingClientRect().width;
          const filterWidth = filter.getBoundingClientRect().width;
          const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
          const slot = root.querySelector('.slick-gridmenu-container');
          expect(win.getComputedStyle(target.parentElement).display).to.eq('flex');
          expect(slot.parentElement).to.eq(target.parentElement);
          expect(slot.getBoundingClientRect().width).to.eq(slotWidth);
          expect(target.getBoundingClientRect().width).to.be.closeTo(originalWidth - slotWidth, 1);
          expect(filter.getBoundingClientRect().width).to.eq(filterWidth);
          expect(header.style.width).to.eq('');
          const targetRect = target.getBoundingClientRect();
          const buttonRect = root.querySelector('.slick-gridmenu-button').getBoundingClientRect();
          expect(rtl ? buttonRect.right <= targetRect.left : buttonRect.left >= targetRect.right, 'button does not overlap the headers').to.eq(true);
          const handle = root.querySelectorAll('.slick-resizable-handle')[2];
          const handleRect = handle.getBoundingClientRect();
          const columnRect = handle.parentElement.getBoundingClientRect();
          expect(handleRect.width).to.be.at.least(6);
          expect(handleRect.left).to.be.at.least(columnRect.left);
          expect(handleRect.right).to.be.at.most(columnRect.right);
          expect(root.ownerDocument.elementFromPoint(handleRect.left + handleRect.width / 2, handleRect.top + handleRect.height / 2)).to.eq(handle);
          control.destroy();
          expect(root.querySelector('.slick-gridmenu-container')).to.eq(null);
          expect(target.getBoundingClientRect().width).to.be.closeTo(originalWidth, 1);
          grid.destroy();
        });
      });
    }
  }

  it('keeps the trailing pinned column resize handle accessible beside the default menu', () => {
    cy.window().then((win: any) => {
      const columns = Array.from({ length: 8 }, (_, i) => ({ id: `c${i}`, field: `c${i}`, name: `Column ${i}`, width: 100 }));
      const grid = new win.Slick.Grid('#grid', Array.from({ length: 30 }, (_, id) => ({ id })), columns, {
        pinning: { columns: { right: 1 } },
      });
      // The header is `slot` px narrower than the viewport, so the trailing column's handle is only reachable
      // when the vertical scrollbar gutter is at least that wide; the harness forces classic 16px scrollbars
      // (overlay scrollbars, e.g. on macOS, are 0px wide and the slot then covers the handle, see menus.md).
      expect(grid.getScrollbarDimensions().width, 'scrollbar gutter at least as wide as the slot').to.be.at.least(14);
      const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
      const handle = grid.getHeaderColumn('c7').querySelector('.slick-resizable-handle');
      const rect = handle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      expect(win.document.elementFromPoint(x, y), 'resize handle is the hit target at the trailing edge').to.eq(handle);
      const mouse = (type: string, clientX: number, buttons = 1) => new win.MouseEvent(type, {
        bubbles: true, cancelable: true, clientX, clientY: y, button: 0, buttons, view: win,
      });
      const width = grid.getColumns()[7].width;
      handle.dispatchEvent(mouse('mousedown', x));
      win.document.body.dispatchEvent(mouse('mousemove', x + 25));
      win.document.body.dispatchEvent(mouse('mouseup', x + 25, 0));
      expect(grid.getColumns()[7].width, 'dragging the final handle resizes the column').to.be.greaterThan(width);
      control.destroy();
      grid.destroy();
    });
  });

  for (const placement of ['header', 'preheader'] as const) {
    it(`collapses the menu slot when the ${placement} is initially hidden or toggled`, () => {
      cy.window().then((win: any) => {
        const columns = [{ id: 'a', name: 'A', field: 'a', width: 100 }];
        const grid = new win.Slick.Grid('#grid', [], columns, {
          createPreHeaderPanel: true,
          showColumnHeader: placement !== 'header',
          showPreHeaderPanel: false,
          gridMenu: { iconButtonContainer: placement },
        });
        const root = grid.getContainerNode();
        const headerRoot = root.querySelector('.slick-header-root');
        const initialHeight = headerRoot.getBoundingClientRect().height;
        const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
        const slot = root.querySelector('.slick-gridmenu-container');
        const setVisible = (visible: boolean) => placement === 'header'
          ? grid.setColumnHeaderVisibility(visible, false)
          : grid.setPreHeaderPanelVisibility(visible, false);
        expect(slot.getBoundingClientRect().height, 'hidden panel reserves no menu height').to.eq(0);
        expect(headerRoot.getBoundingClientRect().height).to.eq(initialHeight);
        setVisible(true);
        expect(slot.getBoundingClientRect().height).to.be.greaterThan(0);
        setVisible(false);
        expect(slot.getBoundingClientRect().height, 'toggling the panel hides the menu too').to.eq(0);
        expect(headerRoot.getBoundingClientRect().height).to.eq(initialHeight);
        control.destroy();
        grid.destroy();
      });
    });
  }

  it('widens the slot to an icon class wider than menuWidth instead of clipping it', () => {
    cy.window().then((win: any) => {
      const columns = [{ id: 'a', name: 'A', field: 'a', width: 100 }];
      const check = (iconCssClass: string, expectedMinSlot: number) => {
        const grid = new win.Slick.Grid('#grid', [], columns, { gridMenu: { iconCssClass } });
        const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
        const root = grid.getContainerNode();
        const slot = root.querySelector('.slick-gridmenu-container');
        const button = root.querySelector('.slick-gridmenu-button');
        const slotRect = slot.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        expect(slotRect.width, `${iconCssClass}: slot grows to the icon`).to.be.at.least(expectedMinSlot);
        expect(buttonRect.left, `${iconCssClass}: icon starts inside the slot`).to.be.at.least(slotRect.left);
        expect(buttonRect.right, `${iconCssClass}: icon ends inside the slot`).to.be.at.most(slotRect.right);
        expect(button.scrollWidth, `${iconCssClass}: no horizontal overflow left to clip`).to.be.at.most(slot.clientWidth);
        control.destroy();
        grid.destroy();
      };
      check('wide-icon', 22); // a class that sizes the button itself, like the bundled `.sgi` icons
      check('glyph-icon', 15); // a glyph that overflows a full-width button
    });
  });

  it('keeps the default slot for menuWidth: 0 and centres an icon narrower than the slot', () => {
    cy.window().then((win: any) => {
      const columns = [{ id: 'a', name: 'A', field: 'a', width: 100 }];
      const grid = new win.Slick.Grid('#grid', [], columns, { gridMenu: { menuWidth: 0, iconCssClass: 'wide-icon' } });
      const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
      const root = grid.getContainerNode();
      const slotRect = root.querySelector('.slick-gridmenu-container').getBoundingClientRect();
      const buttonRect = root.querySelector('.slick-gridmenu-button').getBoundingClientRect();
      expect(slotRect.width, 'menuWidth: 0 falls back to the default and then grows to the icon').to.eq(22);
      expect(buttonRect.left - slotRect.left, 'icon is centred in the slot').to.be.closeTo(slotRect.right - buttonRect.right, 1);
      control.destroy();
      grid.destroy();
    });
  });

  it('falls back to the column header when the pre-header placement has no pre-header panel', () => {
    cy.window().then((win: any) => {
      const columns = [{ id: 'a', name: 'A', field: 'a', width: 100 }];
      const warn = cy.stub(win.console, 'warn');
      const grid = new win.Slick.Grid('#grid', [], columns, { gridMenu: { iconButtonContainer: 'preheader' } });
      const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
      const root = grid.getContainerNode();
      const slot = root.querySelector('.slick-gridmenu-container');
      expect(slot.parentElement).to.eq(root.querySelector('.slick-header').parentElement);
      expect(slot.querySelector('.slick-gridmenu-button')).to.not.eq(null);
      expect(warn).to.have.been.calledWithMatch(/createPreHeaderPanel/);
      control.destroy();
      grid.destroy();
    });
  });

  it('reserves no header space when the button is hidden', () => {
    cy.window().then((win: any) => {
      const columns = [{ id: 'a', name: 'A', field: 'a' }];
      const grid = new win.Slick.Grid('#grid', [], columns, { gridMenu: { showButton: false } });
      const header = grid.getContainerNode().querySelector('.slick-header');
      const width = header.getBoundingClientRect().width;
      const control = new win.Slick.Controls.GridMenu(columns, grid, grid.getOptions());
      expect(grid.getContainerNode().querySelector('.slick-gridmenu-container')).to.eq(null);
      expect(header.getBoundingClientRect().width).to.eq(width);
      control.destroy();
      grid.destroy();
    });
  });
});
