import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, HeaderMenuCommandItem, MenuCommandItemCallbackArgs } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickHeaderMenu } from '../slick.headermenu';

const column: Column = {
  id: 'field1',
  field: 'field1',
  name: 'Field 1',
  header: {
    menu: {
      commandItems: [
        { command: 'first', title: 'First command', iconCssClass: 'icon-first' },
        { command: 'second', title: 'Second command', tooltip: 'Second tooltip' },
      ],
    },
  },
};

const grid = {
  getColumns: vi.fn(() => [column]),
  getContainerNode: vi.fn(),
  getGridPosition: vi.fn(() => ({ width: 800, left: 0, right: 800, top: 0, bottom: 600 })),
  getPubSubService: vi.fn(),
  getUID: () => 'slickgrid12345',
  setColumns: vi.fn(),
  onBeforeHeaderCellDestroy: new SlickEvent(),
  onHeaderCellRendered: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickHeaderMenu', () => {
  let plugin: SlickHeaderMenu;
  let container: HTMLDivElement;
  let header: HTMLDivElement;

  const renderHeader = () => {
    const args = { column, node: header, grid };
    grid.onHeaderCellRendered.notify(args, new SlickEventData());
    return args;
  };

  const openMenu = () => {
    renderHeader();
    header.querySelector<HTMLElement>('.slick-header-menubutton')!.click();
    return container.querySelector<HTMLDivElement>('.slick-header-menu.slick-menu-level-0')!;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    column.header!.menu!.commandItems = [
      { command: 'first', title: 'First command', iconCssClass: 'icon-first' },
      { command: 'second', title: 'Second command', tooltip: 'Second tooltip' },
    ];
    container = document.createElement('div');
    container.className = 'slickgrid-container slickgrid12345';
    header = document.createElement('div');
    header.className = 'slick-header-column';
    container.appendChild(header);
    document.body.appendChild(container);
    vi.mocked(grid.getContainerNode).mockReturnValue(container);
    plugin = new SlickHeaderMenu({});
  });

  afterEach(() => {
    plugin.destroy();
    document.body.innerHTML = '';
  });

  it('subscribes to header events and asks the grid to rerender its columns', () => {
    plugin.init(grid);

    expect(grid.setColumns).toHaveBeenCalledWith([column]);
  });

  it('renders a menu button with configured class, image, and tooltip', () => {
    plugin = new SlickHeaderMenu({ buttonCssClass: 'menu-icon arrow-down', tooltip: 'Open menu' });
    plugin.init(grid);
    renderHeader();
    const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;

    expect(button.getAttribute('aria-label')).toBe('Header Menu');
    expect(button.getAttribute('role')).toBe('button');
    expect(button.title).toBe('Open menu');
    expect(button.querySelector('.menu-icon.arrow-down')).toBeTruthy();
  });

  it('uses the caret class when no button icon option is specified', () => {
    plugin.init(grid);
    renderHeader();

    expect(header.querySelector('.slick-header-menubutton .caret')).toBeTruthy();
  });

  it('does not render a menu button when the menu usability override rejects it', () => {
    plugin = new SlickHeaderMenu({ menuUsabilityOverride: () => false });
    plugin.init(grid);
    renderHeader();

    expect(header.querySelector('.slick-header-menubutton')).toBeNull();
  });

  it('removes the header menu button before its header cell is destroyed', () => {
    plugin.init(grid);
    const args = renderHeader();
    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());

    expect(header.querySelector('.slick-header-menubutton')).toBeNull();
  });

  it('opens a menu with visible commands when the menu button is clicked', () => {
    (column.header!.menu!.commandItems![1] as HeaderMenuCommandItem).itemVisibilityOverride = () => false;
    plugin.init(grid);
    const menu = openMenu();

    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.querySelectorAll('.slick-header-menuitem')).toHaveLength(1);
    expect(menu.querySelector('.slick-header-menucontent')?.textContent).toBe('First command');
  });

  it('applies command item classes, tooltip, icon, and disabled state', () => {
    column.header!.menu!.commandItems![0] = {
      command: 'first',
      title: 'First command',
      cssClass: 'custom-item',
      iconCssClass: 'icon-first',
      tooltip: 'Command tooltip',
      disabled: true,
    };
    plugin.init(grid);
    const menu = openMenu();
    const item = menu.querySelector<HTMLElement>('.custom-item')!;

    expect(item.classList.contains('slick-header-menuitem-disabled')).toBe(true);
    expect(item.title).toBe('Command tooltip');
    expect(item.querySelector('.icon-first')).toBeTruthy();
  });

  it('disables a command when its usability override returns false', () => {
    (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).itemUsabilityOverride = () => false;
    plugin.init(grid);
    const menu = openMenu();

    expect(menu.querySelector('.slick-header-menuitem-disabled')).toBeTruthy();
  });

  it('publishes the command and runs its action when an enabled item is clicked', () => {
    const item = column.header!.menu!.commandItems![0] as HeaderMenuCommandItem;
    const action = vi.fn();
    const commandListener = vi.fn();
    item.action = action;
    plugin.init(grid);
    plugin.onCommand.subscribe((_event: SlickEventData, args: MenuCommandItemCallbackArgs) => commandListener(args));
    const menu = openMenu();
    menu.querySelector<HTMLElement>('.slick-header-menuitem')!.click();

    expect(commandListener).toHaveBeenCalledWith({ grid, column, command: 'first', item });
    expect(action).toHaveBeenCalledOnce();
    expect(container.querySelector('.slick-header-menu')).toBeNull();
  });

  it('does not publish commands or run actions for disabled items', () => {
    const item = column.header!.menu!.commandItems![0] as HeaderMenuCommandItem;
    const action = vi.fn();
    const commandListener = vi.fn();
    item.disabled = true;
    item.action = action;
    plugin.init(grid);
    plugin.onCommand.subscribe((_event: SlickEventData, args: MenuCommandItemCallbackArgs) => commandListener(args));
    const menu = openMenu();
    menu.querySelector<HTMLElement>('.slick-header-menuitem')!.click();

    expect(commandListener).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
    expect(container.querySelector('.slick-header-menu')).toBeTruthy();
  });

  it('can prevent the menu from opening in the before-show event', () => {
    plugin.init(grid);
    plugin.onBeforeMenuShow.subscribe(() => false);

    renderHeader();
    header.querySelector<HTMLElement>('.slick-header-menubutton')!.click();

    expect(container.querySelector('.slick-header-menu')).toBeNull();
  });

  it('closes an open menu when the user clicks elsewhere in the document', () => {
    plugin.init(grid);
    const menu = openMenu();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(menu.isConnected).toBe(false);
    expect(header.classList.contains('slick-header-column-active')).toBe(false);
  });

  it('opens nested command items as submenus on mouseover', () => {
    column.header!.menu!.commandItems = [
      { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested command' }] },
    ];
    plugin.init(grid);
    const menu = openMenu();
    menu.querySelector<HTMLElement>('.slick-submenu-item')!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(document.body.querySelector('.slick-header-menu.slick-submenu .slick-header-menucontent')?.textContent).toBe('Nested command');
  });

  it('destroys the menu and removes its event subscriptions', () => {
    plugin.init(grid);
    const menu = openMenu();

    plugin.destroy();
    header.innerHTML = '';
    renderHeader();

    expect(menu.isConnected).toBe(false);
    expect(header.querySelector('.slick-header-menubutton')).toBeNull();
  });
});
