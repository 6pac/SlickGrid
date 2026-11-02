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

  it('closes the menu when the grid scrolls when hideMenuOnScroll is enabled', () => {
    openMenu({ commandItems: [{ command: 'edit', title: 'Edit' }], hideMenuOnScroll: true });

    grid.onScroll.notify({} as any, new Event('scroll'), grid);

    expect(document.body.querySelector('.slick-context-menu.test-grid')).toBeNull();
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
