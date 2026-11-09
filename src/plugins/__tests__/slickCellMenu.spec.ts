import { afterEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { CellMenuOption, Column } from '../../models';
import { SlickCellMenu } from '../slick.cellmenu';

describe('CellMenu Plugin', () => {
  const column: Column = {
    id: 'actions',
    field: 'actions',
    name: 'Actions',
    cellMenu: { commandItems: [{ command: 'edit', title: 'Edit' }] },
  };
  const grid = {
    getCellFromEvent: vi.fn(() => ({ cell: 0, row: 0 })),
    getColumns: vi.fn(() => [column]),
    getDataItem: vi.fn(() => ({ id: 1 })),
    getEditorLock: vi.fn(() => ({ commitCurrentEdit: vi.fn(() => true) })),
    getGridPosition: vi.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0, width: 400 })),
    getOptions: vi.fn(() => ({})),
    getPubSubService: vi.fn(() => undefined),
    getUID: vi.fn(() => 'test-grid'),
    onClick: new SlickEvent(),
    onScroll: new SlickEvent(),
  } as unknown as SlickGrid;
  let plugin: SlickCellMenu;

  const openMenu = (cellMenu: CellMenuOption = { commandItems: [{ command: 'edit', title: 'Edit' }] }) => {
    column.cellMenu = cellMenu;
    plugin = new SlickCellMenu({});
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });
    grid.onClick.notify({} as any, event, grid);
    return document.body.querySelector('.slick-cell-menu.test-grid') as HTMLDivElement | null;
  };

  afterEach(() => {
    plugin?.destroy();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('uses the default options when constructed without options', () => {
    plugin = new SlickCellMenu({});
    expect(plugin.options.autoAdjustDrop).toBe(true);
    expect(plugin.options.autoAlignSide).toBe(true);
    expect(plugin.options.width).toBe('auto');
  });

  it('merges options supplied after construction', () => {
    plugin = new SlickCellMenu({});
    plugin.setOptions({ commandTitle: 'Actions' });
    expect(plugin.options.commandTitle).toBe('Actions');
    expect(plugin.options.width).toBe('auto');
  });

  it('opens the column menu when the grid click event fires', () => {
    plugin = new SlickCellMenu({});
    plugin.init(grid);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onClick.notify({} as any, event, grid);

    const menu = document.body.querySelector('.slick-cell-menu.test-grid');
    expect(menu).not.toBeNull();
    expect(menu?.querySelector('.slick-cell-menu-command-list')?.textContent).toContain('Edit');
    expect(event.defaultPrevented).toBe(true);
  });

  it('closes the menu when clicking elsewhere in the document body', () => {
    plugin = new SlickCellMenu({} as Partial<CellMenuOption>);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });
    grid.onClick.notify({} as any, event, grid);
    expect(document.body.querySelector('.slick-cell-menu.test-grid')).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(document.body.querySelector('.slick-cell-menu.test-grid')).toBeNull();
  });

  it('omits commands hidden by itemVisibilityOverride', () => {
    const menu = openMenu({
      commandItems: [
        { command: 'visible', title: 'Visible' },
        { command: 'hidden', title: 'Hidden', itemVisibilityOverride: () => false },
      ],
    });

    expect(menu?.querySelectorAll('.slick-cell-menu-item')).toHaveLength(1);
    expect(menu?.textContent).toContain('Visible');
    expect(menu?.textContent).not.toContain('Hidden');
  });

  it('marks commands disabled when itemUsabilityOverride returns false', () => {
    const menu = openMenu({
      commandItems: [{ command: 'disabled', title: 'Disabled', itemUsabilityOverride: () => false }],
    });

    expect(menu?.querySelector('.slick-cell-menu-item')?.classList.contains('slick-cell-menu-item-disabled')).toBe(true);
    expect(menu?.querySelector('.slick-cell-menu-item')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('applies disabled and hidden command flags', () => {
    const menu = openMenu({
      commandItems: [
        { command: 'disabled', title: 'Disabled', disabled: true },
        { command: 'hidden', title: 'Hidden', hidden: true },
      ],
    });
    const items = menu?.querySelectorAll('.slick-cell-menu-item');

    expect(items).toHaveLength(2);
    expect(items?.[0].classList.contains('slick-cell-menu-item-disabled')).toBe(true);
    expect(items?.[1].classList.contains('slick-cell-menu-item-hidden')).toBe(true);
  });

  it('renders dividers between commands', () => {
    const menu = openMenu({
      commandItems: [{ command: 'first', title: 'First' }, 'divider', { command: 'last', title: 'Last' }],
    });

    expect(menu?.querySelectorAll('.slick-cell-menu-item')).toHaveLength(3);
    expect(menu?.querySelector('.slick-cell-menu-item-divider')).not.toBeNull();
    expect(menu?.querySelector('.slick-cell-menu-item-divider')?.getAttribute('role')).toBe('separator');
  });

  it('opens a command submenu on mouseover', () => {
    const menu = openMenu({
      commandItems: [{ command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child action' }] }],
    });

    menu?.querySelector('.slick-cell-menu-item')?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(document.body.querySelector('.slick-cell-menu.slick-menu-level-1')?.textContent).toContain('Child action');
  });

  it('shows options in the option section and notifies onOptionSelected', () => {
    const menu = openMenu({ optionItems: [{ option: 'compact', title: 'Compact view' }] });
    const onOptionSelected = vi.fn();
    plugin.onOptionSelected.subscribe(onOptionSelected);

    menu?.querySelector('.slick-cell-menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onOptionSelected).toHaveBeenCalledOnce();
    expect(onOptionSelected.mock.calls[0][1].option).toBe('compact');
  });

  it('renders command icon, text classes, and tooltip', () => {
    const menu = openMenu({
      commandItems: [{ command: 'help', title: 'Help', iconCssClass: 'icon-help', textCssClass: 'emphasis', tooltip: 'Help tooltip' }],
    });
    const item = menu?.querySelector('.slick-cell-menu-item');

    expect(item?.querySelector('.slick-cell-menu-icon')?.classList.contains('icon-help')).toBe(true);
    expect(item?.querySelector('.slick-cell-menu-content')?.classList.contains('emphasis')).toBe(true);
    expect(item?.getAttribute('title')).toBe('Help tooltip');
  });

  it('renders a command section title when configured', () => {
    const menu = openMenu({ commandTitle: 'Available actions', commandItems: [{ command: 'edit', title: 'Edit' }] });

    expect(menu?.querySelector('.slick-menu-title')?.textContent).toBe('Available actions');
  });

  it('runs the command action and notifies onCommand when a command is clicked', () => {
    const action = vi.fn();
    const menu = openMenu({ commandItems: [{ command: 'edit', title: 'Edit', action }] });
    const onCommand = vi.fn();
    plugin.onCommand.subscribe(onCommand);

    menu?.querySelector('.slick-cell-menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(action).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledOnce();
    expect(document.body.querySelector('.slick-cell-menu.test-grid')).toBeNull();
  });

  it('does not close the menu when onBeforeMenuClose returns false', () => {
    const menu = openMenu();
    plugin.onBeforeMenuClose.subscribe(() => false);

    menu?.querySelector('.close')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.body.querySelector('.slick-cell-menu.test-grid')).not.toBeNull();
  });

  it('fires onAfterMenuShow after opening the menu', () => {
    plugin = new SlickCellMenu({});
    const onAfterMenuShow = vi.fn();
    plugin.onAfterMenuShow.subscribe(onAfterMenuShow);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onClick.notify({} as any, event, grid);

    expect(onAfterMenuShow).toHaveBeenCalledOnce();
  });

  it('closes the menu when the grid scrolls', () => {
    openMenu();

    grid.onScroll.notify({} as any, new Event('scroll'), grid);

    expect(document.body.querySelector('.slick-cell-menu.test-grid')).toBeNull();
  });

  it('does not open a menu when menuUsabilityOverride returns false', () => {
    const menu = openMenu({
      commandItems: [{ command: 'edit', title: 'Edit' }],
      menuUsabilityOverride: () => false,
    });

    expect(menu).toBeNull();
  });

  describe('more menu behaviours', () => {
    const clickCell = () => {
      const cell = document.createElement('div');
      cell.className = 'slick-cell';
      document.body.appendChild(cell);
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'target', { configurable: true, value: cell });
      grid.onClick.notify({} as any, event, grid);
      return document.body.querySelector('.slick-cell-menu.slick-menu-level-0.test-grid') as HTMLDivElement | null;
    };
    const mouseover = (elm?: Element | null) => elm?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const subMenu = (level = 1) => document.body.querySelector<HTMLDivElement>(`.slick-cell-menu.slick-menu-level-${level}.test-grid`);
    const nestedCommands = () => [
      { command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child' }, { command: 'deep', title: 'Deep', commandItems: [{ command: 'deepest', title: 'Deepest' }] }] },
      { command: 'other', title: 'Other', commandItems: [{ command: 'other-child', title: 'Other child' }] },
      { command: 'plain', title: 'Plain' },
    ];

    it('does not open the menu when onBeforeMenuShow returns false', () => {
      column.cellMenu = { commandItems: [{ command: 'edit', title: 'Edit' }] };
      plugin = new SlickCellMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
      const onBeforeMenuShow = vi.fn(() => false);
      plugin.onBeforeMenuShow.subscribe(onBeforeMenuShow);
      plugin.init(grid);

      expect(clickCell()).toBeNull();
      expect(onBeforeMenuShow).toHaveBeenCalledWith(expect.anything(), { cell: 0, row: 0, grid });
    });

    it('removes a menu of the same grid left in the page before opening a new one', () => {
      const staleMenu = document.body.appendChild(document.createElement('div'));
      staleMenu.className = 'slick-cell-menu slick-menu-level-0 test-grid';

      const menu = openMenu();

      expect(staleMenu.isConnected).toBe(false);
      expect(menu).not.toBe(staleMenu);
      expect(menu?.textContent).toContain('Edit');
    });

    it('renders item css classes, icon images and a custom sub-menu chevron class', () => {
      plugin = new SlickCellMenu({ subItemChevronClass: 'chevron-right' });
      column.cellMenu = {
        commandItems: [
          { command: 'image', title: 'Image', cssClass: 'red bold', iconImage: 'image.png' },
          { command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child' }] },
        ],
      };
      plugin.init(grid);
      const menu = clickCell()!;
      const [imageItem, moreItem] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-cell-menu-item'));

      expect(imageItem.classList.contains('red')).toBe(true);
      expect(imageItem.classList.contains('bold')).toBe(true);
      expect(imageItem.querySelector<HTMLElement>('.slick-cell-menu-icon')!.style.backgroundImage).toBe('url("image.png")');
      expect(moreItem.querySelector('.sub-item-chevron')!.classList.contains('chevron-right')).toBe(true);
      expect(moreItem.querySelector('.sub-item-chevron')!.textContent).toBe('');
    });

    it('opens nested sub-menus that belong to the same tree', () => {
      const menu = openMenu({ commandItems: nestedCommands() })!;
      mouseover(menu.querySelector('.slick-submenu-item'));
      mouseover(subMenu(1)!.querySelector('.slick-submenu-item'));

      expect(subMenu(1)!.getAttribute('aria-label')).toBe('Cell Menu');
      expect(subMenu(2)!.getAttribute('aria-label')).toBe('SubMenu');
      expect(subMenu(2)!.dataset.subMenuParent).toBe('more');
      expect(subMenu(2)!.textContent).toContain('Deepest');
    });

    it('keeps an open sub-menu when it is opened again and replaces it with the one of another item', () => {
      const menu = openMenu({ commandItems: nestedCommands() })!;
      const [more, other, plain] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-cell-menu-item'));

      mouseover(more);
      const firstSubMenu = subMenu()!;
      mouseover(more);
      expect(subMenu()).toBe(firstSubMenu);
      expect(document.body.querySelectorAll('.slick-submenu')).toHaveLength(1);

      mouseover(other);
      expect(firstSubMenu.isConnected).toBe(false);
      expect(subMenu()!.textContent).toContain('Other child');

      // hovering an item without sub-menu in the parent menu closes the sub-menus
      mouseover(plain);
      expect(subMenu()).toBeNull();
      expect(menu.isConnected).toBe(true);
    });

    it('opens the sub-menu of a clicked item that has a command without running the command', () => {
      const onCommand = vi.fn();
      plugin = new SlickCellMenu({ subMenuOpenByEvent: 'click' });
      column.cellMenu = { commandItems: nestedCommands() };
      plugin.init(grid);
      plugin.onCommand.subscribe(onCommand);
      const menu = clickCell()!;
      const more = menu.querySelector<HTMLElement>('.slick-submenu-item')!;

      mouseover(more);
      expect(subMenu()).toBeNull();
      more.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(subMenu()!.textContent).toContain('Child');
      expect(onCommand).not.toHaveBeenCalled();
      expect(menu.isConnected).toBe(true);
    });

    it('shows the sub-menu title of an option sub-menu with its css class', () => {
      const menu = openMenu({
        optionItems: [{ option: 'size', title: 'Size', subMenuTitle: 'Pick a size', subMenuTitleCssClass: 'italic underline', optionItems: [{ option: 'small', title: 'Small' }] }],
      })!;

      mouseover(menu.querySelector('.slick-submenu-item'));

      const title = subMenu()!.querySelector('.slick-cell-menu-option-list .slick-menu-title')!;
      expect(title.textContent).toBe('Pick a size');
      expect(title.classList.contains('italic')).toBe(true);
      expect(title.classList.contains('underline')).toBe(true);
    });

    it('shows the sub-menu title of a command sub-menu without extra class', () => {
      const menu = openMenu({
        commandItems: [{ command: 'more', title: 'More', subMenuTitle: 'More actions', commandItems: [{ command: 'child', title: 'Child' }] }],
      })!;

      mouseover(menu.querySelector('.slick-submenu-item'));

      expect(subMenu()!.querySelector('.slick-menu-title')!.className).toBe('slick-menu-title');
      expect(subMenu()!.querySelector('.slick-menu-title')!.textContent).toBe('More actions');
    });

    it('keeps the menus open on a mousedown inside the menu or inside a sub-menu', () => {
      const menu = openMenu({ commandItems: nestedCommands() })!;
      mouseover(menu.querySelector('.slick-submenu-item'));

      menu.querySelector('.slick-cell-menu-item')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(menu.isConnected).toBe(true);
      subMenu()!.querySelector('.slick-cell-menu-item')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(menu.isConnected).toBe(true);
      expect(subMenu()).not.toBeNull();

      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(menu.isConnected).toBe(false);
      expect(subMenu()).toBeNull();
    });

    it('does not select an option while the current edit cannot be committed', () => {
      const onOptionSelected = vi.fn();
      const menu = openMenu({ optionItems: [{ option: 'compact', title: 'Compact view' }] })!;
      plugin.onOptionSelected.subscribe(onOptionSelected);
      vi.mocked(grid.getEditorLock).mockReturnValueOnce({ commitCurrentEdit: () => false } as any);

      menu.querySelector('.slick-cell-menu-item')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onOptionSelected).not.toHaveBeenCalled();
      expect(menu.isConnected).toBe(true);
    });

    it('drops the menu up and aligns it to the right when there is room on the right but not below the cell', () => {
      const spies = [
        vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300),
        vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100),
        vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000),
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 700, left: 0, bottom: 725, right: 100, width: 100, height: 25 } as DOMRect),
      ];
      vi.mocked(grid.getOptions).mockReturnValueOnce({ rowHeight: 25 });
      try {
        const menu = openMenu({ commandItems: nestedCommands() })!;
        expect(menu.classList.contains('dropup')).toBe(true);
        expect(menu.classList.contains('dropright')).toBe(true);
        expect(menu.style.top).toBe('400px'); // cell top - menu height
        expect(menu.style.left).toBe('0px');

        mouseover(menu.querySelector('.slick-submenu-item'));
        expect(subMenu()!.classList.contains('dropup')).toBe(true);
        expect(subMenu()!.classList.contains('dropright')).toBe(true);
        expect(subMenu()!.style.top).toBe('400px'); // item top - menu height + item height (0 in jsdom)
        expect(subMenu()!.style.left).toBe('100px'); // item left + item width
      } finally {
        spies.forEach(spy => spy.mockRestore());
      }
    });
  });

  it('respects onBeforeMenuShow returning false', () => {
    plugin = new SlickCellMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    plugin.onBeforeMenuShow.subscribe(() => false);
    // openMenu creates a new instance, so open this configured instance directly.
    column.cellMenu = undefined;
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onClick.notify({} as any, event, grid);

    expect(document.body.querySelector('.slick-cell-menu.test-grid')).toBeNull();
  });
});
