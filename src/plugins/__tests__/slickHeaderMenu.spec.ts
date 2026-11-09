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
  focus: vi.fn(),
  getColumnIndex: vi.fn(() => 0),
  getColumns: vi.fn(() => [column]),
  getContainerNode: vi.fn(),
  getGridPosition: vi.fn(() => ({ width: 800, left: 0, right: 800, top: 0, bottom: 600 })),
  getHeaderColumn: vi.fn(),
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
    vi.mocked(grid.getHeaderColumn).mockReturnValue(header);
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

  describe('keyboard and focus', () => {
    const subMenuItems = (): Array<HeaderMenuCommandItem | 'divider'> => [
      { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested command' }] },
      { command: 'last', title: 'Last command' },
    ];
    const pressKey = (target: HTMLElement, key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      return event;
    };
    const openMenuWithKeyboard = () => {
      renderHeader();
      const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;
      button.focus();
      pressKey(button, 'Enter');
      return { button, menu: container.querySelector<HTMLDivElement>('.slick-header-menu.slick-menu-level-0')! };
    };
    const boundListeners = () => (plugin as any)._bindingEventService.getBoundedEvents() as unknown[];

    it('clears the active state of the header after a sub-menu was opened', () => {
      column.header!.menu!.commandItems = subMenuItems();
      plugin.init(grid);
      const menu = openMenu();
      expect(header.classList.contains('slick-header-column-active')).toBe(true);
      menu.querySelector<HTMLElement>('.slick-submenu-item')!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(document.body.querySelector('.slick-header-menu.slick-submenu')).toBeTruthy();

      plugin.hideMenu();

      expect(header.classList.contains('slick-header-column-active')).toBe(false);
    });

    it('gives the focus back to the menu button when a command closes the menu', () => {
      plugin.init(grid);
      const { button, menu } = openMenuWithKeyboard();
      const item = menu.querySelector<HTMLElement>('.slick-header-menuitem')!;
      expect(document.activeElement).toBe(item);

      pressKey(item, 'Enter');

      expect(container.querySelector('.slick-header-menu')).toBeNull();
      expect(document.activeElement).toBe(button);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(header.classList.contains('slick-header-column-active')).toBe(false);
    });

    it('leaves the focus where a command put it', () => {
      const input = document.body.appendChild(document.createElement('input'));
      (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).action = () => input.focus();
      plugin.init(grid);
      const { menu } = openMenuWithKeyboard();

      pressKey(menu.querySelector<HTMLElement>('.slick-header-menuitem')!, 'Enter');

      expect(container.querySelector('.slick-header-menu')).toBeNull();
      expect(document.activeElement).toBe(input);
    });

    it('keeps the focus in a menu that a command keeps open', () => {
      (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).action = (e) => e.preventDefault();
      plugin.init(grid);
      const { menu } = openMenuWithKeyboard();
      const item = menu.querySelector<HTMLElement>('.slick-header-menuitem')!;

      pressKey(item, 'Enter');

      expect(menu.isConnected).toBe(true);
      expect(document.activeElement).toBe(item);
    });

    it('ignores Enter on a disabled item and reaches the enabled items from it with the arrow keys', () => {
      column.header!.menu!.commandItems = [
        { command: 'first', title: 'First command' },
        { command: 'disabled', title: 'Disabled command', disabled: true },
        { command: 'last', title: 'Last command' },
      ];
      const commandListener = vi.fn();
      plugin.init(grid);
      plugin.onCommand.subscribe(commandListener);
      const { menu } = openMenuWithKeyboard();
      const [first, disabled, last] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-header-menuitem'));
      disabled.focus(); // a mouse click on a disabled item gives it the focus

      pressKey(disabled, 'Enter');
      expect(commandListener).not.toHaveBeenCalled();
      expect(menu.isConnected).toBe(true);
      expect(document.activeElement).toBe(disabled);

      pressKey(disabled, 'ArrowUp');
      expect(document.activeElement).toBe(last);
      disabled.focus();
      pressKey(disabled, 'ArrowDown');
      expect(document.activeElement).toBe(first);
    });

    it('closes the menu when Tab is pressed on an item and lets the focus move on from the menu button', () => {
      plugin.init(grid);
      const { button, menu } = openMenuWithKeyboard();

      const event = pressKey(menu.querySelector<HTMLElement>('.slick-header-menuitem')!, 'Tab');

      expect(menu.isConnected).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(button);
      expect(event.defaultPrevented).toBe(false);
    });

    it('leaves only the sub-menu on Escape or ArrowLeft and goes back to the item that opened it', () => {
      column.header!.menu!.commandItems = subMenuItems();
      plugin.init(grid);
      const { menu } = openMenuWithKeyboard();
      const parentItem = menu.querySelector<HTMLElement>('.slick-submenu-item')!;

      for (const key of ['Escape', 'ArrowLeft']) {
        pressKey(parentItem, 'ArrowRight');
        const nestedItem = document.body.querySelector<HTMLElement>('.slick-header-menu.slick-submenu .slick-header-menuitem')!;
        expect(document.activeElement).toBe(nestedItem);

        pressKey(nestedItem, key);

        expect(document.body.querySelector('.slick-header-menu.slick-submenu')).toBeNull();
        expect(menu.isConnected).toBe(true);
        expect(document.activeElement).toBe(parentItem);
      }
    });

    it('closes the menu with Escape on the menu button', () => {
      plugin.init(grid);
      const { button, menu } = openMenuWithKeyboard();
      button.focus();

      pressKey(button, 'Escape');

      expect(menu.isConnected).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('does not make a divider focusable', () => {
      column.header!.menu!.commandItems = [{ command: 'first', title: 'First command' }, 'divider', { command: 'last', title: 'Last command' }];
      plugin.init(grid);
      const menu = openMenu();
      const divider = menu.querySelector<HTMLElement>('.slick-header-menuitem-divider')!;

      expect(divider.getAttribute('role')).toBe('separator');
      expect(divider.hasAttribute('tabindex')).toBe(false);
      expect(menu.querySelector('.slick-header-menuitem:not(.slick-header-menuitem-divider)')?.getAttribute('tabindex')).toBe('-1');
    });

    it('finds the menu button again after a command rendered its header cell anew', () => {
      (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).action = () => {
        // what `grid.setColumns()` does to a header cell
        grid.onBeforeHeaderCellDestroy.notify({ column, node: header, grid }, new SlickEventData());
        grid.onHeaderCellRendered.notify({ column, node: header, grid }, new SlickEventData());
      };
      plugin.init(grid);
      const { button, menu } = openMenuWithKeyboard();

      pressKey(menu.querySelector<HTMLElement>('.slick-header-menuitem')!, 'Enter');
      const newButton = header.querySelector<HTMLElement>('.slick-header-menubutton')!;

      expect(button.isConnected).toBe(false);
      expect(newButton).not.toBe(button);
      expect(document.activeElement).toBe(newButton);
      expect(newButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('focuses the grid when the column of the menu is gone after the command', () => {
      (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).action = () => {
        grid.onBeforeHeaderCellDestroy.notify({ column, node: header, grid }, new SlickEventData());
        vi.mocked(grid.getHeaderColumn).mockReturnValue(undefined as any);
      };
      plugin.init(grid);
      const { menu } = openMenuWithKeyboard();

      pressKey(menu.querySelector<HTMLElement>('.slick-header-menuitem')!, 'Enter');

      expect(grid.focus).toHaveBeenCalledOnce();
    });

    it('releases the listeners of a menu button when its header cell is destroyed', () => {
      plugin.init(grid);
      const args = renderHeader();
      const boundAfterFirstRender = boundListeners().length;

      for (let i = 0; i < 5; i++) {
        grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
        grid.onHeaderCellRendered.notify(args, new SlickEventData());
      }

      expect(boundListeners()).toHaveLength(boundAfterFirstRender);
    });

    it('forgets the menu button when the plugin is destroyed', () => {
      plugin.init(grid);
      openMenuWithKeyboard();

      plugin.destroy();

      expect((plugin as any)._menuTrigger).toBeUndefined();
      expect(header.classList.contains('slick-header-column-active')).toBe(false);
    });
  });

  describe('menu options', () => {
    const pressKey = (target: HTMLElement, key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      return event;
    };
    const mouseover = (target: HTMLElement) => target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const subMenu = (level = 1) => document.body.querySelector<HTMLDivElement>(`.slick-header-menu.slick-menu-level-${level}`);

    it('merges new options given to setOptions() into the current ones', () => {
      plugin = new SlickHeaderMenu({ tooltip: 'Old tooltip' });
      plugin.setOptions({ buttonCssClass: 'new-icon' });
      plugin.init(grid);
      renderHeader();
      const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;

      expect(button.title).toBe('Old tooltip');
      expect(button.querySelector('.new-icon')).toBeTruthy();
    });

    it('renders an image button without the default caret when only buttonImage is given', () => {
      plugin = new SlickHeaderMenu({ buttonImage: 'menu.png' });
      plugin.init(grid);
      renderHeader();
      const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;

      expect(button.style.backgroundImage).toBe('url("menu.png")');
      expect(button.querySelector('.caret')).toBeNull();
    });

    it('applies hidden state, icon image and text class of command items', () => {
      column.header!.menu!.commandItems = [
        { command: 'first', title: 'First command', iconImage: 'first.png', textCssClass: 'bold italic' },
        { command: 'hidden', title: 'Hidden command', hidden: true },
      ];
      plugin.init(grid);
      const menu = openMenu();
      const [first, hidden] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-header-menuitem'));

      expect(first.querySelector<HTMLElement>('.slick-header-menuicon')!.style.backgroundImage).toBe('url("first.png")');
      expect(first.querySelector('.slick-header-menucontent')!.classList.contains('bold')).toBe(true);
      expect(first.querySelector('.slick-header-menucontent')!.classList.contains('italic')).toBe(true);
      expect(hidden.classList.contains('slick-header-menuitem-hidden')).toBe(true);
    });

    it('shows the title of a sub-menu with its class and uses the given chevron class', () => {
      plugin = new SlickHeaderMenu({ subItemChevronClass: 'chevron-right' });
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', subMenuTitle: 'Sub title', subMenuTitleCssClass: 'title-class', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      const menu = openMenu();
      const parentItem = menu.querySelector<HTMLElement>('.slick-submenu-item')!;

      expect(parentItem.querySelector('.sub-item-chevron.chevron-right')?.textContent).toBe('');
      expect(parentItem.getAttribute('aria-haspopup')).toBe('menu');
      mouseover(parentItem);
      const title = subMenu()!.querySelector('.slick-menu-title')!;
      expect(title.textContent).toBe('Sub title');
      expect(title.classList.contains('title-class')).toBe(true);
    });

    it('shows the title of a sub-menu without an extra class when none is given', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', subMenuTitle: 'Sub title', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      const menu = openMenu();

      expect(menu.querySelector('.sub-item-chevron')!.textContent).toBe('⮞');
      mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);
      expect(subMenu()!.querySelector('.slick-menu-title')!.className).toBe('slick-menu-title');
    });

    it('opens sub-menus only on click when subMenuOpenByEvent is "click"', () => {
      // given to setOptions(), the defaults of the constructor would otherwise win over this option
      plugin.setOptions({ subMenuOpenByEvent: 'click' });
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      const menu = openMenu();
      const parentItem = menu.querySelector<HTMLElement>('.slick-submenu-item')!;

      mouseover(parentItem);
      expect(subMenu()).toBeNull();
      parentItem.click();
      expect(subMenu()!.querySelector('.slick-header-menucontent')!.textContent).toBe('Nested');
      expect(menu.isConnected).toBe(true);
    });

    it('keeps an open sub-menu when it is opened again and replaces it with the one of another item', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
        { command: 'other', title: 'Other', commandItems: [{ command: 'other-nested', title: 'Other nested' }] },
        { command: 'plain', title: 'Plain' },
      ];
      plugin.init(grid);
      const menu = openMenu();
      const [more, other, plain] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-header-menuitem'));

      mouseover(more);
      const firstSubMenu = subMenu()!;
      mouseover(more);
      expect(subMenu()).toBe(firstSubMenu);
      expect(document.body.querySelectorAll('.slick-submenu')).toHaveLength(1);

      mouseover(other);
      expect(firstSubMenu.isConnected).toBe(false);
      expect(subMenu()!.textContent).toContain('Other nested');
      expect(subMenu()!.dataset.subMenuParent).toBe('other');

      // hovering an item without sub-menu in the parent menu closes the sub-menu
      mouseover(plain);
      expect(subMenu()).toBeNull();
      expect(menu.isConnected).toBe(true);
    });

    it('keeps the parent sub-menu open when hovering an item of a nested sub-menu', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }, { command: 'deep', title: 'Deep', commandItems: [{ command: 'deepest', title: 'Deepest' }] }] },
      ];
      plugin.init(grid);
      const menu = openMenu();
      mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);
      mouseover(subMenu()!.querySelector<HTMLElement>('.slick-submenu-item')!);
      expect(subMenu(2)!.getAttribute('aria-label')).toBe('SubMenu');

      mouseover(subMenu()!.querySelector<HTMLElement>('.slick-header-menuitem')!);

      expect(subMenu()).toBeTruthy();
      expect(subMenu(2)).toBeTruthy();
    });

    it('closes the sub-menus when an item with an empty command and no sub-menu is clicked', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
        { command: '', title: 'Title only' },
      ];
      const commandListener = vi.fn();
      plugin.init(grid);
      plugin.onCommand.subscribe(commandListener);
      const menu = openMenu();
      mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);
      expect(subMenu()).toBeTruthy();

      menu.querySelectorAll<HTMLElement>('.slick-header-menuitem')[1].click();

      expect(subMenu()).toBeNull();
      expect(menu.isConnected).toBe(true);
      expect(commandListener).not.toHaveBeenCalled();
    });

    it('keeps the menus open when the click is inside a sub-menu, and closes them on a click on a "close" element', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested', disabled: true }] },
      ];
      plugin.init(grid);
      const menu = openMenu();
      mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);
      const nested = subMenu()!.querySelector<HTMLElement>('.slick-header-menuitem')!;

      nested.click();
      expect(menu.isConnected).toBe(true);
      expect(subMenu()).toBeTruthy();

      const closeElm = document.createElement('span');
      closeElm.className = 'close';
      menu.appendChild(closeElm);
      closeElm.click();
      expect(menu.isConnected).toBe(false);
      expect(subMenu()).toBeNull();
    });

    it('removes a menu of the same grid left in the page before opening a new one', () => {
      const staleMenu = document.body.appendChild(document.createElement('div'));
      staleMenu.className = 'slick-header-menu slick-menu-level-0 slickgrid12345';
      plugin.init(grid);

      const menu = openMenu();

      expect(staleMenu.isConnected).toBe(false);
      expect(menu.isConnected).toBe(true);
    });

    it('does not stop the click event when the after-show event returns false', () => {
      const afterShowListener = vi.fn(() => false);
      plugin.init(grid);
      plugin.onAfterMenuShow.subscribe(afterShowListener);
      renderHeader();
      const event = new MouseEvent('click', { bubbles: false, cancelable: true });

      header.querySelector<HTMLElement>('.slick-header-menubutton')!.dispatchEvent(event);

      expect(afterShowListener).toHaveBeenCalledOnce();
      expect(container.querySelector('.slick-header-menu')).toBeTruthy();
      expect(event.defaultPrevented).toBe(false);
    });

    it('aligns the menu to the right edge of its button when it would overflow the grid', () => {
      plugin.setOptions({ autoAlignOffset: 12 });
      vi.mocked(grid.getGridPosition).mockReturnValueOnce({ width: 0, left: 0, right: 0, top: 0, bottom: 0 } as any);
      plugin.init(grid);

      const menu = openMenu();

      expect(menu.style.left).toBe('12px');
    });

    it('opens a sub-menu on the right of its item when there is enough room', () => {
      const clientWidth = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      try {
        const menu = openMenu();
        mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);

        expect(subMenu()!.classList.contains('dropright')).toBe(true);
        expect(subMenu()!.classList.contains('dropleft')).toBe(false);
      } finally {
        clientWidth.mockRestore();
      }
    });

    it('opens a sub-menu on the left of its item when there is not enough room', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      const menu = openMenu();
      mouseover(menu.querySelector<HTMLElement>('.slick-submenu-item')!);

      expect(subMenu()!.classList.contains('dropleft')).toBe(true);
    });

    it('moves the focus with Home, End and the arrow keys, wrapping around at both ends', () => {
      column.header!.menu!.commandItems = [
        { command: 'first', title: 'First command' },
        'divider',
        { command: 'middle', title: 'Middle command' },
        { command: 'last', title: 'Last command' },
      ];
      plugin.init(grid);
      const menu = openMenu();
      const [first, middle, last] = Array.from(menu.querySelectorAll<HTMLElement>('.slick-header-menuitem:not(.slick-header-menuitem-divider)'));
      middle.focus();

      expect(pressKey(middle, 'End').defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(last);
      pressKey(last, 'ArrowDown');
      expect(document.activeElement).toBe(first);
      pressKey(first, 'ArrowUp');
      expect(document.activeElement).toBe(last);
      pressKey(last, 'Home');
      expect(document.activeElement).toBe(first);
      pressKey(first, 'ArrowDown');
      expect(document.activeElement).toBe(middle);
    });

    it('closes the menu with Escape on an item of the parent menu and focuses the menu button', () => {
      plugin.init(grid);
      const menu = openMenu();
      const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;
      const item = menu.querySelector<HTMLElement>('.slick-header-menuitem')!;
      item.focus();

      const event = pressKey(item, 'Escape');

      expect(event.defaultPrevented).toBe(true);
      expect(menu.isConnected).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(button);
    });

    it('does not handle ArrowLeft in the parent menu nor ArrowRight on an item without sub-menu', () => {
      const commandListener = vi.fn();
      plugin.init(grid);
      plugin.onCommand.subscribe(commandListener);
      const menu = openMenu();
      const item = menu.querySelector<HTMLElement>('.slick-header-menuitem')!;
      item.focus();

      expect(pressKey(item, 'ArrowLeft').defaultPrevented).toBe(false);
      expect(pressKey(item, 'ArrowRight').defaultPrevented).toBe(false);
      expect(pressKey(item, 'a').defaultPrevented).toBe(false);
      expect(menu.isConnected).toBe(true);
      expect(document.activeElement).toBe(item);
      expect(commandListener).not.toHaveBeenCalled();
    });

    it('ignores ArrowRight on a disabled item with a sub-menu', () => {
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', disabled: true, commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.setOptions({ subMenuOpenByEvent: 'click' });
      plugin.init(grid);
      const menu = openMenu();
      const item = menu.querySelector<HTMLElement>('.slick-submenu-item')!;
      item.focus();

      const event = pressKey(item, 'ArrowRight');

      expect(event.defaultPrevented).toBe(true);
      expect(subMenu()).toBeNull();
      expect(document.activeElement).toBe(item);
    });

    it('opens a sub-menu with the space key and runs a nested command with Enter', () => {
      const commandListener = vi.fn();
      column.header!.menu!.commandItems = [
        { command: 'more', title: 'More', commandItems: [{ command: 'nested', title: 'Nested' }] },
      ];
      plugin.init(grid);
      plugin.onCommand.subscribe((_e: SlickEventData, args: MenuCommandItemCallbackArgs) => commandListener(args.command));
      const menu = openMenu();
      const button = header.querySelector<HTMLElement>('.slick-header-menubutton')!;
      const item = menu.querySelector<HTMLElement>('.slick-submenu-item')!;
      item.focus();

      pressKey(item, ' ');
      const nested = subMenu()!.querySelector<HTMLElement>('.slick-header-menuitem')!;
      expect(document.activeElement).toBe(nested);
      pressKey(nested, 'Enter');

      expect(commandListener).toHaveBeenCalledWith('nested');
      expect(menu.isConnected).toBe(false);
      expect(subMenu()).toBeNull();
      expect(document.activeElement).toBe(button);
    });

    it('focuses the grid when the column of the menu is no longer in the grid', () => {
      (column.header!.menu!.commandItems![0] as HeaderMenuCommandItem).action = () => {
        grid.onBeforeHeaderCellDestroy.notify({ column, node: header, grid }, new SlickEventData());
        vi.mocked(grid.getColumnIndex).mockReturnValueOnce(undefined as any);
      };
      plugin.init(grid);
      const menu = openMenu();
      const item = menu.querySelector<HTMLElement>('.slick-header-menuitem')!;
      item.focus();

      pressKey(item, 'Enter');

      expect(grid.getHeaderColumn).not.toHaveBeenCalled();
      expect(grid.focus).toHaveBeenCalledOnce();
    });

    it('removes an open menu that is no longer referenced when destroyed', () => {
      plugin.init(grid);
      const menu = openMenu();
      (plugin as any)._menuElm = undefined;

      plugin.destroy();

      expect(menu.isConnected).toBe(false);
    });
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
