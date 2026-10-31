import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import type { Column, GridOption } from '../../models';
import { SlickColumnPicker } from '../slick.columnpicker';

describe('SlickColumnPicker', () => {
  const columns: Column[] = [
    { id: 'first', field: 'first', name: 'First name', width: 100 },
    { id: 'last', field: 'last', name: 'Last name', width: 90 },
    { id: 'hidden', field: 'hidden', name: 'Hidden column', width: 80, hidden: true },
    { id: 'excluded', field: 'excluded', name: 'Excluded column', width: 70, excludeFromColumnPicker: true },
  ];

  const grid = {
    getUID: vi.fn(() => 'grid-test'),
    getPubSubService: vi.fn(),
    getColumns: vi.fn(() => columns),
    getVisibleColumns: vi.fn(() => columns.filter((column) => !column.hidden)),
    getColumnIndex: vi.fn((id: string | number) => columns.findIndex((column) => column.id === id)),
    getOptions: vi.fn(() => ({ forceFitColumns: true, syncColumnCellResize: false })),
    getGridPosition: vi.fn(() => ({ width: 400 })),
    updateColumnById: vi.fn((id: string | number, props: Partial<Column>) => {
      const column = columns.find((item) => item.id === id);
      if (column) Object.assign(column, props);
    }),
    updateColumns: vi.fn(),
    setOptions: vi.fn(),
    applyHtmlCode: vi.fn((element: HTMLElement, html: string) => { element.innerHTML = html; }),
    onColumnsReordered: new SlickEvent(),
    onHeaderContextMenu: new SlickEvent(),
    onPreHeaderContextMenu: new SlickEvent(),
  } as unknown as SlickGrid;

  let picker: SlickColumnPicker;
  let options: GridOption;

  const openMenu = (target: EventTarget | null = document.createElement('div')) => {
    const eventData = Object.assign(new SlickEventData(), {
      target,
      pageX: 35,
      pageY: 45,
      clientY: 40,
    });
    const preventDefault = vi.spyOn(eventData, 'preventDefault');
    grid.onHeaderContextMenu.notify({} as any, eventData, grid);
    return { eventData, preventDefault };
  };

  const resetGridEvents = () => {
    (grid as any).onColumnsReordered = new SlickEvent();
    (grid as any).onHeaderContextMenu = new SlickEvent();
    (grid as any).onPreHeaderContextMenu = new SlickEvent();
  };

  beforeEach(() => {
    columns.forEach((column) => { delete column.hidden; });
    columns[2].hidden = true;
    vi.clearAllMocks();
    resetGridEvents();
    options = {
      columnPicker: {
        hideForceFitButton: false,
        hideSyncResizeButton: false,
      },
    } as GridOption;
    picker = new SlickColumnPicker(columns, grid, options);
  });

  afterEach(() => {
    picker.destroy();
    document.body.innerHTML = '';
  });

  it('creates a hidden menu in the document and exposes the supplied columns', () => {
    expect(document.querySelector('.slick-columnpicker.grid-test')).toBeTruthy();
    expect(picker.getAllColumns()).toBe(columns);
    expect(picker.getVisibleColumns()).toEqual(columns.filter((column) => !column.hidden));
  });

  it('renders column checkboxes, labels, and configured option toggles on the header menu event', () => {
    const { preventDefault } = openMenu();
    const menu = document.querySelector<HTMLElement>('.slick-columnpicker')!;

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(menu.style.display).toBe('block');
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(menu.querySelectorAll('input[data-columnid]')).toHaveLength(4);
    expect(menu.querySelector('label[for="grid-testcolpicker-first"]')?.textContent).toBe('First name');
    expect(menu.querySelector<HTMLInputElement>('#grid-testcolpicker-first')?.checked).toBe(true);
    expect(menu.querySelector<HTMLInputElement>('#grid-testcolpicker-hidden')?.checked).toBe(false);
    expect(menu.querySelector('#grid-testcolpicker-forcefit')).toBeTruthy();
    expect(menu.querySelector<HTMLInputElement>('#grid-testcolpicker-forcefit')?.checked).toBe(true);
    expect(menu.querySelector<HTMLInputElement>('#grid-testcolpicker-syncresize')?.checked).toBe(false);
  });

  it('uses a custom header value extractor and applies its HTML result', () => {
    const extractor = vi.fn((column: Column) => `Column: ${column.name}`);
    picker.destroy();
    resetGridEvents();
    options.columnPicker!.headerColumnValueExtractor = extractor;
    picker = new SlickColumnPicker(columns, grid, options);
    openMenu();

    expect(extractor).toHaveBeenCalledTimes(columns.length);
    expect(document.querySelector('label[for="grid-testcolpicker-first"]')?.innerHTML).toBe('Column: First name');
  });

  it('supports a custom title above the column list', () => {
    picker.destroy();
    resetGridEvents();
    options.columnPicker!.columnTitle = 'Choose columns';
    picker = new SlickColumnPicker(columns, grid, options);
    openMenu();

    expect(document.querySelector('.slick-gridmenu-custom')?.textContent).toBe('Choose columns');
  });

  it('omits force fit and synchronous resize rows when configured to hide them', () => {
    picker.destroy();
    resetGridEvents();
    options.columnPicker!.hideForceFitButton = true;
    options.columnPicker!.hideSyncResizeButton = true;
    picker = new SlickColumnPicker(columns, grid, options);
    openMenu();

    expect(document.querySelector('[data-option="autoresize"]')).toBeNull();
    expect(document.querySelector('[data-option="syncresize"]')).toBeNull();
  });

  it('updates column visibility and emits onColumnsChanged when a column is toggled', () => {
    const changed = vi.fn();
    picker.onColumnsChanged.subscribe(changed);
    openMenu();
    const checkbox = document.querySelector<HTMLInputElement>('#grid-testcolpicker-first')!;
    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(grid.updateColumnById).toHaveBeenCalledWith('first', { hidden: true });
    expect(grid.updateColumns).toHaveBeenCalled();
    expect(changed.mock.calls[0][1]).toEqual(expect.objectContaining({ columnId: 'first', showing: false, grid }));
  });

  it('does not hide the final visible column when its checkbox is cleared', () => {
    vi.mocked(grid.getVisibleColumns).mockReturnValueOnce([columns[0]]);
    openMenu();
    const checkbox = document.querySelector<HTMLInputElement>('#grid-testcolpicker-first')!;
    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(checkbox.checked).toBe(true);
    expect(grid.updateColumnById).not.toHaveBeenCalled();
    expect(grid.updateColumns).not.toHaveBeenCalled();
  });

  it('updates force fit and sync resize options from their menu checkboxes', () => {
    openMenu();
    const forceFit = document.querySelector<HTMLInputElement>('[data-option="autoresize"]')!;
    forceFit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const syncResize = document.querySelector<HTMLInputElement>('[data-option="syncresize"]')!;
    syncResize.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(grid.setOptions).toHaveBeenNthCalledWith(1, { forceFitColumns: false });
    expect(grid.setOptions).toHaveBeenNthCalledWith(2, { syncColumnCellResize: true });
    expect(grid.updateColumns).toHaveBeenCalledOnce();
  });

  it('updates visibility through setColumnVisibility using either an index or column id', () => {
    const changed = vi.fn();
    picker.onColumnsChanged.subscribe(changed);
    picker.setColumnVisibility('last', false);

    expect(grid.updateColumnById).toHaveBeenCalledWith('last', { hidden: true });
    expect(grid.updateColumns).toHaveBeenCalledOnce();
    expect(changed.mock.calls[0][1]).toEqual(expect.objectContaining({ columnId: 'last', showing: false }));

    picker.setColumnVisibility(0, true);
    expect(grid.updateColumnById).toHaveBeenLastCalledWith('first', { hidden: false });
    expect(changed).toHaveBeenCalledTimes(2);
  });

  it('looks up a column and its index by id', () => {
    expect(picker.getColumnbyId('last')).toBe(columns[1]);
    expect(picker.getColumnbyId('missing')).toBeNull();
    expect(picker.getColumnIndexbyId('hidden')).toBe(2);
    expect(picker.getColumnIndexbyId('missing')).toBe(-1);
  });

  it('synchronizes its column list after the grid columns are reordered', () => {
    const reordered = [columns[1], columns[0]];
    vi.mocked(grid.getColumns).mockReturnValueOnce(reordered);
    grid.onColumnsReordered.notify({} as any, new SlickEventData(), grid);

    expect(picker.getAllColumns()).toEqual(reordered);
  });

  it('opens from a pre-header context menu only when the target is a column header', () => {
    const eventData = Object.assign(new SlickEventData(), { target: null });
    const header = document.createElement('div');
    header.classList.add('slick-header-column');
    (eventData as any).target = header;
    grid.onPreHeaderContextMenu.notify({} as any, eventData, grid);

    expect(document.querySelector<HTMLElement>('.slick-columnpicker')?.style.display).toBe('block');
  });

  it('closes on an outside body mousedown but remains open for clicks inside the menu', () => {
    openMenu();
    const menu = document.querySelector<HTMLElement>('.slick-columnpicker')!;
    menu.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menu.style.display).toBe('block');

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menu.style.display).toBe('none');
    expect(menu.getAttribute('aria-expanded')).toBe('false');
  });

  it('positions the menu using the context menu event coordinates', () => {
    openMenu();
    const menu = document.querySelector<HTMLElement>('.slick-columnpicker')!;

    expect(menu.style.left).toBe('35px');
    expect(menu.style.top).toBe('35px');
    expect(menu.style.maxHeight).toBe(`${window.innerHeight - 40}px`);
  });

  it('removes the menu and event bindings when destroyed', () => {
    const menu = document.querySelector('.slick-columnpicker');
    expect(menu).toBeTruthy();
    picker.destroy();

    expect(document.querySelector('.slick-columnpicker')).toBeNull();
  });
});
