import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent, SlickEventData } from '../../slick.core';
import { SlickColumnMenu } from '../slick.columnmenu';

describe('SlickColumnMenu', () => {
  let columns: any[];
  let grid: any;
  let menu: SlickColumnMenu;

  beforeEach(() => {
    columns = [{ id: 'first', field: 'first', name: 'First' }, { id: 'second', field: 'second', name: 'Second' }];
    grid = {
      getUID: () => 'test-grid', getPubSubService: vi.fn(), getColumns: () => columns,
      getVisibleColumns: () => columns.filter(column => !column.hidden),
      getColumnIndex: (id: string) => columns.findIndex(column => column.id === id),
      getOptions: () => ({ forceFitColumns: false, syncColumnCellResize: false }),
      applyHtmlCode: (element: HTMLElement, text: string) => { element.textContent = text; },
      updateColumnById: vi.fn((id, props) => Object.assign(columns.find(column => column.id === id), props)),
      updateColumns: vi.fn(), setOptions: vi.fn(), onColumnsReordered: new SlickEvent(), onHeaderContextMenu: new SlickEvent(),
    };
    menu = new SlickColumnMenu(columns, grid, { columnPicker: { columnTitle: 'Choose columns' } });
  });

  afterEach(() => { menu.destroy(); document.body.innerHTML = ''; });

  const open = (grid: any) => {
    const event = Object.assign(new SlickEventData(), { target: document.createElement('div'), pageX: 35, pageY: 45, clientY: 40 });
    grid.onHeaderContextMenu.notify({}, event, grid);
  };

  it('renders and positions the menu with associated column labels', () => {
    open(grid);
    const element = document.querySelector<HTMLElement>('.slick-columnpicker')!;
    expect(element.style.display).toBe('block');
    expect(element.style.left).toBe('25px');
    expect(element.style.top).toBe('35px');
    expect(element.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('label[for="test-gridcolpicker-first"]')?.textContent).toBe('First');
    expect(element.querySelector('.slick-gridmenu-custom')?.textContent).toBe('Choose columns');
  });

  it('updates column visibility, preserves the last visible column, and emits changes', () => {
    const changed = vi.fn();
    menu.onColumnsChanged.subscribe(changed);
    open(grid);
    document.querySelector<HTMLInputElement>('#test-gridcolpicker-first')!.click();
    expect(grid.updateColumnById).toHaveBeenCalledWith('first', { hidden: true });
    expect(changed.mock.calls[0][1]).toMatchObject({ columnId: 'first', showing: false });
    const last = document.querySelector<HTMLInputElement>('#test-gridcolpicker-second')!;
    last.click();
    expect(last.checked).toBe(true);
    expect(grid.updateColumnById).toHaveBeenCalledOnce();
  });

  it('updates resize options and closes on outside interaction', () => {
    open(grid);
    document.querySelector<HTMLInputElement>('[data-option="autoresize"]')!.click();
    document.querySelector<HTMLInputElement>('[data-option="syncresize"]')!.click();
    expect(grid.setOptions).toHaveBeenCalledWith({ forceFitColumns: true });
    expect(grid.setOptions).toHaveBeenCalledWith({ syncColumnCellResize: true });
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(document.querySelector<HTMLElement>('.slick-columnpicker')?.style.display).toBe('none');
  });

  it('unsubscribes only its own grid handlers when destroyed', () => {
    const headerContextMenuSpy = vi.fn();
    grid.onHeaderContextMenu.subscribe(headerContextMenuSpy);
    expect(grid.onHeaderContextMenu.subscriberCount).toBe(2);

    menu.destroy();

    expect(grid.onHeaderContextMenu.subscriberCount).toBe(1);
    expect(grid.onColumnsReordered.subscriberCount).toBe(0);
  });
});
