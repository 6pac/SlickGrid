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
