import type { Column, DOMMouseOrTouchEvent, GridMenuCommandItemCallbackArgs, GridMenuEventWithElementCallbackArgs, GridMenuItem, GridMenuOption, GridOption, onGridMenuColumnsChangedCallbackArgs } from '../models/index';
import { BindingEventService as BindingEventService_, Event as SlickEvent_, Utils as Utils_ } from '../slick.core';
import type { SlickGrid } from '../slick.grid';

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
 *      customTitle: "Custom Menus",                // default to empty string
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
 *      customItems: [
 *        {
 *          // custom menu item options
 *        },
 *        {
 *          // custom menu item options
 *        }
 *      ]
 *    }
 *  };
 *
 *
 * Available menu options:
 *     hideForceFitButton:        Hide the "Force fit columns" button (defaults to false)
 *     hideSyncResizeButton:      Hide the "Synchronous resize" button (defaults to false)
 *     forceFitTitle:             Text of the title "Force fit columns"
 *     contentMinWidth:						minimum width of grid menu content (command, column list), defaults to 0 (auto)
 *     height:                    Height of the Grid Menu content, when provided it will be used instead of the max-height (defaults to undefined)
 *     menuWidth:                 Grid menu button width (defaults to 18)
 *     resizeOnShowHeaderRow:     Do we want to resize on the show header row event
 *     syncResizeTitle:           Text of the title "Synchronous resize"
 *     useClickToRepositionMenu:  Use the Click offset to reposition the Grid Menu (defaults to true), when set to False it will use the icon offset to reposition the grid menu
 *     menuUsabilityOverride:     Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *     marginBottom:              Margin to use at the bottom of the grid menu, only in effect when height is undefined (defaults to 15)
 *
 * Available custom menu item options:
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
  onAfterMenuShow = new SlickEvent<GridMenuEventWithElementCallbackArgs>();
  onBeforeMenuShow = new SlickEvent<GridMenuEventWithElementCallbackArgs>();
  onMenuClose = new SlickEvent<GridMenuEventWithElementCallbackArgs>();
  onCommand = new SlickEvent<GridMenuCommandItemCallbackArgs>();
  onColumnsChanged = new SlickEvent<onGridMenuColumnsChangedCallbackArgs>();

  // --
  // protected props
  protected _bindingEventService: BindingEventService_;
  protected _gridOptions: GridOption;
  protected _gridUid: string;
  protected _isMenuOpen = false;
  protected _gridMenuOptions: GridMenuOption | null = null;
  protected _columnTitleElm!: HTMLElement;
  protected _customTitleElm!: HTMLElement;
  protected _customMenuElm!: HTMLElement;
  protected _headerElm: HTMLDivElement | null = null;
  protected _listElm!: HTMLElement;
  protected _buttonElm!: HTMLElement;
  protected _menuElm!: HTMLElement;
  protected _columnCheckboxes: HTMLInputElement[] = [];
  protected _defaults = {
    showButton: true,
    hideForceFitButton: false,
    hideSyncResizeButton: false,
    forceFitTitle: 'Force fit columns',
    marginBottom: 15,
    menuWidth: 18,
    contentMinWidth: 0,
    resizeOnShowHeaderRow: false,
    syncResizeTitle: 'Synchronous resize',
    useClickToRepositionMenu: true,
    headerColumnValueExtractor: (columnDef: Column) => columnDef.name,
  };

  constructor(protected columns: Column[], protected readonly grid: SlickGrid, gridOptions: GridOption) {
    this._gridUid = grid.getUID();
    this._gridOptions = gridOptions;
    this._gridMenuOptions = Utils.extend({}, gridOptions.gridMenu);
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
    this.createGridMenu();

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
    const enableResizeHeaderRow = (this._gridMenuOptions?.resizeOnShowHeaderRow != undefined) ? this._gridMenuOptions.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow;
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
        this._buttonElm.classList.add(...this._gridMenuOptions.iconCssClass.split(' '));
      } else {
        const iconImageElm = document.createElement('img');
        iconImageElm.src = (this._gridMenuOptions?.iconImage) ? this._gridMenuOptions.iconImage : '../images/drag-handle.png';
        this._buttonElm.appendChild(iconImageElm);
      }

      this._headerElm!.parentElement!.insertBefore(this._buttonElm, this._headerElm!.parentElement!.firstChild);

      // add on click handler for the Grid Menu itself
      this._bindingEventService.bind(this._buttonElm, 'click', this.showGridMenu.bind(this) as EventListener);
    }

    this._menuElm = document.createElement('div');
    this._menuElm.className = `slick-gridmenu ${this._gridUid}`;
    this._menuElm.style.display = 'none';
    document.body.appendChild(this._menuElm);

    const buttonElm = document.createElement('button');
    buttonElm.type = 'button';
    buttonElm.className = 'close';
    buttonElm.dataset.dismiss = 'slick-gridmenu';
    buttonElm.ariaLabel = 'Close';

    const spanCloseElm = document.createElement('span');
    spanCloseElm.className = 'close';
    spanCloseElm.ariaHidden = 'true';
    spanCloseElm.innerHTML = '&times;';
    buttonElm.appendChild(spanCloseElm);
    this._menuElm.appendChild(buttonElm);

    this._customMenuElm = document.createElement('div');
    this._customMenuElm.className = 'slick-gridmenu-custom';
    this._customMenuElm.role = 'menu';

    this._menuElm.appendChild(this._customMenuElm);

    this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm);
    this.populateColumnPicker();

    // Hide the menu on outside click.
    this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);

    // destroy the picker if user leaves the page
    this._bindingEventService.bind(document.body, 'beforeunload', this.destroy.bind(this));
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

  protected populateCustomMenus(gridMenuOptions: GridMenuOption, customMenuElm: HTMLElement) {
    // Construct the custom menu items.
    if (!gridMenuOptions || !gridMenuOptions.customItems) {
      return;
    }

    // user could pass a title on top of the custom section
    if (this._gridMenuOptions?.customTitle) {
      this._customTitleElm = document.createElement('div');
      this._customTitleElm.className = 'title';
      this._customTitleElm.innerHTML = this._gridMenuOptions.customTitle;
      customMenuElm.appendChild(this._customTitleElm);
    }

    for (let i = 0, ln = gridMenuOptions.customItems.length; i < ln; i++) {
      let addClickListener = true;
      const item = gridMenuOptions.customItems[i];
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
      // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
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
        liElm.classList.add(...(item as GridMenuItem).cssClass!.split(' '));
      }

      if ((item as GridMenuItem).tooltip) {
        liElm.title = (item as GridMenuItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-gridmenu-icon';

      liElm.appendChild(iconElm);

      if ((item as GridMenuItem).iconCssClass) {
        iconElm.classList.add(...(item as GridMenuItem).iconCssClass!.split(' '));
      }

      if ((item as GridMenuItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as GridMenuItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-gridmenu-content';
      textElm.innerHTML = (item as GridMenuItem).title || '';

      liElm.appendChild(textElm);

      if ((item as GridMenuItem).textCssClass) {
        textElm.classList.add(...(item as GridMenuItem).textCssClass!.split(' '));
      }

      customMenuElm.appendChild(liElm);

      if (addClickListener) {
        this._bindingEventService.bind(liElm, 'click', this.handleMenuItemClick.bind(this, item) as EventListener);
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
      this._columnTitleElm.innerHTML = this._gridMenuOptions.columnTitle;
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
    Utils.emptyElement(this._customMenuElm);

    this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm);
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
      if (this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() == false) {
        return;
      }
    }

    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id;
      excludeCssClass = this.columns[i].excludeFromGridMenu ? 'hidden' : '';

      const liElm = document.createElement('li');
      liElm.className = excludeCssClass;
      liElm.ariaLabel = this.columns[i]?.name || '';

      const checkboxElm = document.createElement('input');
      checkboxElm.type = 'checkbox';
      checkboxElm.id = `${this._gridUid}-gridmenu-colpicker-${columnId}`;
      checkboxElm.dataset.columnid = String(this.columns[i].id);
      liElm.appendChild(checkboxElm);

      if (this.grid.getColumnIndex(this.columns[i].id) != null && !this.columns[i].hidden) {
        checkboxElm.checked = true;
      }

      this._columnCheckboxes.push(checkboxElm);

      // get the column label from the picker value extractor (user can optionally provide a custom extractor)
      if (this._gridMenuOptions?.headerColumnValueExtractor) {
        columnLabel = this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions);
      } else {
        columnLabel = this._defaults.headerColumnValueExtractor(this.columns[i]);
      }

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-${columnId}`;
      labelElm.innerHTML = columnLabel || '';
      liElm.appendChild(labelElm);
      this._listElm.appendChild(liElm);
    }

    if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton)) {
      this._listElm.appendChild(document.createElement('hr'));
    }

    if (!(this._gridMenuOptions?.hideForceFitButton)) {
      const forceFitTitle = (this._gridMenuOptions?.forceFitTitle) || this._defaults.forceFitTitle;

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
      const syncResizeTitle = (this._gridMenuOptions?.syncResizeTitle) || this._defaults.syncResizeTitle;

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

    const menuIconOffset = Utils.offset(buttonElm); // get button offset position
    const menuWidth = this._menuElm.offsetWidth;
    const useClickToRepositionMenu = (this._gridMenuOptions?.useClickToRepositionMenu !== undefined) ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu;
    const contentMinWidth = (this._gridMenuOptions?.contentMinWidth) ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth;
    const currentMenuWidth = (contentMinWidth > menuWidth) ? contentMinWidth : menuWidth + 5;
    const nextPositionTop = (useClickToRepositionMenu && targetEvent.pageY > 0) ? targetEvent.pageY : menuIconOffset!.top + 10;
    const nextPositionLeft = (useClickToRepositionMenu && targetEvent.pageX > 0) ? targetEvent.pageX : menuIconOffset!.left + 10;
    const menuMarginBottom = (this._gridMenuOptions?.marginBottom !== undefined) ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom;

    this._menuElm.style.top = `${nextPositionTop + 10}px`;
    this._menuElm.style.left = `${nextPositionLeft - currentMenuWidth + 10}px`;

    if (contentMinWidth > 0) {
      this._menuElm.style.minWidth = `${contentMinWidth}px`;
    }

    // set "height" when defined OR ELSE use the "max-height" with available window size and optional margin bottom
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
      if (this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue() == false) {
        return;
      }
    }
  }

  protected handleBodyMouseDown(event: DOMMouseOrTouchEvent<HTMLElement>) {
    if ((this._menuElm !== event.target && !(this._menuElm?.contains(event.target)) && this._isMenuOpen) || event.target.className === 'close') {
      this.hideMenu(event);
    }
  }

  protected handleMenuItemClick(item: any, e: DOMMouseOrTouchEvent<HTMLButtonElement>) {
    const command = item.command || '';

    if (item.disabled || item.divider || item === 'divider') {
      return;
    }

    if (command != null && command != '') {
      const callbackArgs = {
        grid: this.grid,
        command: command,
        item: item,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      this.onCommand.notify(callbackArgs, e, this);

      // execute action callback when defined
      if (typeof item.action === 'function') {
        item.action.call(this, e, callbackArgs);
      }
    }

    // does the user want to leave open the Grid Menu after executing a command?
    const leaveOpen = !!(this._gridMenuOptions?.leaveOpen);
    if (!leaveOpen && !e.defaultPrevented) {
      this.hideMenu(e);
    }

    // Stop propagation so that it doesn't register as a header click event.
    e.preventDefault();
    e.stopPropagation();
  }

  hideMenu(e: DOMMouseOrTouchEvent<HTMLElement>) {
    if (this._menuElm) {
      Utils.hide(this._menuElm);
      this._isMenuOpen = false;

      const callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      if (this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() == false) {
        return;
      }
    }
  }

  /** Update the Titles of each sections (command, customTitle, ...) */
  updateAllTitles(gridMenuOptions: GridMenuOption) {
    if (this._customTitleElm?.innerHTML) {
      this._customTitleElm.innerHTML = gridMenuOptions.customTitle || '';
    }
    if (this._columnTitleElm?.innerHTML) {
      this._columnTitleElm.innerHTML = gridMenuOptions.columnTitle || '';
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

