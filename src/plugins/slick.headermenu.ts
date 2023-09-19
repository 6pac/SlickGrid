import { BindingEventService as BindingEventService_, Event as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core';
import type {
  Column,
  DOMEvent,
  HeaderMenuCommandItemCallbackArgs,
  HeaderMenuItems,
  HeaderMenuOption,
  MenuCommandItem,
  MenuCommandItemCallbackArgs,
  Plugin,
  OnHeaderCellRenderedEventArgs
} from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

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
 *              items: [
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
export class SlickHeaderMenu implements Plugin {
  // --
  // public API
  pluginName = 'HeaderMenu' as const;
  onAfterMenuShow = new SlickEvent<HeaderMenuCommandItemCallbackArgs>();
  onBeforeMenuShow = new SlickEvent<HeaderMenuCommandItemCallbackArgs>();
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _handler = new SlickEventHandler();
  protected _bindingEventService = new BindingEventService();
  protected _defaults: HeaderMenuOption = {
    buttonCssClass: undefined,
    buttonImage: undefined,
    minWidth: 100,
    autoAlign: true,
    autoAlignOffset: 0
  };
  protected _options: HeaderMenuOption;
  protected _activeHeaderColumnElm?: HTMLDivElement | null;
  protected _menuElm?: HTMLDivElement | null;

  constructor(options: Partial<HeaderMenuOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._handler
      .subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this))
      .subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this));

    // Force the grid to re-render the header now that the events are hooked up.
    this._grid.setColumns(this._grid.getColumns());

    // Hide the menu on outside click.
    this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);
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
    this._activeHeaderColumnElm = undefined;
  }

  protected handleBodyMouseDown(e: DOMEvent<HTMLElement>) {
    if ((this._menuElm !== e.target && !this._menuElm?.contains(e.target)) || e.target.className === 'close') {
      this.hideMenu();
    }
  }

  hideMenu() {
    if (this._menuElm) {
      this._menuElm.remove();
      this._menuElm = undefined;
    }
    this._activeHeaderColumnElm?.classList.remove('slick-header-column-active');
  }

  protected handleHeaderCellRendered(_e: Event, args: OnHeaderCellRenderedEventArgs) {
    const column = args.column;
    const menu = column?.header?.menu as HeaderMenuItems;

    if (menu) {
      // run the override function (when defined), if the result is false it won't go further
      if (!this.runOverrideFunctionWhenExists<typeof args>(this._options.menuUsabilityOverride, args)) {
        return;
      }

      const elm = document.createElement('div');
      elm.className = 'slick-header-menubutton';
      elm.ariaLabel = 'Header Menu';
      elm.role = 'button';

      if (!this._options.buttonCssClass && !this._options.buttonImage) {
        this._options.buttonCssClass = 'caret'; // default when nothing is provided
      }

      if (this._options.buttonCssClass) {
        // sgi icon with mask requires inner span to work properly
        const icon = document.createElement('span');
        icon.classList.add(...this._options.buttonCssClass.split(' '));
        elm.appendChild(icon);
      }

      if (this._options.buttonImage) {
        elm.style.backgroundImage = `url(${this._options.buttonImage})`;
      }

      if (this._options.tooltip) {
        elm.title = this._options.tooltip;
      }

      this._bindingEventService.bind(elm, 'click', ((e: MouseEvent) => this.showMenu(e, menu, args.column)) as EventListener);
      args.node.appendChild(elm);
    }
  }

  protected handleBeforeHeaderCellDestroy(_e: Event, args: { column: Column; node: HTMLElement; }) {
    const column = args.column;

    if (column.header?.menu) {
      args.node.querySelectorAll('.slick-header-menubutton').forEach(elm => elm.remove());
    }
  }


  protected showMenu(event: MouseEvent, menu: HeaderMenuItems, columnDef: Column) {
    // Let the user modify the menu or cancel altogether,
    // or provide alternative menu implementation.
    const callbackArgs = {
      grid: this._grid,
      column: columnDef,
      menu
    } as unknown as HeaderMenuCommandItemCallbackArgs;
    if (this.onBeforeMenuShow.notify(callbackArgs, event, this).getReturnValue() == false) {
      return;
    }

    if (!this._menuElm) {
      this._menuElm = document.createElement('div');
      this._menuElm.className = 'slick-header-menu';
      this._menuElm.role = 'menu';
      this._menuElm.style.minWidth = `${this._options.minWidth}px`;
      this._menuElm.setAttribute('aria-expanded', 'true');
      const containerNode = this._grid.getContainerNode();
      if (containerNode) {
        containerNode.appendChild(this._menuElm);
      }
    }

    // make sure the menu element is an empty div before adding all list of commands
    Utils.emptyElement(this._menuElm);

    // Construct the menu items.
    for (let i = 0; i < menu.items.length; i++) {
      const item = menu.items[i];

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists((item as MenuCommandItem).itemVisibilityOverride, callbackArgs);
      const isItemUsable = this.runOverrideFunctionWhenExists((item as MenuCommandItem).itemUsabilityOverride, callbackArgs);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as MenuCommandItem).disabled = isItemUsable ? false : true;
      }

      const menuItem = document.createElement('div');
      menuItem.className = 'slick-header-menuitem';
      menuItem.role = 'menuitem';

      if ((item as MenuCommandItem).divider || item === 'divider') {
        menuItem.classList.add('slick-header-menuitem-divider');
        continue;
      }

      if ((item as MenuCommandItem).disabled) {
        menuItem.classList.add('slick-header-menuitem-disabled');
      }

      if ((item as MenuCommandItem).hidden) {
        menuItem.classList.add('slick-header-menuitem-hidden');
      }

      if ((item as MenuCommandItem).cssClass) {
        menuItem.classList.add(...item.cssClass!.split(' '));
      }

      if ((item as MenuCommandItem).tooltip) {
        menuItem.title = (item as MenuCommandItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-header-menuicon';
      menuItem.appendChild(iconElm);

      if ((item as MenuCommandItem).iconCssClass) {
        iconElm.classList.add(...(item as MenuCommandItem).iconCssClass!.split(' '));
      }

      if ((item as MenuCommandItem).iconImage) {
        iconElm.style.backgroundImage = 'url(' + (item as MenuCommandItem).iconImage + ')';
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-header-menucontent';
      textElm.textContent = (item as MenuCommandItem).title || '';
      menuItem.appendChild(textElm);

      if ((item as MenuCommandItem).textCssClass) {
        textElm.classList.add(...(item as MenuCommandItem).textCssClass!.split(' '));
      }

      this._menuElm.appendChild(menuItem);
      this._bindingEventService.bind(menuItem, 'click', this.handleMenuItemClick.bind(this, item, columnDef) as EventListener);
    }

    const buttonElm = event.target as HTMLButtonElement;
    const btnOffset = Utils.offset(buttonElm);
    const menuOffset = Utils.offset(this._menuElm);
    let leftPos = btnOffset?.left ?? 0;


    // when auto-align is set, it will calculate whether it has enough space in the viewport to show the drop menu on the right (default)
    // if there isn't enough space on the right, it will automatically align the drop menu to the left
    // to simulate an align left, we actually need to know the width of the drop menu
    if (this._options.autoAlign) {
      const gridPos = this._grid.getGridPosition();
      if (leftPos + this._menuElm.offsetWidth >= gridPos.width) {
        leftPos = leftPos + buttonElm.clientWidth - this._menuElm.clientWidth + (this._options.autoAlignOffset || 0);
      }
    }

    this._menuElm.style.top = `${(buttonElm.clientHeight ?? btnOffset?.top ?? 0 + (this._options?.menuOffsetTop ?? 0))}px`;
    this._menuElm.style.left = `${leftPos - (menuOffset?.left ?? 0)}px`;

    // Mark the header as active to keep the highlighting.
    this._activeHeaderColumnElm = this._menuElm.closest('.slick-header-column');
    if (this._activeHeaderColumnElm) {
      this._activeHeaderColumnElm.classList.add('slick-header-column-active');
    }

    if (this.onAfterMenuShow.notify(callbackArgs, event, this).getReturnValue() == false) {
      return;
    }

    // Stop propagation so that it doesn't register as a header click event.
    event.preventDefault();
    event.stopPropagation();
  }

  protected handleMenuItemClick(item: MenuCommandItem | 'divider', columnDef: Column, e: DOMEvent<HTMLDivElement>): boolean | void {
    const command = (item as MenuCommandItem).command || '';

    if ((item as MenuCommandItem).disabled || (item as MenuCommandItem).divider || item === 'divider') {
      return false;
    }

    if (command !== null && command !== '') {
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
    }

    if (!e.defaultPrevented) {
      this.hideMenu();
    }

    // Stop propagation so that it doesn't register as a header click event.
    e.preventDefault();
    e.stopPropagation();
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
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        HeaderMenu: SlickHeaderMenu
      }
    }
  });
}

