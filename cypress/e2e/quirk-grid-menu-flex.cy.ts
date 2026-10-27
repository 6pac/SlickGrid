const harness = `<!doctype html>
<link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css">
<link rel="stylesheet" href="/dist/styles/css/slick.gridmenu.css">
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
