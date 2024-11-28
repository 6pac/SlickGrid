import type {
  Column,
  DOMMouseOrTouchEvent,
  GridMenuCommandItemCallbackArgs,
  GridMenuEventWithElementCallbackArgs,
  GridMenuItem,
  GridMenuOption,
  GridOption,
  MenuCommandItem,
  onGridMenuColumnsChangedCallbackArgs
} from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, Utils as Utils_ } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * A control to add a Grid Menu (hambuger menu on top-right of the grid)
 *
 * USAGE:
 *
 * Add the slick.gridmenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * let gridMenuControl = new Slick.Controls.GridMenu(columns, grid, options);
 *
 * Available grid options, by defining a gridMenu object:
 *
 *  let options = {
 *    enableCellNavigation: true,
 *    gridMenu: {
 *      commandTitle: "Command List",                // default to empty string
 *      columnTitle: "Columns",                     // default to empty string
 *      iconImage: "some-image.png",                // this is the Grid Menu icon (hamburger icon)
 *      iconCssClass: "fa fa-bars",                 // you can provide iconImage OR iconCssClass
 *      leaveOpen: false,                           // do we want to leave the Grid Menu open after a command execution? (false by default)
 *      menuWidth: 18,                              // width (icon) that will be use to resize the column header container (18 by default)
 *      contentMinWidth: 0,							            // defaults to 0 (auto), minimum width of grid menu content (command, column list)
 *      marginBottom: 15,                           // defaults to 15, margin to use at the bottom of the grid when using max-height (default)
 *      resizeOnShowHeaderRow: false,               // false by default
 *      showButton: true,                           // true by default - it allows the user to control if the
 *                                                          // default gridMenu button (located on the top right corner by default CSS)
 *                                                          // should be created or omitted
 *      useClickToRepositionMenu: true,             // true by default
 *
 *      // the last 2 checkboxes titles
 *      hideForceFitButton: false,                  // show/hide checkbox near the end "Force Fit Columns"
 *      hideSyncResizeButton: false,                // show/hide checkbox near the end "Synchronous Resize"
 *      forceFitTitle: "Force fit columns",         // default to "Force fit columns"
 *      syncResizeTitle: "Synchronous resize",      // default to "Synchronous resize"
 *
 *      commandItems: [
 *        {
 *          // command menu item options
 *        },
 *        {
 *          // command menu item options
 *        }
 *      ]
 *    }
 *  };
 *
 *
 * Available menu options:
 *    hideForceFitButton:         Hide the "Force fit columns" button (defaults to false)
 *    hideSyncResizeButton:       Hide the "Synchronous resize" button (defaults to false)
 *    forceFitTitle:              Text of the title "Force fit columns"
 *    contentMinWidth:						minimum width of grid menu content (command, column list), defaults to 0 (auto)
 *    height:                     Height of the Grid Menu content, when provided it will be used instead of the max-height (defaults to undefined)
 *    menuWidth:                  Grid menu button width (defaults to 18)
 *    resizeOnShowHeaderRow:      Do we want to resize on the show header row event
 *    syncResizeTitle:            Text of the title "Synchronous resize"
 *    useClickToRepositionMenu:   Use the Click offset to reposition the Grid Menu (defaults to true), when set to False it will use the icon offset to reposition the grid menu
 *    menuUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *    marginBottom:               Margin to use at the bottom of the grid menu, only in effect when height is undefined (defaults to 15)
 *    subItemChevronClass:        CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon)
 *    subMenuOpenByEvent:         defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click"
 *
 * Available command menu item options:
 *    action:                     Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    title:                      Menu item text.
 *    divider:                    Whether the current item is a divider, not an actual command.
 *    disabled:                   Whether the item/command is disabled.
 *    hidden:                     Whether the item/command is hidden.
 *    tooltip:                    Item tooltip.
 *    command:                    A command identifier to be passed to the onCommand event handlers.
 *    cssClass:                   A CSS class to be added to the menu item container.
 *    iconCssClass:               A CSS class to be added to the menu item icon.
 *    iconImage:                  A url to the icon image.
 *    textCssClass:               A CSS class to be added to the menu item text.
 *    subMenuTitle:               Optional sub-menu title that will shows up when sub-menu commmands/options list is opened
 *    subMenuTitleCssClass:       Optional sub-menu title CSS class to use with `subMenuTitle`
 *    itemVisibilityOverride:     Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 *
 * The plugin exposes the following events:
 *
 *    onAfterMenuShow:   Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
 *      * ONLY works with a JS event (as per slick.core code), so we cannot notify when it's a button event (when grid menu is attached to an external button, not the hamburger menu)
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            menu:     Menu options.  Note that you can change the menu items here.
 *
 *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
 *      * ONLY works with a JS event (as per slick.core code), so we cannot notify when it's a button event (when grid menu is attached to an external button, not the hamburger menu)
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            menu:     Menu options.  Note that you can change the menu items here.
 *
 *    onMenuClose:      Fired when the menu is closing.
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
 */

export class SlickGridMenu {
  // --
  // public API
  onAfterMenuShow = new SlickEvent<GridMenuEventWithElementCallbackArgs>('onAfterMenuShow');
  onBeforeMenuShow = new SlickEvent<GridMenuEventWithElementCallbackArgs>('onBeforeMenuShow');
  onMenuClose = new SlickEvent<GridMenuEventWithElementCallbackArgs>('onMenuClose');
  onCommand = new SlickEvent<GridMenuCommandItemCallbackArgs>('onCommand');
  onColumnsChanged = new SlickEvent<onGridMenuColumnsChangedCallbackArgs>('onColumnsChanged');

  // --
  // protected props
  protected _bindingEventService: BindingEventService_;
  protected _gridOptions: GridOption;
  protected _gridUid: string;
  protected _isMenuOpen = false;
  protected _columnCheckboxes: HTMLInputElement[] = [];
  protected _columnTitleElm!: HTMLElement;
  protected _commandTitleElm!: HTMLElement;
  protected _commandListElm!: HTMLDivElement;
  protected _headerElm: HTMLDivElement | null = null;
  protected _listElm!: HTMLElement;
  protected _buttonElm!: HTMLElement;
  protected _menuElm!: HTMLElement;
  protected _subMenuParentId = '';
  protected _gridMenuOptions: GridMenuOption | null = null;
  protected _defaults: GridMenuOption = {
    showButton: true,
    hideForceFitButton: false,
    hideSyncResizeButton: false,
    forceFitTitle: 'Force fit columns',
    marginBottom: 15,
    menuWidth: 18,
    contentMinWidth: 0,
    resizeOnShowHeaderRow: false,
    subMenuOpenByEvent: 'mouseover',
    syncResizeTitle: 'Synchronous resize',
    useClickToRepositionMenu: true,
    headerColumnValueExtractor: (columnDef: Column) => Utils.getHtmlStringOutput(columnDef.name || '', 'innerHTML'),
  };

  constructor(protected columns: Column[], protected readonly grid: SlickGrid, gridOptions: GridOption) {
    this._gridUid = grid.getUID();
    this._gridOptions = gridOptions;
    this._gridMenuOptions = Utils.extend({}, this._defaults, gridOptions.gridMenu);
    this._bindingEventService = new BindingEventService();

    // when a grid optionally changes from a regular grid to a frozen grid, we need to destroy & recreate the grid menu
    // we do this change because the Grid Menu is on the left container for a regular grid, it is however on the right container for a frozen grid
    grid.onSetOptions.subscribe((_e, args) => {
      if (args && args.optionsBefore && args.optionsAfter) {
        const switchedFromRegularToFrozen = args.optionsBefore.frozenColumn! >= 0 && args.optionsAfter.frozenColumn === -1;
        const switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn! >= 0;
        if (switchedFromRegularToFrozen || switchedFromFrozenToRegular) {
          this.recreateGridMenu();
        }
      }
    });
    this.init(this.grid);
  }

  init(grid: SlickGrid) {
    this._gridOptions = grid.getOptions();
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this.createGridMenu();

    if (this._gridMenuOptions?.customItems || this._gridMenuOptions?.customTitle) {
      console.warn('[SlickGrid] Grid Menu "customItems" and "customTitle" were deprecated to align with other Menu plugins, please use "commandItems" and "commandTitle" instead.');
    }

    // subscribe to the grid, when it's destroyed, we should also destroy the Grid Menu
    grid.onBeforeDestroy.subscribe(this.destroy.bind(this));
  }

  setOptions(newOptions: GridMenuOption) {
    this._gridMenuOptions = Utils.extend({}, this._gridMenuOptions, newOptions);
  }

  protected createGridMenu() {
    const gridMenuWidth = (this._gridMenuOptions?.menuWidth) || this._defaults.menuWidth;
    if (this._gridOptions && this._gridOptions.hasOwnProperty('frozenColumn') && this._gridOptions.frozenColumn! >= 0) {
      this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-right`);
    } else {
      this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-left`);
    }
    this._headerElm!.style.width = `calc(100% - ${gridMenuWidth}px)`;

    // if header row is enabled, we need to resize its width also
    const enableResizeHeaderRow = (Utils.isDefined(this._gridMenuOptions?.resizeOnShowHeaderRow)) ? this._gridMenuOptions!.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow;
    if (enableResizeHeaderRow && this._gridOptions.showHeaderRow) {
      const headerRow = document.querySelector<HTMLDivElement>(`.${this._gridUid}.slick-headerrow`);
      if (headerRow) {
        headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`;
      }
    }

    const showButton = (this._gridMenuOptions?.showButton !== undefined) ? this._gridMenuOptions.showButton : this._defaults.showButton;
    if (showButton) {
      this._buttonElm = document.createElement('button');
      this._buttonElm.className = 'slick-gridmenu-button';
      this._buttonElm.ariaLabel = 'Grid Menu';

      if (this._gridMenuOptions?.iconCssClass) {
        this._buttonElm.classList.add(...Utils.classNameToList(this._gridMenuOptions.iconCssClass));
      } else {
        const iconImageElm = document.createElement('img');
        iconImageElm.src = (this._gridMenuOptions?.iconImage) ? this._gridMenuOptions.iconImage : '../images/drag-handle.png';
        this._buttonElm.appendChild(iconImageElm);
      }

      // add the grid menu button in the preheader (when exists) or always in the column header (default)
      const buttonContainerTarget = this._gridMenuOptions?.iconButtonContainer === 'preheader' ? 'firstChild' : 'lastChild';
      this._headerElm!.parentElement!.insertBefore(this._buttonElm, this._headerElm!.parentElement![buttonContainerTarget]);

      // add on click handler for the Grid Menu itself
      this._bindingEventService.bind(this._buttonElm, 'click', this.showGridMenu.bind(this) as EventListener);
    }

    this._menuElm = this.createMenu(0);
    this.populateColumnPicker();
    document.body.appendChild(this._menuElm);

    // Hide the menu on outside click.
    this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);

    // destroy the picker if user leaves the page
    this._bindingEventService.bind(document.body, 'beforeunload', this.destroy.bind(this));
  }

  /** Create the menu or sub-menu(s) but without the column picker which is a separate single process */
  createMenu(level = 0, item?: GridMenuItem | MenuCommandItem | 'divider') {
    // create a new cell menu
    const maxHeight = isNaN(this._gridMenuOptions?.maxHeight as number) ? this._gridMenuOptions?.maxHeight : `${this._gridMenuOptions?.maxHeight ?? 0}px`;
    const width = isNaN(this._gridMenuOptions?.width as number) ? this._gridMenuOptions?.width : `${this._gridMenuOptions?.maxWidth ?? 0}px`;

    // to avoid having multiple sub-menu trees opened,
    // we need to somehow keep trace of which parent menu the tree belongs to
    // and we should keep ref of only the first sub-menu parent, we can use the command name (remove any whitespaces though)
    const subMenuCommand = (item as GridMenuItem)?.command;
    let subMenuId = (level === 1 && subMenuCommand) ? subMenuCommand.replaceAll(' ', '') : '';
    if (subMenuId) {
      this._subMenuParentId = subMenuId;
    }
    if (level > 1) {
      subMenuId = this._subMenuParentId;
    }

    const menuClasses = `slick-gridmenu slick-menu-level-${level} ${this._gridUid}`;
    const bodyMenuElm = document.body.querySelector<HTMLDivElement>(`.slick-gridmenu.slick-menu-level-${level}${this.getGridUidSelector()}`);

    // return menu/sub-menu if it's already opened unless we are on different sub-menu tree if so close them all
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId) {
        return bodyMenuElm;
      }
      this.destroySubMenus();
    }

    const menuElm = document.createElement('div');
    menuElm.role = 'menu';
    menuElm.className = menuClasses;
    if (level > 0) {
      menuElm.classList.add('slick-submenu');
      if (subMenuId) {
        menuElm.dataset.subMenuParent = subMenuId;
      }
    }
    menuElm.ariaLabel = level > 1 ? 'SubMenu' : 'Grid Menu';

    if (width) {
      menuElm.style.width = width as string;
    }
    if (maxHeight) {
      menuElm.style.maxHeight = maxHeight as string;
    }

    menuElm.style.display = 'none';

    let closeButtonElm: HTMLButtonElement | null = null;
    if (level === 0) {
      closeButtonElm = document.createElement('button');
      closeButtonElm.type = 'button';
      closeButtonElm.className = 'close';
      closeButtonElm.dataset.dismiss = 'slick-gridmenu';
      closeButtonElm.ariaLabel = 'Close';

      const spanCloseElm = document.createElement('span');
      spanCloseElm.className = 'close';
      spanCloseElm.ariaHidden = 'true';
      spanCloseElm.textContent = '×';
      closeButtonElm.appendChild(spanCloseElm);
      menuElm.appendChild(closeButtonElm);
    }

    // -- Command List section
    this._commandListElm = document.createElement('div');
    this._commandListElm.className = `slick-gridmenu-custom slick-gridmenu-command-list slick-menu-level-${level}`;
    this._commandListElm.role = 'menu';
    menuElm.appendChild(this._commandListElm);

    const commandItems =
      (item as GridMenuItem)?.commandItems
      ?? (item as GridMenuItem)?.customItems
      ?? this._gridMenuOptions?.commandItems
      ?? this._gridMenuOptions?.customItems
      ?? [];

    if (commandItems.length > 0) {

      // when creating sub-menu add its sub-menu title when exists
      if (item && level > 0) {
        this.addSubMenuTitleWhenExists(item, this._commandListElm); // add sub-menu title when exists
      }
    }
    this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level });

    // increment level for possible next sub-menus if exists
    level++;

    return menuElm;
  }

  /** Destroy the plugin by unsubscribing every events & also delete the menu DOM elements */
  destroy() {
    this.onAfterMenuShow.unsubscribe();
    this.onBeforeMenuShow.unsubscribe();
    this.onMenuClose.unsubscribe();
    this.onCommand.unsubscribe();
    this.onColumnsChanged.unsubscribe();
    this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this));
    this.grid.onBeforeDestroy.unsubscribe();
    this.grid.onSetOptions.unsubscribe();
    this._bindingEventService.unbindAll();
    this._menuElm?.remove();
    this.deleteMenu();
  }

  /** Delete the menu DOM element but without unsubscribing any events */
  deleteMenu() {
    this._bindingEventService.unbindAll();
    const gridMenuElm = document.querySelector<HTMLDivElement>(`div.slick-gridmenu.${this._gridUid}`);
    if (gridMenuElm) {
      gridMenuElm.style.display = 'none';
    }
    if (this._headerElm) {
      // put back original width (fixes width and frozen+gridMenu on left header)
      this._headerElm.style.width = '100%';
    }
    this._buttonElm?.remove();
    this._menuElm?.remove();
  }

  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll('sub-menu');
    document.querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  /** Construct the custom command menu items. */
  protected populateCommandsMenu(commandItems: Array<GridMenuItem | MenuCommandItem | 'divider'>, commandListElm: HTMLElement, args: { grid: SlickGrid, level: number }) {
    // user could pass a title on top of the custom section
    const level = args?.level || 0;
    const isSubMenu = level > 0;
    if (!isSubMenu && (this._gridMenuOptions?.commandTitle || this._gridMenuOptions?.customTitle)) {
      this._commandTitleElm = document.createElement('div');
      this._commandTitleElm.className = 'title';
      this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString((this._gridMenuOptions.commandTitle || this._gridMenuOptions.customTitle) as string));
      commandListElm.appendChild(this._commandTitleElm);
    }

    for (let i = 0, ln = commandItems.length; i < ln; i++) {
      let addClickListener = true;
      const item = commandItems[i];
      const callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        columns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists<typeof callbackArgs>((item as GridMenuItem).itemVisibilityOverride, callbackArgs);
      const isItemUsable = this.runOverrideFunctionWhenExists<typeof callbackArgs>((item as GridMenuItem).itemUsabilityOverride, callbackArgs);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemClick" has the correct flag and won't trigger a command clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as GridMenuItem).disabled = isItemUsable ? false : true;
      }

      const liElm = document.createElement('div');
      liElm.className = 'slick-gridmenu-item';
      liElm.role = 'menuitem';

      if ((item as GridMenuItem).divider || item === 'divider') {
        liElm.classList.add('slick-gridmenu-item-divider');
        addClickListener = false;
      }
      if ((item as GridMenuItem).disabled) {
        liElm.classList.add('slick-gridmenu-item-disabled');
      }

      if ((item as GridMenuItem).hidden) {
        liElm.classList.add('slick-gridmenu-item-hidden');
      }

      if ((item as GridMenuItem).cssClass) {
        liElm.classList.add(...Utils.classNameToList((item as GridMenuItem).cssClass));
      }

      if ((item as GridMenuItem).tooltip) {
        liElm.title = (item as GridMenuItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-gridmenu-icon';

      liElm.appendChild(iconElm);

      if ((item as GridMenuItem).iconCssClass) {
        iconElm.classList.add(...Utils.classNameToList((item as GridMenuItem).iconCssClass));
      }

      if ((item as GridMenuItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as GridMenuItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-gridmenu-content';
      this.grid.applyHtmlCode(textElm, this.grid.sanitizeHtmlString((item as GridMenuItem).title || ''));

      liElm.appendChild(textElm);

      if ((item as GridMenuItem).textCssClass) {
        textElm.classList.add(...Utils.classNameToList((item as GridMenuItem).textCssClass));
      }

      commandListElm.appendChild(liElm);

      if (addClickListener) {
        const eventGroup = isSubMenu ? 'sub-menu' : 'parent-menu';
        this._bindingEventService.bind(liElm, 'click', this.handleMenuItemClick.bind(this, item, level) as EventListener, undefined, eventGroup);
      }

      // optionally open sub-menu(s) by mouseover
      if (this._gridMenuOptions?.subMenuOpenByEvent === 'mouseover') {
        this._bindingEventService.bind(liElm, 'mouseover', ((e: DOMMouseOrTouchEvent<HTMLDivElement>) => {
          if ((item as GridMenuItem).commandItems || (item as GridMenuItem).customItems) {
            this.repositionSubMenu(item, level, e);
          } else if (!isSubMenu) {
            this.destroySubMenus();
          }
        }) as EventListener);
      }

      // the option/command item could be a sub-menu if it has another list of commands/options
      if ((item as GridMenuItem).commandItems || (item as GridMenuItem).customItems) {
        const chevronElm = document.createElement('span');
        chevronElm.className = 'sub-item-chevron';
        if (this._gridMenuOptions?.subItemChevronClass) {
          chevronElm.classList.add(...Utils.classNameToList(this._gridMenuOptions.subItemChevronClass));
        } else {
          chevronElm.textContent = '⮞'; // ⮞ or ▸
        }

        liElm.classList.add('slick-submenu-item');
        liElm.appendChild(chevronElm);
        continue;
      }
    }
  }

  /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
  protected populateColumnPicker() {
    this.grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this));

    // user could pass a title on top of the columns list
    if (this._gridMenuOptions?.columnTitle) {
      this._columnTitleElm = document.createElement('div');
      this._columnTitleElm.className = 'title';
      this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(this._gridMenuOptions.columnTitle));
      this._menuElm.appendChild(this._columnTitleElm);
    }

    this._bindingEventService.bind(this._menuElm, 'click', this.updateColumn.bind(this) as EventListener);
    this._listElm = document.createElement('span');
    this._listElm.className = 'slick-gridmenu-list';
    this._listElm.role = 'menu';
  }

  /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
  recreateGridMenu() {
    this.deleteMenu();
    this.init(this.grid);
  }

  showGridMenu(e: DOMMouseOrTouchEvent<HTMLButtonElement>) {
    const targetEvent = e.touches ? e.touches[0] : e;
    e.preventDefault();

    // empty both the picker list & the command list
    Utils.emptyElement(this._listElm);
    Utils.emptyElement(this._commandListElm);

    const commandItems = this._gridMenuOptions?.commandItems ?? this._gridMenuOptions?.customItems ?? [];
    this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level: 0 });
    this.updateColumnOrder();
    this._columnCheckboxes = [];

    const callbackArgs = {
      grid: this.grid,
      menu: this._menuElm,
      allColumns: this.columns,
      visibleColumns: this.getVisibleColumns()
    };

    // run the override function (when defined), if the result is false it won't go further
    if (this._gridMenuOptions && !this.runOverrideFunctionWhenExists<typeof callbackArgs>(this._gridMenuOptions.menuUsabilityOverride, callbackArgs)) {
      return;
    }

    // notify of the onBeforeMenuShow only works when
    // this mean that we cannot notify when the grid menu is attach to a button event
    if (typeof e.stopPropagation === 'function') {
      if (this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() === false) {
        return;
      }
    }

    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id;
      excludeCssClass = this.columns[i].excludeFromGridMenu ? 'hidden' : '';
      const colName: string = this.columns[i].name instanceof HTMLElement
        ? (this.columns[i].name as HTMLElement).innerHTML
        : (this.columns[i].name || '') as string;

      const liElm = document.createElement('li');
      liElm.className = excludeCssClass;
      liElm.ariaLabel = colName;

      const checkboxElm = document.createElement('input');
      checkboxElm.type = 'checkbox';
      checkboxElm.id = `${this._gridUid}-gridmenu-colpicker-${columnId}`;
      checkboxElm.dataset.columnid = String(this.columns[i].id);
      liElm.appendChild(checkboxElm);

      if (Utils.isDefined(this.grid.getColumnIndex(this.columns[i].id)) && !this.columns[i].hidden) {
        checkboxElm.checked = true;
      }

      this._columnCheckboxes.push(checkboxElm);

      // get the column label from the picker value extractor (user can optionally provide a custom extractor)
      columnLabel = (this._gridMenuOptions?.headerColumnValueExtractor)
        ? this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions)
        : this._defaults.headerColumnValueExtractor!(this.columns[i]);

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-${columnId}`;
      this.grid.applyHtmlCode(labelElm, this.grid.sanitizeHtmlString(Utils.getHtmlStringOutput(columnLabel || '')));
      liElm.appendChild(labelElm);
      this._listElm.appendChild(liElm);
    }

    if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton)) {
      this._listElm.appendChild(document.createElement('hr'));
    }

    if (!(this._gridMenuOptions?.hideForceFitButton)) {
      const forceFitTitle = (this._gridMenuOptions?.forceFitTitle) || this._defaults.forceFitTitle as string;

      const liElm = document.createElement('li');
      liElm.ariaLabel = forceFitTitle;
      liElm.role = 'menuitem';
      this._listElm.appendChild(liElm);

      const forceFitCheckboxElm = document.createElement('input');
      forceFitCheckboxElm.type = 'checkbox';
      forceFitCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-forcefit`;
      forceFitCheckboxElm.dataset.option = 'autoresize';
      liElm.appendChild(forceFitCheckboxElm);

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-forcefit`;
      labelElm.textContent = forceFitTitle;
      liElm.appendChild(labelElm);

      if (this.grid.getOptions().forceFitColumns) {
        forceFitCheckboxElm.checked = true;
      }
    }

    if (!(this._gridMenuOptions?.hideSyncResizeButton)) {
      const syncResizeTitle = (this._gridMenuOptions?.syncResizeTitle) || this._defaults.syncResizeTitle as string;

      const liElm = document.createElement('li');
      liElm.ariaLabel = syncResizeTitle;
      this._listElm.appendChild(liElm);

      const syncResizeCheckboxElm = document.createElement('input');
      syncResizeCheckboxElm.type = 'checkbox';
      syncResizeCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-syncresize`;
      syncResizeCheckboxElm.dataset.option = 'syncresize';
      liElm.appendChild(syncResizeCheckboxElm);

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-syncresize`;
      labelElm.textContent = syncResizeTitle;
      liElm.appendChild(labelElm);

      if (this.grid.getOptions().syncColumnCellResize) {
        syncResizeCheckboxElm.checked = true;
      }
    }

    let buttonElm = (e.target.nodeName === 'BUTTON' ? e.target : e.target.querySelector('button')) as HTMLButtonElement; // get button element
    if (!buttonElm) {
      buttonElm = e.target.parentElement as HTMLButtonElement; // external grid menu might fall in this last case if wrapped in a span/div
    }

    // we need to display the menu to properly calculate its width but we can however make it invisible
    this._menuElm.style.display = 'block';
    this._menuElm.style.opacity = '0';

    this.repositionMenu(e, this._menuElm, buttonElm);

    // set "height" when defined OR ELSE use the "max-height" with available window size and optional margin bottom
    const menuMarginBottom = (this._gridMenuOptions?.marginBottom !== undefined) ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom as number;
    if (this._gridMenuOptions?.height !== undefined) {
      this._menuElm.style.height = `${this._gridMenuOptions.height}px`;
    } else {
      this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`;
    }

    this._menuElm.style.display = 'block';
    this._menuElm.style.opacity = '1'; // restore menu visibility
    this._menuElm.appendChild(this._listElm);
    this._isMenuOpen = true;

    if (typeof e.stopPropagation === 'function') {
      if (this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue() === false) {
        return;
      }
    }
  }

  protected getGridUidSelector() {
    const gridUid = this.grid.getUID() || '';
    return gridUid ? `.${gridUid}` : '';
  }

  protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLElement>) {
    // did we click inside the menu or any of its sub-menu(s)
    let isMenuClicked = false;
    if (this._menuElm?.contains(e.target)) {
      isMenuClicked = true;
    }
    if (!isMenuClicked) {
      document
        .querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`)
        .forEach(subElm => {
          if (subElm.contains(e.target)) {
            isMenuClicked = true;
          }
        });
    }

    if ((this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this._isMenuOpen) || e.target.className === 'close') {
      this.hideMenu(e);
    }
  }

  protected handleMenuItemClick(item: GridMenuItem | MenuCommandItem | 'divider', level = 0, e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>) {
    if (item !== 'divider' && !item.disabled && !item.divider) {
      const command = item.command || '';

      if (Utils.isDefined(command) && !item.commandItems && !(item as GridMenuItem).customItems) {
        const callbackArgs: GridMenuCommandItemCallbackArgs = {
          grid: this.grid,
          command,
          item,
          allColumns: this.columns,
          visibleColumns: this.getVisibleColumns()
        };
        this.onCommand.notify(callbackArgs, e, this);

        // execute action callback when defined
        if (typeof item.action === 'function') {
          (item as MenuCommandItem).action!.call(this, e, callbackArgs);
        }

        // does the user want to leave open the Grid Menu after executing a command?
        const leaveOpen = !!(this._gridMenuOptions?.leaveOpen);
        if (!leaveOpen && !e.defaultPrevented) {
          this.hideMenu(e);
        }

        // Stop propagation so that it doesn't register as a header click event.
        e.preventDefault();
        e.stopPropagation();
      } else if (item.commandItems || (item as GridMenuItem).customItems) {
        this.repositionSubMenu(item, level, e);
      } else {
        this.destroySubMenus();
      }
    }
  }

  hideMenu(e: DOMMouseOrTouchEvent<HTMLElement>) {
    if (this._menuElm) {
      const callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      if (this._isMenuOpen && this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() === false) {
        return;
      }
      this._isMenuOpen = false;
      Utils.hide(this._menuElm);
    }
    this.destroySubMenus();
  }

  /** Update the Titles of each sections (command, commandTitle, ...) */
  updateAllTitles(gridMenuOptions: GridMenuOption) {
    if (this._commandTitleElm) {
      this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.commandTitle || gridMenuOptions.customTitle || ''));
    }
    if (this._columnTitleElm) {
      this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.columnTitle || ''));
    }
  }

  protected addSubMenuTitleWhenExists(item: GridMenuItem | MenuCommandItem | 'divider', commandOrOptionMenu: HTMLDivElement) {
    if (item !== 'divider' && item?.subMenuTitle) {
      const subMenuTitleElm = document.createElement('div');
      subMenuTitleElm.className = 'slick-menu-title';
      subMenuTitleElm.textContent = item.subMenuTitle as string;
      const subMenuTitleClass = item.subMenuTitleCssClass as string;
      if (subMenuTitleClass) {
        subMenuTitleElm.classList.add(...Utils.classNameToList(subMenuTitleClass));
      }

      commandOrOptionMenu.appendChild(subMenuTitleElm);
    }
  }

  protected repositionSubMenu(item: GridMenuItem | MenuCommandItem | 'divider', level: number, e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>) {
    // when we're clicking a grid cell OR our last menu type (command/option) differs then we know that we need to start fresh and close any sub-menus that might still be open
    if (e.target.classList.contains('slick-cell')) {
      this.destroySubMenus();
    }

    // creating sub-menu, we'll also pass level & the item object since we might have "subMenuTitle" to show
    const subMenuElm = this.createMenu(level + 1, item);
    subMenuElm.style.display = 'block';
    document.body.appendChild(subMenuElm);
    this.repositionMenu(e, subMenuElm);
  }

  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>, menuElm: HTMLElement, buttonElm?: HTMLButtonElement) {
    const targetEvent = e.touches ? e.touches[0] : e;
    const isSubMenu = menuElm.classList.contains('slick-submenu');
    const parentElm = isSubMenu
      ? e.target.closest('.slick-gridmenu-item') as HTMLDivElement
      : targetEvent.target as HTMLElement;

    const menuIconOffset = Utils.offset(buttonElm || this._buttonElm); // get button offset position
    const menuWidth = menuElm.offsetWidth;
    const useClickToRepositionMenu = (this._gridMenuOptions?.useClickToRepositionMenu !== undefined) ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu;
    const contentMinWidth = (this._gridMenuOptions?.contentMinWidth) ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth as number;
    const currentMenuWidth = (contentMinWidth > menuWidth) ? contentMinWidth : menuWidth + 5;
    let menuOffsetTop = (useClickToRepositionMenu && targetEvent.pageY > 0) ? targetEvent.pageY : menuIconOffset!.top + 10;
    let menuOffsetLeft = (useClickToRepositionMenu && targetEvent.pageX > 0) ? targetEvent.pageX : menuIconOffset!.left + 10;

    if (isSubMenu && parentElm) {
      const parentOffset = Utils.offset(parentElm);
      menuOffsetLeft = parentOffset?.left ?? 0;
      menuOffsetTop = parentOffset?.top ?? 0;
      const gridPos = this.grid.getGridPosition();
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
      menuOffsetTop += 10;
      menuOffsetLeft = menuOffsetLeft - currentMenuWidth + 10;
    }

    menuElm.style.top = `${menuOffsetTop}px`;
    menuElm.style.left = `${menuOffsetLeft}px`;

    if (contentMinWidth > 0) {
      this._menuElm.style.minWidth = `${contentMinWidth}px`;
    }
  }

  protected updateColumnOrder() {
    // Because columns can be reordered, we have to update the `columns`
    // to reflect the new order, however we can't just take `grid.getColumns()`,
    // as it does not include columns currently hidden by the picker.
    // We create a new `columns` structure by leaving currently-hidden
    // columns in their original ordinal position and interleaving the results
    // of the current column sort.
    const current = this.grid.getColumns().slice(0);
    const ordered = new Array(this.columns.length);
    for (let i = 0; i < ordered.length; i++) {
      if (this.grid.getColumnIndex(this.columns[i].id) === undefined) {
        // If the column doesn't return a value from getColumnIndex,
        // it is hidden. Leave it in this position.
        ordered[i] = this.columns[i];
      } else {
        // Otherwise, grab the next visible column.
        ordered[i] = current.shift();
      }
    }
    this.columns = ordered;
  }

  protected updateColumn(e: DOMMouseOrTouchEvent<HTMLInputElement>) {
    if (e.target.dataset.option === 'autoresize') {
      // when calling setOptions, it will resize with ALL Columns (even the hidden ones)
      // we can avoid this problem by keeping a reference to the visibleColumns before setOptions and then setColumns after
      const previousVisibleColumns = this.getVisibleColumns();
      const isChecked = e.target.checked;
      this.grid.setOptions({ forceFitColumns: isChecked });
      this.grid.setColumns(previousVisibleColumns);
      return;
    }

    if (e.target.dataset.option === 'syncresize') {
      this.grid.setOptions({ syncColumnCellResize: !!(e.target.checked) });
      return;
    }

    if (e.target.type === 'checkbox') {
      const isChecked = e.target.checked;
      const columnId = e.target.dataset.columnid || '';
      const visibleColumns: Column[] = [];
      this._columnCheckboxes.forEach((columnCheckbox, idx) => {
        if (columnCheckbox.checked) {
          if (this.columns[idx].hidden) { this.columns[idx].hidden = false; }
          visibleColumns.push(this.columns[idx]);
        }
      });

      if (!visibleColumns.length) {
        e.target.checked = true;
        return;
      }

      const callbackArgs = {
        columnId,
        showing: isChecked,
        grid: this.grid,
        allColumns: this.columns,
        columns: visibleColumns,
        visibleColumns: this.getVisibleColumns()
      };
      this.grid.setColumns(visibleColumns);
      this.onColumnsChanged.notify(callbackArgs, e, this);
    }
  }

  getAllColumns() {
    return this.columns;
  }

  /** visible columns, we can simply get them directly from the grid */
  getVisibleColumns() {
    return this.grid.getColumns();
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
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.GridMenu = SlickGridMenu;
}
