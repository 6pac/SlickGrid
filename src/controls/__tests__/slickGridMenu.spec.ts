import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import type { Column, GridMenuOption, GridOption } from '../../models';
import { SlickGridMenu } from '../slick.gridmenu';

describe('SlickGridMenu', () => {
  const columns: Column[] = [
    { id: 'first', field: 'first', name: 'First name', width: 100 },
    { id: 'last', field: 'last', name: 'Last name', width: 90 },
    { id: 'hidden', field: 'hidden', name: 'Hidden column', width: 80, hidden: true },
    { id: 'excluded', field: 'excluded', name: 'Excluded column', width: 70, excludeFromGridMenu: true },
  ];

  const container = document.createElement('div');
  container.innerHTML = '<div class="slick-header-root"><div class="slick-header-left"></div></div>';

  const grid = {
    getUID: vi.fn(() => 'grid-test'),
    getPubSubService: vi.fn(),
    getContainerNode: vi.fn(() => container),
    getColumns: vi.fn(() => columns),
    getVisibleColumns: vi.fn(() => columns.filter((column) => !column.hidden)),
    getColumnIndex: vi.fn((id: string | number) => columns.findIndex((column) => column.id === id)),
    getOptions: vi.fn(() => ({ forceFitColumns: true, syncColumnCellResize: false })),
    getGridPosition: vi.fn(() => ({ width: 500, left: 0, top: 0, right: 500, bottom: 500 })),
    updateColumnById: vi.fn((id: string | number, props: Partial<Column>) => {
      const column = columns.find((item) => item.id === id);
      if (column) Object.assign(column, props);
    }),
    updateColumns: vi.fn(),
    setOptions: vi.fn(),
    applyHtmlCode: vi.fn((element: HTMLElement, html: string) => { element.innerHTML = html; }),
    sanitizeHtmlString: vi.fn((html: string) => html),
    onColumnsReordered: new SlickEvent(),
    onBeforeDestroy: new SlickEvent(),
    onSetOptions: new SlickEvent(),
  } as unknown as SlickGrid;

  let menu: SlickGridMenu;
  let gridOptions: GridOption;
  let menuOptions: GridMenuOption;

  const openMenu = () => {
    const button = container.querySelector<HTMLButtonElement>('.slick-gridmenu-button')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 30, clientY: 40 });
    button.dispatchEvent(event);
    return event;
  };

  const createMenu = () => {
    (grid as any).onColumnsReordered = new SlickEvent();
    (grid as any).onBeforeDestroy = new SlickEvent();
    (grid as any).onSetOptions = new SlickEvent();
    menu = new SlickGridMenu(columns, grid, gridOptions);
  };

  beforeEach(() => {
    columns.forEach((column) => { delete column.hidden; });
    columns[2].hidden = true;
    vi.clearAllMocks();
    vi.mocked(grid.getVisibleColumns).mockImplementation(() => columns.filter((column) => !column.hidden));
    container.innerHTML = '<div class="slick-header-root"><div class="slick-header-left"></div></div>';
    menuOptions = {
      commandItems: [],
      hideForceFitButton: false,
      hideSyncResizeButton: false,
    };
    gridOptions = { enableGridMenu: true, gridMenu: menuOptions } as GridOption;
    createMenu();
  });

  afterEach(() => {
    menu.destroy();
    document.body.innerHTML = '';
    container.innerHTML = '';
  });

  it('creates the menu button, hidden menu, and command area', () => {
    expect(container.querySelector('.slick-gridmenu-button')).toBeTruthy();
    const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test');
    expect(menuElement?.style.display).toBe('none');
    expect(menuElement?.querySelector('.slick-gridmenu-command-list')).toBeTruthy();
    expect(menu.getAllColumns()).toBe(columns);
  });

  it('opens from the menu button and renders column and grid option checkboxes', () => {
    const event = openMenu();
    const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;

    expect(event.defaultPrevented).toBe(true);
    expect(menuElement.style.display).toBe('block');
    expect(menuElement.getAttribute('aria-label')).toBe('Grid Menu');
    expect(menuElement.querySelectorAll('input[data-columnid]')).toHaveLength(columns.length);
    expect(menuElement.querySelector<HTMLInputElement>('#grid-test-gridmenu-colpicker-first')?.checked).toBe(true);
    expect(menuElement.querySelector<HTMLInputElement>('#grid-test-gridmenu-colpicker-hidden')?.checked).toBe(false);
    expect(menuElement.querySelector('label[for="grid-test-gridmenu-colpicker-first"]')?.textContent).toBe('First name');
    expect(menuElement.querySelector('[data-option="autoresize"]')).toBeTruthy();
    expect(menuElement.querySelector('[data-option="syncresize"]')).toBeTruthy();
  });

  it('renders a custom title, custom column labels, and configured command items', () => {
    menu.destroy();
    menuOptions.columnTitle = 'Visible columns';
    menuOptions.commandTitle = 'Actions';
    menuOptions.headerColumnValueExtractor = (column) => `Column: ${column.name}`;
    menuOptions.commandItems = [{ command: 'refresh', title: 'Refresh data' }];
    createMenu();
    openMenu();

    const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;
    expect(menuElement.querySelector('.title')?.textContent).toBe('Actions');
    expect(menuElement.querySelector('.slick-gridmenu-list label')?.textContent).toBe('Column: First name');
    expect(menuElement.textContent).toContain('Visible columns');
    expect(menuElement.textContent).toContain('Refresh data');
  });

  it('omits force fit and sync resize choices when hidden in the options', () => {
    menu.destroy();
    menuOptions.hideForceFitButton = true;
    menuOptions.hideSyncResizeButton = true;
    createMenu();
    openMenu();

    expect(document.querySelector('[data-option="autoresize"]')).toBeNull();
    expect(document.querySelector('[data-option="syncresize"]')).toBeNull();
  });

  it('updates column visibility and emits onColumnsChanged when a column checkbox is clicked', () => {
    const changed = vi.fn();
    menu.onColumnsChanged.subscribe(changed);
    openMenu();
    document.querySelector<HTMLInputElement>('#grid-test-gridmenu-colpicker-first')!.click();

    expect(grid.updateColumnById).toHaveBeenCalledWith('first', { hidden: true });
    expect(grid.updateColumns).toHaveBeenCalledOnce();
    expect(changed.mock.calls[0][1]).toEqual(expect.objectContaining({ columnId: 'first', showing: false, grid }));
  });

  it('keeps the last visible column checked', () => {
    vi.mocked(grid.getVisibleColumns).mockReturnValue([columns[0]]);
    openMenu();
    const checkbox = document.querySelector<HTMLInputElement>('#grid-test-gridmenu-colpicker-first')!;
    checkbox.click();

    expect(checkbox.checked).toBe(true);
    expect(grid.updateColumnById).not.toHaveBeenCalled();
    expect(grid.updateColumns).not.toHaveBeenCalled();
  });

  it('sets force fit and synchronized cell resize options from their checkboxes', () => {
    openMenu();
    document.querySelector<HTMLInputElement>('[data-option="autoresize"]')!.click();
    document.querySelector<HTMLInputElement>('[data-option="syncresize"]')!.click();

    expect(grid.setOptions).toHaveBeenNthCalledWith(1, { forceFitColumns: false });
    expect(grid.setOptions).toHaveBeenNthCalledWith(2, { syncColumnCellResize: true });
    expect(grid.updateColumns).toHaveBeenCalledOnce();
  });

  it('emits command events and runs an item action when a command is selected', () => {
    menu.destroy();
    const action = vi.fn();
    const commandHandler = vi.fn();
    menuOptions.commandItems = [{ command: 'refresh', title: 'Refresh', action }];
    createMenu();
    menu.onCommand.subscribe(commandHandler);
    openMenu();
    document.querySelector<HTMLElement>('.slick-gridmenu-item')!.click();

    expect(commandHandler.mock.calls[0][1]).toEqual(expect.objectContaining({ command: 'refresh', grid }));
    expect(action).toHaveBeenCalledOnce();
    expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('none');
  });

  it('does not run disabled command items', () => {
    menu.destroy();
    const action = vi.fn();
    menuOptions.commandItems = [{ command: 'disabled', title: 'Disabled', disabled: true, action }];
    createMenu();
    const commandHandler = vi.fn();
    menu.onCommand.subscribe(commandHandler);
    openMenu();
    document.querySelector<HTMLElement>('.slick-gridmenu-item')!.click();

    expect(action).not.toHaveBeenCalled();
    expect(commandHandler).not.toHaveBeenCalled();
  });

  it('honors menu usability and before-show callbacks that reject opening', () => {
    menu.destroy();
    menuOptions.menuUsabilityOverride = () => false;
    createMenu();
    openMenu();
    expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('none');

    menu.destroy();
    menuOptions.menuUsabilityOverride = undefined;
    createMenu();
    menu.onBeforeMenuShow.subscribe(() => false);
    openMenu();
    expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('none');
  });

  it('can keep the menu open after executing a command', () => {
    menu.destroy();
    menuOptions.leaveOpen = true;
    menuOptions.commandItems = [{ command: 'refresh', title: 'Refresh' }];
    createMenu();
    openMenu();
    document.querySelector<HTMLElement>('.slick-gridmenu-item')!.click();

    expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
  });

  it('closes on an outside body mousedown but not on a click inside the menu', () => {
    openMenu();
    const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;
    menuElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menuElement.style.display).toBe('block');
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(menuElement.style.display).toBe('none');
  });

  it('honors onMenuClose cancellation', () => {
    openMenu();
    menu.onMenuClose.subscribe(() => false);
    menu.hideMenu(new SlickEventData() as any);

    expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
  });

  it('updates its column list when the grid reports reordered columns', () => {
    const reordered = [columns[1], columns[0]];
    vi.mocked(grid.getColumns).mockReturnValueOnce(reordered);
    grid.onColumnsReordered.notify({} as any, new SlickEventData(), grid);

    expect(menu.getAllColumns()).toEqual(reordered);
  });

  it('recreates the menu when requested and removes all menu DOM when destroyed', () => {
    menu.recreateGridMenu();
    expect(container.querySelector('.slick-gridmenu-button')).toBeTruthy();
    expect(document.querySelector('.slick-gridmenu.grid-test')).toBeTruthy();
    menu.destroy();
    expect(container.querySelector('.slick-gridmenu-button')).toBeNull();
    expect(document.querySelector('.slick-gridmenu.grid-test')).toBeNull();
  });
});
