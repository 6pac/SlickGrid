import {
  BindingEventService as BindingEventService_,
  Event as SlickEvent_,
  type SlickEventData,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core.js';
import type {
  Column,
  DOMEvent,
  DOMMouseOrTouchEvent,
  HeaderMenuCommandItemCallbackArgs,
  HeaderMenuItems,
  HeaderMenuOption,
  HeaderMenuCommandItem,
  MenuCommandItemCallbackArgs,
  SlickPlugin,
  OnHeaderCellRenderedEventArgs,
} from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/** The menu items that the keyboard can reach: enabled and not hidden */
const MENU_ITEM_SELECTOR = '[role="menuitem"]:not(.slick-header-menuitem-disabled):not(.slick-header-menuitem-hidden)';

/**
 * A plugin to add drop-down menus to column headers.
 *
 * USAGE:
 *
 * Add the plugin .js & .css files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 *
 *   let columns = [
 *     {
 *       id: 'myColumn',
 *       name: 'My column',
 *
 *       // This is the relevant part
 *       header: {
 *          menu: {
 *              commandItems: [
 *                {
 *                  // menu item options
 *                },
 *                {
 *                  // menu item options
 *                }
 *              ]
 *          }
 *       }
 *     }
 *   ];
 *
 *
 * Available menu options:
 *    autoAlign:              Auto-align drop menu to the left when not enough viewport space to show on the right
 *    autoAlignOffset:        When drop menu is aligned to the left, it might not be perfectly aligned with the header menu icon, if that is the case you can add an offset (positive/negative number to move right/left)
 *    buttonCssClass:         an extra CSS class to add to the menu button (default 'caret')
 *    buttonImage:            a url to the menu button image
 *    menuUsabilityOverride:  Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *    minWidth:               Minimum width that the drop menu will have
 *    subItemChevronClass:        CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon)
 *    subMenuOpenByEvent:         defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click"
 *
 *
 * Available menu item options:
 *    action:                   Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    title:                    Menu item text.
 *    divider:                  Whether the current item is a divider, not an actual command.
 *    disabled:                 Whether the item/command is disabled.
 *    hidden:                   Whether the item/command is hidden.
 *    tooltip:                  Item tooltip.
 *    command:                  A command identifier to be passed to the onCommand event handlers.
 *    cssClass:                 A CSS class to be added to the menu item container.
 *    iconCssClass:             A CSS class to be added to the menu item icon.
 *    iconImage:                A url to the icon image.
 *    textCssClass:             A CSS class to be added to the menu item text.
 *    itemVisibilityOverride:   Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:    Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 *
 * The plugin exposes the following events:

  *    onAfterMenuShow:   Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
  *        Event args:
  *            grid:     Reference to the grid.
  *            column:   Column definition.
  *            menu:     Menu options.  Note that you can change the menu items here.
  *
  *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
  *        Event args:
  *            grid:     Reference to the grid.
  *            column:   Column definition.
  *            menu:     Menu options.  Note that you can change the menu items here.
  *
  *    onCommand:    Fired on menu item click for buttons with 'command' specified.
  *        Event args:
  *            grid:     Reference to the grid.
  *            column:   Column definition.
  *            command:  Button command identified.
  *            button:   Button options.  Note that you can change the button options in your
  *                      event handler, and the column header will be automatically updated to
  *                      reflect them.  This is useful if you want to implement something like a
  *                      toggle button.
  *
  *
  * @param options {Object} Options:
  *    buttonCssClass:   an extra CSS class to add to the menu button (default 'caret')
  *    buttonImage:      a url to the menu button image
  * @class Slick.Plugins.HeaderButtons
  */
export class SlickHeaderMenu implements SlickPlugin {
  // --
  // public API
  pluginName = 'HeaderMenu' as const;
  onAfterMenuShow = new SlickEvent<HeaderMenuCommandItemCallbackArgs>('onAfterMenuShow');
  onBeforeMenuShow = new SlickEvent<HeaderMenuCommandItemCallbackArgs>('onBeforeMenuShow');
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>('onCommand');

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _gridUid = '';
  protected _handler = new SlickEventHandler();
  protected _bindingEventService = new BindingEventService();
  protected _defaults: HeaderMenuOption = {
    buttonCssClass: undefined,
    buttonImage: undefined,
    minWidth: 100,
    autoAlign: true,
    autoAlignOffset: 0,
    subMenuOpenByEvent: 'mouseover',
  };
  protected _options: HeaderMenuOption;
  protected _activeHeaderColumnElm?: HTMLDivElement | null;
  protected _menuElm?: HTMLDivElement | null;
  protected _subMenuParentId = '';
  protected _menuTrigger?: HTMLElement;
  protected _menuTriggerColumnId?: number | string;
  protected _subMenuRootItemElm?: HTMLElement | null;

  constructor(options: Partial<HeaderMenuOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._gridUid = grid?.getUID() || '';
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this._handler
      .subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this))
      .subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this));

    // Force the grid to re-render the header now that the events are hooked up.
    this._grid.setColumns(this._grid.getColumns());

    // Hide the menu on outside click.
    this._bindingEventService.bind(document.body, 'click', this.handleBodyMouseDown.bind(this) as EventListener);
  }

  setOptions(newOptions: Partial<HeaderMenuOption>) {
    this._options = Utils.extend(true, {}, this._options, newOptions);
  }

  protected getGridUidSelector() {
    const gridUid = this._grid.getUID() || '';
    return gridUid ? `.${gridUid}` : '';
  }

  destroy() {
    this._handler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this._menuElm = this._menuElm || document.body.querySelector(`.slick-header-menu${this.getGridUidSelector()}`);
    this._menuElm?.remove();
    this._activeHeaderColumnElm?.classList.remove('slick-header-column-active');
    this._activeHeaderColumnElm = undefined;
    this._menuTrigger = undefined;
    this._menuTriggerColumnId = undefined;
    this._subMenuRootItemElm = undefined;
  }

  destroyAllMenus() {
    this.destroySubMenus();

    // remove all parent menu listeners before removing them from the DOM
    this._bindingEventService.unbindAll('parent-menu');
    document.querySelectorAll(`.slick-header-menu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll('sub-menu');
    document.querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  protected handleBodyMouseDown(e: DOMEvent<HTMLElement>) {
    // did we click inside the menu or any of its sub-menu(s)
    let isMenuClicked = false;
    if (this._menuElm?.contains(e.target)) {
      isMenuClicked = true;
    }
    if (!isMenuClicked) {
      document
        .querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`)
        .forEach(subElm => {
          if (subElm.contains(e.target)) {
            isMenuClicked = true;
          }
        });
    }

    if (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented || e.target.className === 'close') {
      this.hideMenu();
    }
  }

  hideMenu() {
    if (this._menuElm) {
      this._menuElm.remove();
      this._menuElm = undefined;
    }
    this._activeHeaderColumnElm?.classList.remove('slick-header-column-active');
    this.getMenuTrigger()?.setAttribute('aria-expanded', 'false');
    this.destroySubMenus();
  }

  /** Returns the button that opened the menu. When its header cell was rendered again meanwhile, it is the new button of the same column. */
  protected getMenuTrigger(): HTMLElement | undefined {
    if (this._menuTrigger && !this._menuTrigger.isConnected && this._menuTriggerColumnId !== undefined) {
      const columnIdx = this._grid.getColumnIndex(this._menuTriggerColumnId);
      const headerElm = Utils.isDefined(columnIdx) ? this._grid.getHeaderColumn(columnIdx) : undefined;
      this._menuTrigger = headerElm?.querySelector<HTMLElement>('.slick-header-menubutton') ?? undefined;
    }
    return this._menuTrigger;
  }

  /** Once the menu is closed, put the keyboard focus back on its button, unless the command itself moved the focus somewhere else. */
  protected restoreFocusAfterMenuClose() {
    const activeElm = document.activeElement;
    if (!activeElm || activeElm === document.body || !activeElm.isConnected) {
      const menuTrigger = this.getMenuTrigger();
      if (menuTrigger) {
        // the button is only rendered while its column is hovered, focused or active, and an element that is not rendered cannot take the focus
        const headerElm = menuTrigger.closest('.slick-header-column');
        headerElm?.classList.add('slick-header-column-active');
        menuTrigger.focus();
        headerElm?.classList.remove('slick-header-column-active');
      } else {
        this._grid.focus(); // the column of the menu is gone (hidden or removed)
      }
    }
  }

  protected getMenuButtonEventGroup(column: Column) {
    return `menu-button-${column.id}`;
  }

  protected handleHeaderCellRendered(_e: SlickEventData, args: OnHeaderCellRenderedEventArgs) {
    const column = args.column;
    const menu = column?.header?.menu as HeaderMenuItems;

    if (menu) {
      // run the override function (when defined), if the result is false it won't go further
      if (!this.runOverrideFunctionWhenExists<typeof args>(this._options.menuUsabilityOverride, args)) {
        return;
      }

      const elm = Utils.createDomElement('div', {
        className: 'slick-header-menubutton',
        ariaLabel: 'Header Menu',
        role: 'button',
        tabIndex: 0,
      });
      elm.setAttribute('aria-haspopup', 'menu');
      elm.setAttribute('aria-expanded', 'false');

      if (!this._options.buttonCssClass && !this._options.buttonImage) {
        this._options.buttonCssClass = 'caret'; // default when nothing is provided
      }

      if (this._options.buttonCssClass) {
        // sgi icon with mask requires inner span to work properly
        const icon = document.createElement('span');
        icon.classList.add(...Utils.classNameToList(this._options.buttonCssClass));
        elm.appendChild(icon);
      }

      if (this._options.buttonImage) {
        elm.style.backgroundImage = `url(${this._options.buttonImage})`;
      }

      if (this._options.tooltip) {
        elm.title = this._options.tooltip;
      }

      // the listeners of the button are released again when its header cell is destroyed, see handleBeforeHeaderCellDestroy()
      const eventGroup = this.getMenuButtonEventGroup(column);
      this._bindingEventService.bind(elm, 'click', ((e: DOMMouseOrTouchEvent<HTMLDivElement>) => {
        this.hideMenu(); // reset the state left by a previously opened menu
        this._menuTrigger = elm;
        this._menuTriggerColumnId = column.id;
        this.destroyAllMenus(); // make there's only 1 parent menu opened at a time
        this.createParentMenu(e, menu, args.column);
        elm.setAttribute('aria-expanded', String(!!this._menuElm?.isConnected));
      }) as EventListener, undefined, eventGroup);
      this._bindingEventService.bind(elm, 'keydown', ((e: KeyboardEvent) => {
        if (Utils.clickOnActivationKey(e, elm, ['ArrowDown'])) {
          this._menuElm?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR)?.focus();
        } else if (e.key === 'Escape' && this._menuElm?.isConnected) {
          e.preventDefault();
          e.stopPropagation();
          this.hideMenu();
        }
      }) as EventListener, undefined, eventGroup);
      args.node.appendChild(elm);
    }
  }

  protected handleBeforeHeaderCellDestroy(_e: SlickEventData, args: { column: Column; node: HTMLElement; }) {
    const column = args.column;

    if (column.header?.menu) {
      this._bindingEventService.unbindAll(this.getMenuButtonEventGroup(column));
      args.node.querySelectorAll('.slick-header-menubutton').forEach(elm => elm.remove());
    }
  }

  protected addSubMenuTitleWhenExists(item: HeaderMenuCommandItem | 'divider', commandMenuElm: HTMLDivElement) {
    if (item !== 'divider' && item?.subMenuTitle) {
      const subMenuTitleElm = Utils.createDomElement('div', {
        className: 'slick-menu-title',
        textContent: item.subMenuTitle as string,
      });
      const subMenuTitleClass = item.subMenuTitleCssClass as string;
      if (subMenuTitleClass) {
        subMenuTitleElm.classList.add(...Utils.classNameToList(subMenuTitleClass));
      }

      commandMenuElm.appendChild(subMenuTitleElm);
    }
  }

  protected createParentMenu(event: DOMMouseOrTouchEvent<HTMLDivElement>, menu: HeaderMenuItems, columnDef: Column) {
    // Let the user modify the menu or cancel altogether,
    // or provide alternative menu implementation.
    const callbackArgs = {
      grid: this._grid,
      column: columnDef,
      menu
    } as unknown as HeaderMenuCommandItemCallbackArgs;
    if (this.onBeforeMenuShow.notify(callbackArgs, event, this).getReturnValue() === false) {
      return;
    }

    // create 1st parent menu container & reposition it
    this._menuElm = this.createMenu(menu.commandItems || [], columnDef);
    const containerNode = this._grid.getContainerNode();
    if (containerNode) {
      containerNode.appendChild(this._menuElm);
    }
    this.repositionMenu(event, this._menuElm);

    // Mark the header as active to keep the highlighting.
    this._activeHeaderColumnElm = this._menuTrigger?.closest('.slick-header-column') as HTMLDivElement | null;
    this._activeHeaderColumnElm?.classList.add('slick-header-column-active');

    if (this.onAfterMenuShow.notify(callbackArgs, event, this).getReturnValue() === false) {
      return;
    }

    // Stop propagation so that it doesn't register as a header click event.
    event.preventDefault();
    event.stopPropagation();
  }

  protected createMenu(commandItems: Array<HeaderMenuCommandItem | 'divider'>, columnDef: Column, level = 0, item?: HeaderMenuCommandItem | 'divider') {
    // to avoid having multiple sub-menu trees opened,
    // we need to somehow keep trace of which parent menu the tree belongs to
    // and we should keep ref of only the first sub-menu parent, we can use the command name (remove any whitespaces though)
    const isSubMenu = level > 0;
    const subMenuCommand = (item as HeaderMenuCommandItem)?.command;
    let subMenuId = (level === 1 && subMenuCommand) ? subMenuCommand.replaceAll(' ', '') : '';
    if (subMenuId) {
      this._subMenuParentId = subMenuId;
    }
    if (isSubMenu) {
      subMenuId = this._subMenuParentId;
    }

    // return menu/sub-menu if it's already opened unless we are on different sub-menu tree if so close them all
    const menuClasses = `slick-header-menu slick-menu-level-${level} ${this._gridUid}`;
    const bodyMenuElm = document.body.querySelector<HTMLDivElement>(`.slick-header-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId) {
        return bodyMenuElm;
      }
      this.destroySubMenus();
    }

    const menuElm = Utils.createDomElement('div', { className: menuClasses });
    if (level > 0) {
      menuElm.classList.add('slick-submenu');
      if (subMenuId) {
        menuElm.dataset.subMenuParent = subMenuId;
      }
    }
    menuElm.classList.add(this._gridUid);
    menuElm.role = 'menu';
    menuElm.ariaLabel = level > 1 ? 'SubMenu' : 'Header Menu';
    menuElm.style.minWidth = `${this._options.minWidth}px`;
    menuElm.setAttribute('aria-expanded', 'true');

    const callbackArgs = {
      grid: this._grid,
      column: columnDef,
      menu: commandItems
    } as unknown as HeaderMenuCommandItemCallbackArgs;

    // when creating sub-menu add its sub-menu title when exists
    if (item && level > 0) {
      this.addSubMenuTitleWhenExists(item, menuElm); // add sub-menu title when exists
    }

    // Construct the menu items.
    for (let i = 0; i < commandItems.length; i++) {
      let addClickListener = true;
      const item = commandItems[i];

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists((item as HeaderMenuCommandItem).itemVisibilityOverride, callbackArgs);
      const isItemUsable = this.runOverrideFunctionWhenExists((item as HeaderMenuCommandItem).itemUsabilityOverride, callbackArgs);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as HeaderMenuCommandItem).disabled = isItemUsable ? false : true;
      }

      const menuItemElm = Utils.createDomElement('div', {
        className: 'slick-header-menuitem',
        role: 'menuitem',
        tabIndex: -1,
      });

      if ((item as HeaderMenuCommandItem).divider || item === 'divider') {
        menuItemElm.classList.add('slick-header-menuitem-divider');
        menuItemElm.role = 'separator';
        menuItemElm.removeAttribute('tabindex'); // a separator is not focusable
        addClickListener = false;
      }

      if ((item as HeaderMenuCommandItem).disabled) {
        menuItemElm.classList.add('slick-header-menuitem-disabled');
        menuItemElm.setAttribute('aria-disabled', 'true');
      }

      if ((item as HeaderMenuCommandItem).hidden) {
        menuItemElm.classList.add('slick-header-menuitem-hidden');
      }

      if ((item as HeaderMenuCommandItem).cssClass) {
        menuItemElm.classList.add(...Utils.classNameToList((item as HeaderMenuCommandItem).cssClass));
      }

      if ((item as HeaderMenuCommandItem).tooltip) {
        menuItemElm.title = (item as HeaderMenuCommandItem).tooltip || '';
      }

      const iconElm = Utils.createDomElement('div', { className: 'slick-header-menuicon' });
      menuItemElm.appendChild(iconElm);

      if ((item as HeaderMenuCommandItem).iconCssClass) {
        iconElm.classList.add(...Utils.classNameToList((item as HeaderMenuCommandItem).iconCssClass));
      }

      if ((item as HeaderMenuCommandItem).iconImage) {
        iconElm.style.backgroundImage = 'url(' + (item as HeaderMenuCommandItem).iconImage + ')';
      }

      const textElm = Utils.createDomElement('span', {
        className: 'slick-header-menucontent',
        textContent: (item as HeaderMenuCommandItem).title || '',
      });
      menuItemElm.appendChild(textElm);

      if ((item as HeaderMenuCommandItem).textCssClass) {
        textElm.classList.add(...Utils.classNameToList((item as HeaderMenuCommandItem).textCssClass));
      }
      menuElm.appendChild(menuItemElm);

      if (addClickListener) {
        const eventGroup = isSubMenu ? 'sub-menu' : 'parent-menu';
        this._bindingEventService.bind(menuItemElm, 'click', this.handleMenuItemClick.bind(this, item, columnDef, level) as EventListener, undefined, eventGroup);
        this._bindingEventService.bind(menuItemElm, 'keydown', ((e: KeyboardEvent) => {
          const hasSubMenu = !!(item as HeaderMenuCommandItem).commandItems;
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
            // a disabled item is not in this list (index -1), it can only hold the focus after a mouse click
            const items = Array.from(menuElm.querySelectorAll<HTMLElement>(`:scope > ${MENU_ITEM_SELECTOR}`));
            const lastIndex = items.length - 1;
            let next = items.indexOf(menuItemElm) + (e.key === 'ArrowDown' ? 1 : -1);
            if (e.key === 'Home' || next > lastIndex) {
              next = 0;
            } else if (e.key === 'End' || next < 0) {
              next = lastIndex;
            }
            items[next]?.focus();
          } else if (e.key === 'Escape' || (e.key === 'ArrowLeft' && isSubMenu)) {
            if (isSubMenu) {
              // leave the sub-menu(s) only and go back to the item that opened them
              const rootItemElm = this._subMenuRootItemElm;
              this.destroySubMenus();
              rootItemElm?.focus();
            } else {
              this.hideMenu();
              this.restoreFocusAfterMenuClose();
            }
          } else if (e.key === 'Tab') {
            // let the focus move on from the menu button, without leaving an open menu behind
            this.getMenuTrigger()?.focus();
            this.hideMenu();
            return;
          } else if (e.key === 'Enter' || e.key === ' ' || (e.key === 'ArrowRight' && hasSubMenu)) {
            if (!(item as HeaderMenuCommandItem).disabled) {
              menuItemElm.click();
              if (hasSubMenu) {
                document.querySelector<HTMLElement>(`.slick-header-menu.slick-menu-level-${level + 1}${this.getGridUidSelector()} ${MENU_ITEM_SELECTOR}`)?.focus();
              } else if (!this._menuElm?.isConnected) {
                this.restoreFocusAfterMenuClose();
              }
            }
          } else {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
        }) as EventListener, undefined, eventGroup);
      }

      // optionally open sub-menu(s) by mouseover
      if (this._options.subMenuOpenByEvent === 'mouseover') {
        this._bindingEventService.bind(menuItemElm, 'mouseover', ((e: DOMMouseOrTouchEvent<HTMLDivElement>) => {
          if ((item as HeaderMenuCommandItem).commandItems) {
            this.repositionSubMenu(item as HeaderMenuCommandItem, columnDef, level, e);
          } else if (!isSubMenu) {
            this.destroySubMenus();
          }
        }) as EventListener);
      }

      // the option/command item could be a sub-menu if it has another list of commands/options
      if ((item as HeaderMenuCommandItem).commandItems) {
        menuItemElm.setAttribute('aria-haspopup', 'menu');
        const chevronElm = Utils.createDomElement('div', { className: 'sub-item-chevron' });
        if (this._options.subItemChevronClass) {
          chevronElm.classList.add(...Utils.classNameToList(this._options.subItemChevronClass));
        } else {
          chevronElm.textContent = '⮞'; // ⮞ or ▸
        }

        menuItemElm.classList.add('slick-submenu-item');
        menuItemElm.appendChild(chevronElm);
      }
    }

    return menuElm;
  }

  protected handleMenuItemClick(item: HeaderMenuCommandItem | 'divider', columnDef: Column, level = 0, e: DOMMouseOrTouchEvent<HTMLDivElement>): boolean | void {
    if (item !== 'divider' && !item.disabled && !item.divider) {
      const command = (item as HeaderMenuCommandItem).command || '';

      if (Utils.isDefined(command) && !item.commandItems) {
        const callbackArgs = {
          grid: this._grid,
          column: columnDef,
          command,
          item,
        };
        this.onCommand.notify(callbackArgs, e, this);

        // execute action callback when defined
        if (typeof item.action === 'function') {
          item.action.call(this, e, callbackArgs);
        }

        // unless prevented, close the menu
        if (!e.defaultPrevented) {
          this.hideMenu();
        }
      } else if (item.commandItems) {
        this.repositionSubMenu(item as HeaderMenuCommandItem, columnDef, level, e);
      } else {
        this.destroySubMenus();
      }
    }
  }

  protected repositionSubMenu(item: HeaderMenuCommandItem, columnDef: Column, level: number, e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    // when we're clicking a grid cell OR our last menu type (command/option) differs then we know that we need to start fresh and close any sub-menus that might still be open
    if (e.target.classList.contains('slick-header-menubutton')) {
      this.destroySubMenus();
    }

    // remember the item of the parent menu that opens the sub-menu tree, the keyboard goes back to it when leaving the sub-menu(s)
    if (level === 0) {
      this._subMenuRootItemElm = e.target.closest<HTMLElement>('.slick-header-menuitem');
    }

    // creating sub-menu, we'll also pass level & the item object since we might have "subMenuTitle" to show
    const subMenuElm = this.createMenu(item.commandItems || [], columnDef, level + 1, item);
    document.body.appendChild(subMenuElm);
    this.repositionMenu(e, subMenuElm);
  }

  protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, menuElm: HTMLDivElement) {
    const buttonElm = e.target;
    const isSubMenu = menuElm.classList.contains('slick-submenu');
    const parentElm = isSubMenu
      ? e.target.closest('.slick-header-menuitem') as HTMLDivElement
      : buttonElm as HTMLElement;

    const btnOffset = Utils.offset(buttonElm);
    const gridPos = this._grid.getGridPosition();
    const menuWidth = menuElm.offsetWidth;
    const menuOffset = Utils.offset(this._menuElm!);
    const parentOffset = Utils.offset(parentElm);
    const menuOffsetTop = isSubMenu
      ? parentOffset?.top ?? 0
      : buttonElm.clientHeight ?? btnOffset?.top ?? 0 + (this._options?.menuOffsetTop ?? 0);
    let menuOffsetLeft = isSubMenu ? parentOffset?.left ?? 0 : btnOffset?.left ?? 0;

    // when auto-align is set, it will calculate whether it has enough space in the viewport to show the drop menu on the right (default)
    // if there isn't enough space on the right, it will automatically align the drop menu to the left
    // to simulate an align left, we actually need to know the width of the drop menu
    if (isSubMenu && parentElm) {
      let subMenuPosCalc = menuOffsetLeft + Number(menuWidth); // calculate coordinate at caller element far right
      if (isSubMenu) {
        subMenuPosCalc += parentElm.clientWidth;
      }
      const browserWidth = document.documentElement.clientWidth;
      const dropSide = (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth) ? 'left' : 'right';
      if (dropSide === 'left') {
        menuElm.classList.remove('dropright');
        menuElm.classList.add('dropleft');
        menuOffsetLeft -= menuWidth;
      } else {
        menuElm.classList.remove('dropleft');
        menuElm.classList.add('dropright');
        if (isSubMenu) {
          menuOffsetLeft += parentElm.offsetWidth;
        }
      }
    } else {
      if (menuOffsetLeft + menuElm.offsetWidth >= gridPos.width) {
        menuOffsetLeft = menuOffsetLeft + buttonElm.clientWidth - menuElm.clientWidth + (this._options.autoAlignOffset || 0);
      }
      menuOffsetLeft -= menuOffset?.left ?? 0;
    }

    // ready to reposition the menu
    menuElm.style.top = `${menuOffsetTop}px`;
    menuElm.style.left = `${menuOffsetLeft}px`;
  }

  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean {
    if (typeof overrideFn === 'function') {
      return overrideFn.call(this, args);
    }
    return true;
  }
}

// extend Slick namespace on window object when building as iife
/* v8 ignore next -- IIFE_ONLY is compiled as false in the unit-test build. */
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        HeaderMenu: SlickHeaderMenu
      }
    }
  });
}
