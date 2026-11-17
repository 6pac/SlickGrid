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
    vi.restoreAllMocks();
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
    expect(document.querySelector('.slick-gridmenu-item')?.getAttribute('aria-disabled')).toBe('true');
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

  it('drops the subscribers of its own events but only its own grid handlers when destroyed', () => {
    const commandSpy = vi.fn();
    const columnsReorderedSpy = vi.fn();
    const beforeDestroySpy = vi.fn();
    const setOptionsSpy = vi.fn();
    menu.onCommand.subscribe(commandSpy);
    grid.onColumnsReordered.subscribe(columnsReorderedSpy);
    grid.onBeforeDestroy.subscribe(beforeDestroySpy);
    grid.onSetOptions.subscribe(setOptionsSpy);

    menu.destroy();

    expect(menu.onCommand.subscriberCount).toBe(0);
    expect(grid.onColumnsReordered.subscriberCount).toBe(1);
    expect(grid.onBeforeDestroy.subscriberCount).toBe(1);
    expect(grid.onSetOptions.subscriberCount).toBe(1);
  });

  it('still notifies the next onBeforeDestroy subscriber when the grid destroy triggers its own destroy', () => {
    const beforeDestroySpy = vi.fn();
    grid.onBeforeDestroy.subscribe(beforeDestroySpy);
    expect(grid.onBeforeDestroy.subscriberCount).toBe(2);

    grid.onBeforeDestroy.notify({ grid }, new SlickEventData(), grid);

    expect(document.querySelector('.slick-gridmenu.grid-test')).toBeNull();
    expect(beforeDestroySpy).toHaveBeenCalledTimes(1);
    expect(grid.onBeforeDestroy.subscriberCount).toBe(1);
  });

  describe('command items', () => {
    const recreateWith = (options: Partial<GridMenuOption>) => {
      menu.destroy();
      Object.assign(menuOptions, options);
      createMenu();
    };
    const commandElements = () => Array.from(document.querySelectorAll<HTMLElement>('.slick-gridmenu.slick-menu-level-0 .slick-gridmenu-item'));

    it('renders divider items as non-clickable separators', () => {
      const action = vi.fn();
      const commandHandler = vi.fn();
      recreateWith({ commandItems: [{ command: 'one', title: 'One', action }, 'divider', { command: 'sep', divider: true, action }] });
      menu.onCommand.subscribe(commandHandler);
      openMenu();

      const [first, divider, dividerItem] = commandElements();
      expect(first.role).toBe('menuitem');
      expect(divider.role).toBe('separator');
      expect(divider.classList.contains('slick-gridmenu-item-divider')).toBe(true);
      expect(dividerItem.role).toBe('separator');
      expect(dividerItem.classList.contains('slick-gridmenu-item-divider')).toBe(true);

      divider.click();
      dividerItem.click();
      expect(action).not.toHaveBeenCalled();
      expect(commandHandler).not.toHaveBeenCalled();
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
    });

    it('applies the item css classes, tooltip, icon and text options', () => {
      recreateWith({
        commandItems: [{
          command: 'styled',
          title: 'Styled',
          cssClass: 'red bold',
          tooltip: 'Styled item',
          iconCssClass: 'sgi sgi-star',
          iconImage: 'star.png',
          textCssClass: 'italic',
          hidden: true,
        }],
      });
      openMenu();

      const [item] = commandElements();
      expect(item.className).toBe('slick-gridmenu-item slick-gridmenu-item-hidden red bold');
      expect(item.title).toBe('Styled item');
      const icon = item.querySelector<HTMLElement>('.slick-gridmenu-icon')!;
      expect(icon.classList.contains('sgi-star')).toBe(true);
      expect(icon.style.backgroundImage).toBe('url("star.png")');
      expect(item.querySelector('.slick-gridmenu-content')?.className).toBe('slick-gridmenu-content italic');
      expect(item.querySelector('.slick-gridmenu-content')?.textContent).toBe('Styled');
    });

    it('applies item visibility and usability overrides', () => {
      const visibility = vi.fn(() => false);
      const usableItem = { command: 'usable', title: 'Usable', disabled: true, itemUsabilityOverride: () => true };
      const unusableItem = { command: 'unusable', title: 'Unusable', itemUsabilityOverride: () => false };
      recreateWith({
        commandItems: [{ command: 'invisible', title: 'Invisible', itemVisibilityOverride: visibility }, usableItem, unusableItem],
      });
      openMenu();

      const items = commandElements();
      expect(items.map((item) => item.textContent)).toEqual(['Usable', 'Unusable']);
      expect(visibility).toHaveBeenCalledWith(expect.objectContaining({ grid, columns, visibleColumns: expect.any(Array) }));
      expect(usableItem.disabled).toBe(false);
      expect(items[0].getAttribute('aria-disabled')).toBeNull();
      expect((unusableItem as any).disabled).toBe(true);
      expect(items[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('does not hide the menu when the command handler prevents the default action', () => {
      recreateWith({ commandItems: [{ command: 'keep', title: 'Keep', action: (e) => e.preventDefault() }] });
      openMenu();
      commandElements()[0].click();

      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
    });

    it('renders a title only for the top level command list and updates the section titles', () => {
      recreateWith({ commandTitle: 'Commands', columnTitle: 'Columns' });
      openMenu();
      const titles = () => Array.from(document.querySelectorAll('.slick-gridmenu.grid-test .title')).map((elm) => elm.textContent);
      expect(titles()).toEqual(['Commands', 'Columns']);

      menu.updateAllTitles({ commandTitle: 'New commands', columnTitle: 'New columns' });
      expect(titles()).toContain('New columns');
      expect(titles()).toContain('New commands');

      menu.updateAllTitles({});
      expect(titles().every((title) => title === '')).toBe(true);
    });

    it('does not fail updating titles when none were rendered', () => {
      menu.updateAllTitles({ commandTitle: 'Commands', columnTitle: 'Columns' });

      expect(document.querySelectorAll('.slick-gridmenu.grid-test .title')).toHaveLength(0);
    });

    it('uses setOptions to change the commands shown on the next open', () => {
      menu.setOptions({ commandItems: [{ command: 'later', title: 'Added later' }] });
      openMenu();

      expect(commandElements().map((item) => item.textContent)).toEqual(['Added later']);
    });
  });

  describe('sub-menus', () => {
    let subAction: ReturnType<typeof vi.fn>;

    const buildMenu = (options: Partial<GridMenuOption> = {}) => {
      menu.destroy();
      subAction = vi.fn();
      Object.assign(menuOptions, {
        commandItems: [
          { command: 'plain', title: 'Plain' },
          {
            command: 'export menu',
            title: 'Export',
            subMenuTitle: 'Export as',
            subMenuTitleCssClass: 'italic underline',
            commandItems: [
              { command: 'csv', title: 'CSV', action: subAction },
              { command: 'more', title: 'More', commandItems: [{ command: 'pdf', title: 'PDF' }] },
            ],
          },
          { command: 'other menu', title: 'Other', commandItems: [{ command: 'x', title: 'X' }] },
        ],
      }, options);
      createMenu();
      openMenu();
    };
    const topItem = (title: string) => Array.from(document.querySelectorAll<HTMLElement>('.slick-menu-level-0 .slick-gridmenu-item'))
      .find((item) => item.querySelector('.slick-gridmenu-content')?.textContent === title)!;
    const subMenus = () => document.querySelectorAll<HTMLElement>('.slick-gridmenu.slick-submenu.grid-test');

    it('renders a chevron on items with sub-menu commands', () => {
      buildMenu();
      const exportItem = topItem('Export');

      expect(exportItem.classList.contains('slick-submenu-item')).toBe(true);
      expect(exportItem.querySelector('.sub-item-chevron')?.textContent).toBe('⮞');
      expect(topItem('Plain').querySelector('.sub-item-chevron')).toBeNull();
    });

    it('uses a custom chevron css class when configured', () => {
      buildMenu({ subItemChevronClass: 'sgi sgi-chevron-right' });
      const chevron = topItem('Export').querySelector('.sub-item-chevron')!;

      expect(chevron.classList.contains('sgi-chevron-right')).toBe(true);
      expect(chevron.textContent).toBe('');
    });

    it('opens a sub-menu with its title on mouseover, keeps it for the same parent and closes it over a plain item', () => {
      buildMenu();
      topItem('Export').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

      expect(subMenus()).toHaveLength(1);
      const subMenu = subMenus()[0];
      expect(subMenu.classList.contains('slick-menu-level-1')).toBe(true);
      expect(subMenu.dataset.subMenuParent).toBe('exportmenu');
      expect(subMenu.style.display).toBe('block');
      expect(subMenu.ariaLabel).toBe('Grid Menu');
      const title = subMenu.querySelector('.slick-menu-title')!;
      expect(title.textContent).toBe('Export as');
      expect(title.className).toBe('slick-menu-title italic underline');

      topItem('Export').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(subMenus()).toHaveLength(1);
      expect(subMenus()[0]).toBe(subMenu);

      topItem('Plain').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(subMenus()).toHaveLength(0);
    });

    it('replaces an open sub-menu when another sub-menu parent is hovered', () => {
      buildMenu();
      topItem('Export').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      topItem('Other').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

      expect(subMenus()).toHaveLength(1);
      expect(subMenus()[0].dataset.subMenuParent).toBe('othermenu');
      expect(subMenus()[0].querySelector('.slick-menu-title')).toBeNull();
    });

    it('opens nested sub-menus by click and runs sub-menu commands', () => {
      buildMenu({ subMenuOpenByEvent: 'click' });
      const commandHandler = vi.fn();
      menu.onCommand.subscribe(commandHandler);

      topItem('Plain').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(subMenus()).toHaveLength(0);

      topItem('Export').click();
      expect(subMenus()).toHaveLength(1);
      const level1 = subMenus()[0];
      const level1Items = level1.querySelectorAll<HTMLElement>('.slick-gridmenu-item');
      level1Items[1].click();

      const level2 = document.querySelector<HTMLElement>('.slick-gridmenu.slick-menu-level-2.grid-test')!;
      expect(level2).toBeTruthy();
      expect(level2.ariaLabel).toBe('SubMenu');
      expect(level2.dataset.subMenuParent).toBe('exportmenu');
      expect(level2.textContent).toContain('PDF');

      level1Items[0].click();
      expect(subAction).toHaveBeenCalledOnce();
      expect(commandHandler.mock.calls[0][1]).toEqual(expect.objectContaining({ command: 'csv' }));
      expect(subMenus()).toHaveLength(0);
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('none');
    });

    it('drops a sub-menu to the right when there is room and to the left otherwise', () => {
      buildMenu({ subMenuOpenByEvent: 'click' });
      const clientWidth = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
      const exportItem = topItem('Export');
      vi.spyOn(exportItem, 'getBoundingClientRect').mockReturnValue({ top: 50, left: 100 } as DOMRect);
      vi.spyOn(exportItem, 'offsetWidth', 'get').mockReturnValue(120);

      exportItem.click();
      let subMenu = subMenus()[0];
      expect(subMenu.classList.contains('dropright')).toBe(true);
      expect(subMenu.style.top).toBe('50px');
      expect(subMenu.style.left).toBe('220px');

      const otherItem = topItem('Other');
      vi.spyOn(otherItem, 'getBoundingClientRect').mockReturnValue({ top: 70, left: 100 } as DOMRect);
      vi.mocked(grid.getGridPosition).mockReturnValueOnce({ width: 50, left: 0, top: 0, right: 50, bottom: 500 } as any);
      otherItem.click();
      subMenu = subMenus()[0];
      expect(subMenu.classList.contains('dropleft')).toBe(true);
      expect(subMenu.classList.contains('dropright')).toBe(false);
      expect(subMenu.style.top).toBe('70px');
      expect(subMenu.style.left).toBe('100px');
      clientWidth.mockRestore();
    });

    it('closes previous sub-menus when the sub-menu is opened from a grid cell', () => {
      buildMenu({ subMenuOpenByEvent: 'click' });
      topItem('Export').click();
      const previous = subMenus()[0];
      const cell = document.createElement('div');
      cell.className = 'slick-cell';
      document.body.appendChild(cell);

      (menu as any).repositionSubMenu(menuOptions.commandItems![1], 0, { target: cell });

      expect(previous.isConnected).toBe(false);
      expect(subMenus()).toHaveLength(1);
    });

    it('keeps the menu open on a body mousedown inside a sub-menu', () => {
      buildMenu();
      topItem('Export').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      subMenus()[0].querySelector('.slick-gridmenu-item')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(document.querySelector<HTMLElement>('.slick-gridmenu.slick-menu-level-0')?.style.display).toBe('block');
      expect(subMenus()).toHaveLength(1);
    });

    it('only closes open sub-menus when an item without a command or sub-menu is clicked', () => {
      buildMenu({ subMenuOpenByEvent: 'click' });
      menu.destroy();
      menuOptions.commandItems = [{ title: 'No command', command: '' }, ...menuOptions.commandItems!.slice(1)];
      createMenu();
      const commandHandler = vi.fn();
      menu.onCommand.subscribe(commandHandler);
      openMenu();
      topItem('Export').click();
      expect(subMenus()).toHaveLength(1);

      topItem('No command').click();

      expect(commandHandler).not.toHaveBeenCalled();
      expect(subMenus()).toHaveLength(0);
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.slick-menu-level-0')?.style.display).toBe('block');
    });
  });

  describe('menu button and positioning', () => {
    it('places the button in the pre-header panel when requested', () => {
      menu.destroy();
      container.innerHTML = '<div class="slick-preheader-root"><div class="slick-preheader-panel"></div></div><div class="slick-header-root"><div class="slick-header-left"></div></div>';
      menuOptions.iconButtonContainer = 'preheader';
      createMenu();

      expect(container.querySelector('.slick-preheader-root > .slick-gridmenu-container > .slick-gridmenu-button')).toBeTruthy();
      expect(container.querySelector('.slick-header-root .slick-gridmenu-button')).toBeNull();
    });

    it('warns and falls back to the column header when the pre-header panel does not exist', () => {
      menu.destroy();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      menuOptions.iconButtonContainer = 'preheader';
      createMenu();

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('createPreHeaderPanel: true'));
      expect(container.querySelector('.slick-header-root > .slick-gridmenu-container > .slick-gridmenu-button')).toBeTruthy();
    });

    it('does not create a button when showButton is false', () => {
      menu.destroy();
      menuOptions.showButton = false;
      createMenu();

      expect(container.querySelector('.slick-gridmenu-button')).toBeNull();
      expect(document.querySelector('.slick-gridmenu.grid-test')).toBeTruthy();
    });

    it('uses a default image, a custom image or an icon class for the button', () => {
      expect(container.querySelector<HTMLImageElement>('.slick-gridmenu-button img')?.getAttribute('src')).toBe('../images/drag-handle.png');
      expect(container.querySelector<HTMLElement>('.slick-gridmenu-container')?.style.width).toBe('14px');

      menu.destroy();
      menuOptions.iconImage = 'menu.png';
      menuOptions.menuWidth = 20;
      createMenu();
      expect(container.querySelector<HTMLImageElement>('.slick-gridmenu-button img')?.getAttribute('src')).toBe('menu.png');
      expect(container.querySelector<HTMLElement>('.slick-gridmenu-container')?.style.width).toBe('22px');

      menu.destroy();
      menuOptions.iconCssClass = 'sgi sgi-menu';
      createMenu();
      const button = container.querySelector<HTMLElement>('.slick-gridmenu-button')!;
      expect(button.classList.contains('sgi-menu')).toBe(true);
      expect(button.querySelector('img')).toBeNull();
      expect(container.querySelector<HTMLElement>('.slick-gridmenu-container')?.style.width).toBe('22px');
    });

    it('widens the button slot when the icon class renders wider than the slot', () => {
      menu.destroy();
      menuOptions.iconCssClass = 'sgi sgi-menu';
      const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(17.2);
      createMenu();

      expect(container.querySelector<HTMLElement>('.slick-gridmenu-container')?.style.width).toBe('20px');
      scrollWidth.mockRestore();
    });

    it('positions the menu at the click, below and to the left of the pointer', () => {
      const button = container.querySelector<HTMLButtonElement>('.slick-gridmenu-button')!;
      const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;
      vi.spyOn(menuElement, 'offsetWidth', 'get').mockReturnValue(100);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 300, clientY: 40 });
      Object.defineProperties(event, { pageX: { value: 300 }, pageY: { value: 40 } });
      button.dispatchEvent(event);

      expect(menuElement.style.top).toBe('50px');
      expect(menuElement.style.left).toBe('205px');
      expect(menuElement.style.maxHeight).toBe(`${window.innerHeight - 40 - 15}px`);
    });

    it('positions the menu from the button when click repositioning is disabled and applies size options', () => {
      menu.destroy();
      Object.assign(menuOptions, { useClickToRepositionMenu: false, contentMinWidth: 250, height: 300, marginBottom: 0, maxHeight: 400, width: 'auto', maxWidth: 500 });
      createMenu();
      const button = container.querySelector<HTMLButtonElement>('.slick-gridmenu-button')!;
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({ top: 20, left: 400, width: 14 } as DOMRect);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, clientX: 300, clientY: 40 });
      Object.defineProperties(event, { pageX: { value: 300 }, pageY: { value: 40 } });
      button.dispatchEvent(event);
      const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;

      expect(menuElement.style.top).toBe('40px');
      expect(menuElement.style.left).toBe('170px');
      expect(menuElement.style.minWidth).toBe('250px');
      expect(menuElement.style.height).toBe('300px');
      expect(menuElement.style.width).toBe('auto');
      expect(menuElement.style.maxHeight).toBe('400px');
    });

    it('opens from a touch event on a wrapper element around the button', () => {
      const wrapper = document.createElement('span');
      const inner = document.createElement('i');
      wrapper.appendChild(inner);
      const preventDefault = vi.fn();

      menu.showGridMenu({ touches: [{ clientX: 10, clientY: 20, pageX: 10, pageY: 20, target: inner }], target: inner, preventDefault } as any);

      expect(preventDefault).toHaveBeenCalled();
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.maxHeight).toBe(`${window.innerHeight - 20 - 15}px`);
    });

    it('opens from a container that holds the button and notifies onAfterMenuShow', () => {
      const afterShow = vi.fn();
      menu.onAfterMenuShow.subscribe(afterShow);
      const wrapper = document.createElement('div');
      wrapper.appendChild(document.createElement('button'));
      const event = new MouseEvent('click', { cancelable: true });
      Object.defineProperty(event, 'target', { value: wrapper });

      menu.showGridMenu(event as any);

      expect(afterShow).toHaveBeenCalledOnce();
      expect(afterShow.mock.calls[0][1]).toEqual(expect.objectContaining({ grid, menu: expect.any(HTMLElement), allColumns: columns }));
    });

    it('stops after onAfterMenuShow returns false but leaves the menu shown', () => {
      menu.onAfterMenuShow.subscribe(() => false);
      openMenu();

      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
    });
  });

  describe('column picker', () => {
    it('checks sync resize from the grid options and uses the inner HTML of element column names', () => {
      vi.mocked(grid.getOptions).mockReturnValue({ forceFitColumns: false, syncColumnCellResize: true });
      const nameElm = document.createElement('span');
      nameElm.innerHTML = '<b>Bold</b>';
      const previousName = columns[1].name;
      columns[1].name = nameElm as any;
      menu.destroy();
      menuOptions.forceFitTitle = 'Fit';
      menuOptions.syncResizeTitle = 'Sync';
      createMenu();
      openMenu();

      expect(document.querySelector<HTMLInputElement>('[data-option="autoresize"]')?.checked).toBe(false);
      expect(document.querySelector<HTMLInputElement>('[data-option="syncresize"]')?.checked).toBe(true);
      expect(document.querySelector('li[aria-label="Fit"]')).toBeTruthy();
      expect(document.querySelector('li[aria-label="Sync"]')).toBeTruthy();
      expect(document.querySelector('#grid-test-gridmenu-colpicker-last')?.parentElement?.ariaLabel).toBe('<b>Bold</b>');
      columns[1].name = previousName;
      vi.mocked(grid.getOptions).mockReturnValue({ forceFitColumns: true, syncColumnCellResize: false });
    });

    it('hides the excluded column entries and only keeps the separator when one option is shown', () => {
      menu.destroy();
      menuOptions.hideForceFitButton = true;
      createMenu();
      openMenu();

      expect(document.querySelector('#grid-test-gridmenu-colpicker-excluded')?.parentElement?.className).toBe('hidden');
      expect(document.querySelectorAll('.slick-gridmenu-list hr')).toHaveLength(1);
      expect(document.querySelector('[data-option="autoresize"]')).toBeNull();
      expect(document.querySelector('[data-option="syncresize"]')).toBeTruthy();
    });

    it('shows a hidden column again when its checkbox is checked', () => {
      const changed = vi.fn();
      menu.onColumnsChanged.subscribe(changed);
      openMenu();
      document.querySelector<HTMLInputElement>('#grid-test-gridmenu-colpicker-hidden')!.click();

      expect(grid.updateColumnById).toHaveBeenCalledWith('hidden', { hidden: false });
      expect(changed.mock.calls[0][1]).toEqual(expect.objectContaining({ columnId: 'hidden', showing: true }));
    });

    it('ignores clicks inside the menu that are not on a checkbox', () => {
      openMenu();
      document.querySelector<HTMLElement>('.slick-gridmenu-list li')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(grid.setOptions).not.toHaveBeenCalled();
      expect(grid.updateColumnById).not.toHaveBeenCalled();
    });
  });

  describe('closing', () => {
    it('closes from the close button even though it is inside the menu', () => {
      openMenu();
      const menuElement = document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')!;
      const closeSpan = menuElement.querySelector<HTMLElement>('span.close')!;
      expect(menuElement.querySelector('button.close')?.ariaLabel).toBe('Close');

      closeSpan.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(menuElement.style.display).toBe('none');
    });

    it('does not close on an outside mousedown whose default was prevented', () => {
      openMenu();
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      event.preventDefault();
      document.body.dispatchEvent(event);

      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('block');
    });

    it('does not notify onMenuClose when hiding a menu that is not open', () => {
      const onClose = vi.fn();
      menu.onMenuClose.subscribe(onClose);
      menu.hideMenu(new SlickEventData() as any);

      expect(onClose).not.toHaveBeenCalled();
      expect(document.querySelector<HTMLElement>('.slick-gridmenu.grid-test')?.style.display).toBe('none');
    });

    it('destroys itself when the grid is destroyed', () => {
      grid.onBeforeDestroy.notify({ grid } as any);

      expect(container.querySelector('.slick-gridmenu-button')).toBeNull();
      expect(document.querySelector('.slick-gridmenu.grid-test')).toBeNull();
    });
  });
});
