import { afterEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { Column, ContextMenuOption, ElementPosition } from '../../models';
import { SlickContextMenu } from '../slick.contextmenu';

describe('ContextMenu Plugin', () => {
  const columns: Column[] = [{ id: 'name', field: 'name', name: 'Name' }];
  const grid = {
    getCellFromEvent: vi.fn(() => ({ cell: 0, row: 0 })),
    getColumns: vi.fn(() => columns),
    getDataItem: vi.fn(() => ({ name: 'Ada' })),
    getEditorLock: vi.fn(() => ({ commitCurrentEdit: vi.fn(() => true) })),
    getGridPosition: vi.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0, width: 400 })),
    getOptions: vi.fn(() => ({})),
    getPubSubService: vi.fn(() => undefined),
    getUID: vi.fn(() => 'test-grid'),
    onContextMenu: new SlickEvent(),
    onScroll: new SlickEvent(),
  } as unknown as SlickGrid;
  let plugin: SlickContextMenu;

  const openMenu = (options: Partial<ContextMenuOption> = { commandItems: [{ command: 'edit', title: 'Edit' }] }) => {
    plugin = new SlickContextMenu(options);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });
    grid.onContextMenu.notify({} as any, event, grid);
    return document.body.querySelector('.slick-context-menu.test-grid') as HTMLDivElement | null;
  };

  afterEach(() => {
    plugin?.destroy();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('uses the default options when constructed without options', () => {
    plugin = new SlickContextMenu({});
    expect(plugin).toBeTruthy();
  });

  it('opens the configured menu on the grid context menu event', () => {
    plugin = new SlickContextMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    plugin.init(grid);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onContextMenu.notify({} as any, event, grid);

    const menu = document.body.querySelector('.slick-context-menu.test-grid');
    expect(menu).not.toBeNull();
    expect(menu?.querySelector('.slick-context-menu-command-list')?.textContent).toContain('Edit');
    expect(event.defaultPrevented).toBe(true);
  });

  it('closes the menu when clicking elsewhere in the document body', () => {
    plugin = new SlickContextMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });
    grid.onContextMenu.notify({} as any, event, grid);
    expect(document.body.querySelector('.slick-context-menu.test-grid')).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
  });

  it('only renders commands for configured column ids', () => {
    const menu = openMenu({
      commandItems: [{ command: 'edit', title: 'Edit' }],
      commandShownOverColumnIds: ['other-column'],
      optionShownOverColumnIds: ['other-column'],
    });

    expect(menu).toBeNull();
  });

  it('aligns the menu to the left when the grid has no room on its right', () => {
    vi.mocked(grid.getGridPosition).mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0, width: 50 } as unknown as ElementPosition);
    const menu = openMenu({
      commandItems: [{ command: 'edit', title: 'Edit' }],
      width: 100,
    });

    expect(menu?.classList.contains('dropleft')).toBe(true);
    vi.mocked(grid.getGridPosition).mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0, width: 400 } as unknown as ElementPosition);
  });

  it('does not create a menu when no command or option items are configured', () => {
    expect(openMenu({ commandItems: [], optionItems: [] })).toBeNull();
  });

  it('does not create a menu when menuUsabilityOverride returns false', () => {
    expect(
      openMenu({
        commandItems: [{ command: 'edit', title: 'Edit' }],
        menuUsabilityOverride: () => false,
      })
    ).toBeNull();
  });

  it('omits commands hidden by itemVisibilityOverride', () => {
    const menu = openMenu({
      commandItems: [
        { command: 'visible', title: 'Visible' },
        { command: 'hidden', title: 'Hidden', itemVisibilityOverride: () => false },
      ],
    });

    expect(menu?.querySelectorAll('.slick-context-menu-item')).toHaveLength(1);
    expect(menu?.textContent).toContain('Visible');
    expect(menu?.textContent).not.toContain('Hidden');
  });

  it('marks commands disabled when itemUsabilityOverride returns false', () => {
    const menu = openMenu({
      commandItems: [{ command: 'disabled', title: 'Disabled', itemUsabilityOverride: () => false }],
    });

    expect(menu?.querySelector('.slick-context-menu-item')?.classList.contains('slick-context-menu-item-disabled')).toBe(true);
    expect(menu?.querySelector('.slick-context-menu-item')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('applies disabled and hidden command flags', () => {
    const menu = openMenu({
      commandItems: [
        { command: 'disabled', title: 'Disabled', disabled: true },
        { command: 'hidden', title: 'Hidden', hidden: true },
      ],
    });
    const items = menu?.querySelectorAll('.slick-context-menu-item');

    expect(items).toHaveLength(2);
    expect(items?.[0].classList.contains('slick-context-menu-item-disabled')).toBe(true);
    expect(items?.[1].classList.contains('slick-context-menu-item-hidden')).toBe(true);
  });

  it('renders the configured command section title', () => {
    const menu = openMenu({
      commandTitle: 'Grid actions',
      commandItems: [{ command: 'edit', title: 'Edit' }],
    });

    expect(menu?.querySelector('.slick-menu-title')?.textContent).toBe('Grid actions');
  });

  it('renders command icon and text classes and the item tooltip', () => {
    const menu = openMenu({
      commandItems: [{
        command: 'help',
        title: 'Help',
        iconCssClass: 'icon-help',
        textCssClass: 'emphasis',
        tooltip: 'Help tooltip',
      }],
    });
    const item = menu?.querySelector('.slick-context-menu-item');

    expect(item?.querySelector('.slick-context-menu-icon')?.classList.contains('icon-help')).toBe(true);
    expect(item?.querySelector('.slick-context-menu-content')?.classList.contains('emphasis')).toBe(true);
    expect(item?.getAttribute('title')).toBe('Help tooltip');
  });

  it('renders a divider between commands', () => {
    const menu = openMenu({ commandItems: [{ command: 'first', title: 'First' }, 'divider', { command: 'last', title: 'Last' }] });

    expect(menu?.querySelectorAll('.slick-context-menu-item')).toHaveLength(3);
    expect(menu?.querySelector('.slick-context-menu-item-divider')).not.toBeNull();
    expect(menu?.querySelector('.slick-context-menu-item-divider')?.getAttribute('role')).toBe('separator');
  });

  it('hides the command section when configured', () => {
    const menu = openMenu({ commandItems: [{ command: 'edit', title: 'Edit' }], hideCommandSection: true });

    expect(menu?.querySelector('.slick-context-menu-command-list')).toBeNull();
  });

  it('omits the close button when hideCloseButton is enabled', () => {
    const menu = openMenu({ commandItems: [{ command: 'edit', title: 'Edit' }], hideCloseButton: true });

    expect(menu?.querySelector('button.close')).toBeNull();
  });

  it('opens a command submenu on mouseover', () => {
    const menu = openMenu({
      commandItems: [{ command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child action' }] }],
    });

    menu?.querySelector('.slick-context-menu-item')?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(document.body.querySelector('.slick-context-menu.slick-menu-level-1')?.textContent).toContain('Child action');
  });

  it('shows options in the option section and notifies onOptionSelected', () => {
    const menu = openMenu({ optionItems: [{ option: 'compact', title: 'Compact view' }] });
    const onOptionSelected = vi.fn();
    plugin.onOptionSelected.subscribe(onOptionSelected);

    menu?.querySelector('.slick-context-menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onOptionSelected).toHaveBeenCalledOnce();
    expect(onOptionSelected.mock.calls[0][1].option).toBe('compact');
  });

  it('runs the command action and notifies onCommand when a command is clicked', () => {
    const action = vi.fn();
    const menu = openMenu({ commandItems: [{ command: 'edit', title: 'Edit', action }] });
    const onCommand = vi.fn();
    plugin.onCommand.subscribe(onCommand);

    menu?.querySelector('.slick-context-menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(action).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledOnce();
    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
  });

  it('does not close the menu when onBeforeMenuClose returns false', () => {
    const menu = openMenu();
    plugin.onBeforeMenuClose.subscribe(() => false);

    menu?.querySelector('.close')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.body.querySelector('.slick-context-menu.test-grid')).not.toBeNull();
  });

  it('closes the menu when onBeforeMenuClose allows it', () => {
    const menu = openMenu();

    menu?.querySelector('button.close')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
  });

  it('fires onAfterMenuShow after opening the menu', () => {
    plugin = new SlickContextMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    const onAfterMenuShow = vi.fn();
    plugin.onAfterMenuShow.subscribe(onAfterMenuShow);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onContextMenu.notify({} as any, event, grid);

    expect(onAfterMenuShow).toHaveBeenCalledOnce();
  });

  it('dismisses the menu it just showed when onAfterMenuShow returns false', () => {
    plugin = new SlickContextMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    plugin.onAfterMenuShow.subscribe(() => false);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onContextMenu.notify({} as any, event, grid);

    expect(document.body.querySelector('.slick-context-menu')).toBeNull();
  });

  it('closes the menu when the grid scrolls when hideMenuOnScroll is enabled', () => {
    openMenu({ commandItems: [{ command: 'edit', title: 'Edit' }], hideMenuOnScroll: true });

    grid.onScroll.notify({} as any, new Event('scroll'), grid);

    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
  });

  describe('more menu behaviours', () => {
    const mouseover = (elm?: Element | null) => elm?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const subMenu = (level = 1) => document.body.querySelector<HTMLDivElement>(`.slick-context-menu.slick-menu-level-${level}.test-grid`);
    const nestedCommands = () => [
      { command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child' }, { command: 'deep', title: 'Deep', commandItems: [{ command: 'deepest', title: 'Deepest' }] }] },
      { command: 'other', title: 'Other', commandItems: [{ command: 'other-child', title: 'Other child' }] },
      { command: 'plain', title: 'Plain' },
    ];

    it('replaces the column id lists given to setOptions() instead of merging them', () => {
      plugin = new SlickContextMenu({ commandShownOverColumnIds: ['a', 'b'], optionShownOverColumnIds: ['c', 'd'] });

      plugin.setOptions({ commandShownOverColumnIds: ['name'], optionShownOverColumnIds: ['other'] });
      plugin.init(grid);
      plugin.setOptions({ commandItems: [{ command: 'edit', title: 'Edit' }], optionItems: [{ option: 'compact', title: 'Compact' }] });
      const cell = document.body.appendChild(document.createElement('div'));
      cell.className = 'slick-cell';
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'target', { configurable: true, value: cell });
      grid.onContextMenu.notify({} as any, event, grid);

      const menu = document.body.querySelector('.slick-context-menu.test-grid')!;
      expect(menu.querySelector('.slick-context-menu-command-list')?.textContent).toContain('Edit');
      expect(menu.querySelector('.slick-context-menu-option-list')).toBeNull();
    });

    it('shows the commands over a column listed in "commandShownOverColumnIds"', () => {
      const menu = openMenu({ commandItems: [{ command: 'edit', title: 'Edit' }], commandShownOverColumnIds: ['other-column', 'name'] });

      expect(menu?.querySelector('.slick-context-menu-command-list')?.textContent).toContain('Edit');
    });

    it('removes a menu of the same grid left in the page before opening a new one', () => {
      const staleMenu = document.body.appendChild(document.createElement('div'));
      staleMenu.className = 'slick-context-menu slick-menu-level-0 test-grid';

      const menu = openMenu();

      expect(staleMenu.isConnected).toBe(false);
      expect(menu).not.toBe(staleMenu);
      expect(menu?.textContent).toContain('Edit');
    });

    it('renders item css classes, icon images and a custom sub-menu chevron class', () => {
      const menu = openMenu({
        subItemChevronClass: 'chevron-right',
        commandItems: [
          { command: 'image', title: 'Image', cssClass: 'red bold', iconImage: 'image.png' },
          { command: 'more', title: 'More', commandItems: [{ command: 'child', title: 'Child' }] },
        ],
      })!;
      const [imageItem, moreItem] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-context-menu-item'));

      expect(imageItem.classList.contains('red')).toBe(true);
      expect(imageItem.classList.contains('bold')).toBe(true);
      expect(imageItem.querySelector<HTMLElement>('.slick-context-menu-icon')!.style.backgroundImage).toBe('url("image.png")');
      expect(moreItem.querySelector('.sub-item-chevron')!.classList.contains('chevron-right')).toBe(true);
      expect(moreItem.querySelector('.sub-item-chevron')!.textContent).toBe('');
    });

    it('opens nested sub-menus that belong to the same tree', () => {
      const menu = openMenu({ commandItems: nestedCommands() })!;
      mouseover(menu.querySelector('.slick-submenu-item'));
      mouseover(subMenu(1)!.querySelector('.slick-submenu-item'));

      expect(subMenu(1)!.getAttribute('aria-label')).toBe('Context Menu');
      expect(subMenu(2)!.getAttribute('aria-label')).toBe('SubMenu');
      expect(subMenu(2)!.dataset.subMenuParent).toBe('more');
      expect(subMenu(2)!.textContent).toContain('Deepest');
    });

    it('keeps an open sub-menu when it is opened again and replaces it with the one of another item', () => {
      const menu = openMenu({ commandItems: nestedCommands() })!;
      const [more, other, plain] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-context-menu-item'));

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
      const menu = openMenu({ subMenuOpenByEvent: 'click', commandItems: nestedCommands() })!;
      plugin.onCommand.subscribe(onCommand);
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

      const title = subMenu()!.querySelector('.slick-context-menu-option-list .slick-menu-title')!;
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

      menu.querySelector('.slick-context-menu-item')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(menu.isConnected).toBe(true);
      subMenu()!.querySelector('.slick-context-menu-item')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
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

      menu.querySelector('.slick-context-menu-item')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

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
        const menu = openMenu({ commandItems: nestedCommands(), autoAdjustDropOffset: -4, autoAlignSideOffset: 2 })!;
        expect(menu.classList.contains('dropup')).toBe(true);
        expect(menu.classList.contains('dropright')).toBe(true);
        expect(menu.style.top).toBe('396px'); // cell top - (menu height - drop offset)

        mouseover(menu.querySelector('.slick-submenu-item'));
        expect(subMenu()!.classList.contains('dropup')).toBe(true);
        expect(subMenu()!.classList.contains('dropright')).toBe(true);
        expect(subMenu()!.style.top).toBe('396px'); // item top - (menu height - drop offset - item height (0 in jsdom))
        expect(subMenu()!.style.left).toBe('102px'); // item left + side offset + item width
      } finally {
        spies.forEach(spy => spy.mockRestore());
      }
    });
  });

  it('respects onBeforeMenuShow returning false', () => {
    plugin = new SlickContextMenu({ commandItems: [{ command: 'edit', title: 'Edit' }] });
    plugin.onBeforeMenuShow.subscribe(() => false);
    plugin.init(grid);
    const cell = document.createElement('div');
    cell.className = 'slick-cell';
    document.body.appendChild(cell);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { configurable: true, value: cell });

    grid.onContextMenu.notify({} as any, event, grid);

    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
  });
});
