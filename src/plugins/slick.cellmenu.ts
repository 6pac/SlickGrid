import {
  BindingEventService as BindingEventService_,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core';
import type {
  CellMenuOption,
  DOMMouseOrTouchEvent,
  GridOption,
  MenuCommandItem,
  MenuCommandItemCallbackArgs,
  MenuFromCellCallbackArgs,
  MenuOptionItem,
  MenuOptionItemCallbackArgs,
  Plugin
} from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventData = IIFE_ONLY ? Slick.EventData : SlickEventData_;
const EventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * A plugin to add Menu on a Cell click (click on the cell that has the cellMenu object defined)
 * The "cellMenu" is defined in a Column Definition object
 * Similar to the ContextMenu plugin (could be used in combo),
 * except that it subscribes to the cell "onClick" event (regular mouse click or touch).
 *
 * A general use of this plugin is for an Action Dropdown Menu to do certain things on the row that was clicked
 * You can use it to change the cell data property through a list of Options AND/OR through a list of Commands.
 *
 * USAGE:
 *
 * Add the slick.cellMenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * var cellMenuPlugin = new Slick.Plugins.CellMenu(columns, grid, options);
 *
 * Available cellMenu options, by defining a cellMenu object:
 *
 *  var columns = [
 *    {
 *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
 *      cellMenu: {
 *        optionTitle: "Change Effort Driven",
 *        optionItems: [
 *          { option: true, title: "True", iconCssClass: 'checkmark' },
 *          { option: false, title: "False" }
 *        ],
 *        commandTitle: "Commands",
 *        commandItems: [
 *          { command: "delete-row", title: "Delete Row", iconCssClass: "sgi sgi-close", cssClass: 'bold', textCssClass: "red" },
 *          { divider: true },
 *          "divider" // you can pass "divider" as a string or an object
 *          { command: "help", title: "Help", iconCssClass: "icon-help" },
 *          { command: "help", title: "Disabled Command", disabled: true },
 *        ],
 *      }
 *    }
 *  ];
 *
 *
 * Available cellMenu properties:
 *    commandTitle:               Title of the Command section (optional)
 *    commandItems:               Array of Command item objects (command/title pair)
 *    optionTitle:                Title of the Option section (optional)
 *    optionItems:                Array of Options item objects (option/title pair)
 *    hideCloseButton:            Hide the Close button on top right (defaults to false)
 *    hideCommandSection:         Hide the Commands section even when the commandItems array is filled (defaults to false)
 *    hideMenuOnScroll:           Do we want to hide the Cell Menu when a scrolling event occurs (defaults to true)?
 *    hideOptionSection:          Hide the Options section even when the optionItems array is filled (defaults to false)
 *    maxHeight:                  Maximum height that the drop menu will have, can be a number (250) or text ("none")
 *    width:                      Width that the drop menu will have, can be a number (250) or text (defaults to "auto")
 *    autoAdjustDrop:             Auto-align dropup or dropdown menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAdjustDropOffset:       Optionally add an offset to the auto-align of the drop menu (defaults to 0)
 *    autoAlignSide:              Auto-align drop menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAlignSideOffset:        Optionally add an offset to the left/right side auto-align (defaults to 0)
 *    menuUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *
 *
 * Available menu Command/Option item properties:
 *    action:                     Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    command:                    A command identifier to be passed to the onCommand event handlers (when using "commandItems").
 *    option:                     An option to be passed to the onOptionSelected event handlers (when using "optionItems").
 *    title:                      Menu item text label.
 *    divider:                    Boolean which tells if the current item is a divider, not an actual command. You could also pass "divider" instead of an object
 *    disabled:                   Whether the item/command is disabled.
 *    hidden:                     Whether the item/command is hidden.
 *    tooltip:                    Item tooltip.
 *    cssClass:                   A CSS class to be added to the menu item container.
 *    iconCssClass:               A CSS class to be added to the menu item icon.
 *    textCssClass:               A CSS class to be added to the menu item text.
 *    iconImage:                  A url to the icon image.
 *    itemVisibilityOverride:     Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 *
 * The plugin exposes the following events:
 *
 *    onAfterMenuShow: Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *
 *    onBeforeMenuShow: Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *
 *    onBeforeMenuClose: Fired when the menu is closing.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            menu:         Menu DOM element
 *
 *    onCommand: Fired on menu option clicked from the Command items list
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            command:      Menu command identified.
 *            item:         Menu item selected
 *            column:    Cell Column definition
 *            dataContext:  Cell Data Context (data object)
 *
 *    onOptionSelected: Fired on menu option clicked from the Option items list
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            option:       Menu option selected.
 *            item:         Menu item selected
 *            column:    Cell Column definition
 *            dataContext:  Cell Data Context (data object)
 *
 *
 * @param options {Object} Cell Menu Options
 * @class Slick.Plugins.CellMenu
 */
export class SlickCellMenu implements Plugin {
  // --
  // public API
  pluginName = 'CellMenu' as const;
  onAfterMenuShow = new SlickEvent<MenuFromCellCallbackArgs>();
  onBeforeMenuShow = new SlickEvent<MenuFromCellCallbackArgs>();
  onBeforeMenuClose = new SlickEvent<MenuFromCellCallbackArgs>();
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>();
  onOptionSelected = new SlickEvent<MenuOptionItemCallbackArgs>();

  // --
  // protected props
  protected _cellMenuProperties: CellMenuOption;
  protected _currentCell = -1;
  protected _currentRow = -1;
  protected _grid!: SlickGrid;
  protected _gridOptions!: GridOption;
  protected _gridUid = '';
  protected _handler = new EventHandler();
  protected _commandTitleElm?: HTMLSpanElement;
  protected _optionTitleElm?: HTMLSpanElement;
  protected _menuElm?: HTMLDivElement | null;
  protected _bindingEventService = new BindingEventService();
  protected _defaults: CellMenuOption = {
    autoAdjustDrop: true,     // dropup/dropdown
    autoAlignSide: true,      // left/right
    autoAdjustDropOffset: 0,
    autoAlignSideOffset: 0,
    hideMenuOnScroll: true,
    maxHeight: 'none',
    width: 'auto',
  };

  constructor(optionProperties: Partial<CellMenuOption>) {
    this._cellMenuProperties = Utils.extend({}, this._defaults, optionProperties);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._gridOptions = grid.getOptions();
    this._gridUid = grid?.getUID() || '';
    this._handler.subscribe(this._grid.onClick, this.handleCellClick.bind(this));
    if (this._cellMenuProperties.hideMenuOnScroll) {
      this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
    }
  }

  setOptions(newOptions: Partial<CellMenuOption>) {
    this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, newOptions);
  }

  destroy() {
    this.onAfterMenuShow.unsubscribe();
    this.onBeforeMenuShow.unsubscribe();
    this.onBeforeMenuClose.unsubscribe();
    this.onCommand.unsubscribe();
    this.onOptionSelected.unsubscribe();
    this._handler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this._menuElm?.remove();
    this._commandTitleElm = null as any;
    this._optionTitleElm = null as any;
    this._menuElm = null as any;
  }

  protected createMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    const cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0;
    this._currentRow = cell?.row ?? 0;
    const columnDef = this._grid.getColumns()[this._currentCell];
    const dataContext = this._grid.getDataItem(this._currentRow);

    const commandItems = this._cellMenuProperties.commandItems || [];
    const optionItems = this._cellMenuProperties.optionItems || [];

    // make sure there's at least something to show before creating the Cell Menu
    if (!columnDef || !columnDef.cellMenu || (!commandItems.length && !optionItems.length)) {
      return;
    }

    // delete any prior Cell Menu
    this.destroyMenu();

    // Let the user modify the menu or cancel altogether,
    // or provide alternative menu implementation.
    if (this.onBeforeMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() == false) {
      return;
    }

    // create a new cell menu
    const maxHeight = isNaN(this._cellMenuProperties.maxHeight as number) ? this._cellMenuProperties.maxHeight : `${this._cellMenuProperties.maxHeight ?? 0}px`;
    const width = isNaN(this._cellMenuProperties.width as number) ? this._cellMenuProperties.width : `${this._cellMenuProperties.maxWidth ?? 0}px`;

    this._menuElm = document.createElement('div');
    this._menuElm.className = `slick-cell-menu ${this._gridUid}`;
    this._menuElm.role = 'menu';
    if (width) {
      this._menuElm.style.width = width as string;
    }
    if (maxHeight) {
      this._menuElm.style.maxHeight = maxHeight as string;
    }
    this._menuElm.style.top = `${e.pageY + 5}px`;
    this._menuElm.style.left = `${e.pageX}px`;
    this._menuElm.style.display = 'none';

    const closeButtonElm = document.createElement('button');
    closeButtonElm.type = 'button';
    closeButtonElm.className = 'close';
    closeButtonElm.dataset.dismiss = 'slick-cell-menu';
    closeButtonElm.ariaLabel = 'Close';

    const spanCloseElm = document.createElement('span');
    spanCloseElm.className = 'close';
    spanCloseElm.ariaHidden = 'true';
    spanCloseElm.innerHTML = '&times;';
    closeButtonElm.appendChild(spanCloseElm);

    // -- Option List section
    if (!this._cellMenuProperties.hideOptionSection && optionItems.length > 0) {
      const optionMenuElm = document.createElement('div');
      optionMenuElm.className = 'slick-cell-menu-option-list';
      optionMenuElm.role = 'menu';

      if (!this._cellMenuProperties.hideCloseButton) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        this._menuElm.appendChild(closeButtonElm);
      }
      this._menuElm.appendChild(optionMenuElm)

      this.populateOptionItems(
        this._cellMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext: dataContext, grid: this._grid }
      );
    }

    // -- Command List section
    if (!this._cellMenuProperties.hideCommandSection && commandItems.length > 0) {
      const commandMenuElm = document.createElement('div');
      commandMenuElm.className = 'slick-cell-menu-command-list';
      commandMenuElm.role = 'menu';

      if (!this._cellMenuProperties.hideCloseButton && (optionItems.length === 0 || this._cellMenuProperties.hideOptionSection)) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        this._menuElm.appendChild(closeButtonElm);
      }

      this._menuElm.appendChild(commandMenuElm);
      this.populateCommandItems(
        this._cellMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext: dataContext, grid: this._grid }
      );
    }

    this._menuElm.style.display = 'block';
    document.body.appendChild(this._menuElm);

    if (this.onAfterMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() == false) {
      return;
    }

    return this._menuElm;
  }

  protected handleCloseButtonClicked(e: DOMMouseOrTouchEvent<HTMLButtonElement>) {
    if (!e.defaultPrevented) {
      this.destroyMenu(e);
    }
  }

  destroyMenu(e?: Event, args?: { cell: number; row: number; }) {
    this._menuElm = this._menuElm || document.querySelector(`.slick-cell-menu.${this._gridUid}`);

    if (this._menuElm?.remove) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell ?? 0,
        row: args?.row ?? 0,
        grid: this._grid,
      }, e, this).getReturnValue() == false) {
        return;
      }
      this._menuElm.remove();
      this._menuElm = null as any;
    }
  }

  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if (this._menuElm && e.target) {
      const parentElm = e.target.closest('.slick-cell') as HTMLDivElement;
      const parentOffset = (parentElm && Utils.offset(parentElm));
      let menuOffsetLeft = parentElm ? parentOffset?.left ?? 0 : e.pageX;
      let menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : e.pageY;
      const parentCellWidth = parentElm.offsetWidth || 0;
      const menuHeight = this._menuElm?.offsetHeight ?? 0;
      const menuWidth = this._menuElm?.offsetWidth ?? this._cellMenuProperties.width ?? 0;
      const rowHeight = this._gridOptions.rowHeight;
      const dropOffset = +(this._cellMenuProperties.autoAdjustDropOffset || 0);
      const sideOffset = +(this._cellMenuProperties.autoAlignSideOffset || 0);

      // if autoAdjustDrop is enable, we first need to see what position the drop will be located (defaults to bottom)
      // without necessary toggling it's position just yet, we just want to know the future position for calculation
      if (this._cellMenuProperties.autoAdjustDrop) {
        // since we reposition menu below slick cell, we need to take it in consideration and do our calculation from that element
        const spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom;
        const spaceTop = Utils.calculateAvailableSpace(parentElm).top;
        const spaceBottomRemaining = spaceBottom + dropOffset - rowHeight!;
        const spaceTopRemaining = spaceTop - dropOffset + rowHeight!;
        const dropPosition = (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining) ? 'top' : 'bottom';
        if (dropPosition === 'top') {
          this._menuElm.classList.remove('dropdown');
          this._menuElm.classList.add('dropup');
          menuOffsetTop = menuOffsetTop - menuHeight - dropOffset;
        } else {
          this._menuElm.classList.remove('dropup');
          this._menuElm.classList.add('dropdown');
          menuOffsetTop = menuOffsetTop + rowHeight! + dropOffset;
        }
      }

      // when auto-align is set, it will calculate whether it has enough space in the viewport to show the drop menu on the right (default)
      // if there isn't enough space on the right, it will automatically align the drop menu to the left (defaults to the right)
      // to simulate an align left, we actually need to know the width of the drop menu
      if (this._cellMenuProperties.autoAlignSide) {
        const gridPos = this._grid.getGridPosition();
        const dropSide = ((menuOffsetLeft + (+menuWidth)) >= gridPos.width) ? 'left' : 'right';
        if (dropSide === 'left') {
          this._menuElm.classList.remove('dropright');
          this._menuElm.classList.add('dropleft');
          menuOffsetLeft = (menuOffsetLeft - (+menuWidth - parentCellWidth) - sideOffset);
        } else {
          this._menuElm.classList.remove('dropleft');
          this._menuElm.classList.add('dropright');
          menuOffsetLeft = menuOffsetLeft + sideOffset;
        }
      }

      // ready to reposition the menu
      this._menuElm.style.top = `${menuOffsetTop}px`;
      this._menuElm.style.left = `${menuOffsetLeft}px`;
    }
  }

  protected handleCellClick(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs) {
    const e = (evt instanceof SlickEventData) ? evt.getNativeEvent<DOMMouseOrTouchEvent<HTMLDivElement>>() : evt;

    const cell = this._grid.getCellFromEvent(e);
    if (cell) {
      const dataContext = this._grid.getDataItem(cell.row);
      const columnDef = this._grid.getColumns()[cell.cell];

      // prevent event from bubbling but only on column that has a cell menu defined
      if (columnDef?.cellMenu) {
        e.preventDefault();
      }

      // merge the cellMenu of the column definition with the default properties
      this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, columnDef.cellMenu);

      // run the override function (when defined), if the result is false it won't go further
      args = args || {};
      args.column = columnDef;
      args.dataContext = dataContext;
      args.grid = this._grid;
      if (!this.runOverrideFunctionWhenExists<typeof args>(this._cellMenuProperties.menuUsabilityOverride, args)) {
        return;
      }

      // create the DOM element
      this._menuElm = this.createMenu(e);

      // reposition the menu to where the user clicked
      if (this._menuElm) {
        this.repositionMenu(e);
        this._menuElm.setAttribute('aria-expanded', 'true');
        this._menuElm.style.display = 'block';
      }

      // Hide the menu on outside click.
      this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);
    }
  }

  protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if (this._menuElm != e.target && !(this._menuElm?.contains(e.target))) {
      if (!e.defaultPrevented) {
        this.closeMenu(e, { cell: this._currentCell, row: this._currentRow, grid: this._grid });
      }
    }
  }

  closeMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuFromCellCallbackArgs) {
    if (this._menuElm) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell,
        row: args?.row,
        grid: this._grid,
      }, e, this).getReturnValue() == false) {
        return;
      }
      this._menuElm?.remove();
      this._menuElm = null;
    }
  }

  /** Construct the Option Items section. */
  protected populateOptionItems(cellMenu: CellMenuOption, optionMenuElm: HTMLElement, optionItems: Array<MenuOptionItem | 'divider'>, args: any) {
    if (!args || !optionItems || !cellMenu) {
      return;
    }

    // user could pass a title on top of the Options section
    if (cellMenu?.optionTitle) {
      this._optionTitleElm = document.createElement('div');
      this._optionTitleElm.className = 'title';
      this._optionTitleElm.textContent = cellMenu.optionTitle;
      optionMenuElm.appendChild(this._optionTitleElm);
    }

    for (let i = 0, ln = optionItems.length; i < ln; i++) {
      let addClickListener = true;
      const item = optionItems[i];

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists<typeof args>((item as MenuOptionItem).itemVisibilityOverride, args);
      const isItemUsable = this.runOverrideFunctionWhenExists<typeof args>((item as MenuOptionItem).itemUsabilityOverride, args);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemOptionClick" has the correct flag and won't trigger an option clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as MenuOptionItem).disabled = isItemUsable ? false : true;
      }

      const liElm = document.createElement('div');
      liElm.className = 'slick-cell-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuOptionItem).divider || item === 'divider') {
        liElm.classList.add('slick-cell-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuOptionItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-cell-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuOptionItem).hidden) {
        liElm.classList.add('slick-cell-menu-item-hidden');
      }

      if ((item as MenuOptionItem).cssClass) {
        liElm.classList.add(...(item as MenuOptionItem).cssClass!.split(' '));
      }

      if ((item as MenuOptionItem).tooltip) {
        liElm.title = (item as MenuOptionItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-cell-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuOptionItem).iconCssClass) {
        iconElm.classList.add(...(item as MenuOptionItem).iconCssClass!.split(' '));
      }

      if ((item as MenuOptionItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuOptionItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-cell-menu-content';
      textElm.textContent = (item as MenuOptionItem).title || '';

      liElm.appendChild(textElm);

      if ((item as MenuOptionItem).textCssClass) {
        textElm.classList.add(...(item as MenuOptionItem).textCssClass!.split(' '));
      }

      optionMenuElm.appendChild(liElm);

      if (addClickListener) {
        this._bindingEventService.bind(liElm, 'click', this.handleMenuItemOptionClick.bind(this, item) as EventListener);
      }
    }
  }

  /** Construct the Command Items section. */
  protected populateCommandItems(cellMenu: CellMenuOption, commandMenuElm: HTMLElement, commandItems: Array<MenuCommandItem | 'divider'>, args: any) {
    if (!args || !commandItems || !cellMenu) {
      return;
    }

    // user could pass a title on top of the Commands section
    if (cellMenu?.commandTitle) {
      this._commandTitleElm = document.createElement('div');
      this._commandTitleElm.className = 'title';
      this._commandTitleElm.textContent = cellMenu.commandTitle;
      commandMenuElm.appendChild(this._commandTitleElm);
    }

    for (let i = 0, ln = commandItems.length; i < ln; i++) {
      let addClickListener = true;
      const item = commandItems[i];

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists<typeof args>((item as MenuCommandItem).itemVisibilityOverride, args);
      const isItemUsable = this.runOverrideFunctionWhenExists<typeof args>((item as MenuCommandItem).itemUsabilityOverride, args);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as MenuCommandItem).disabled = isItemUsable ? false : true;
      }

      const liElm = document.createElement('div');
      liElm.className = 'slick-cell-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuCommandItem).divider || item === 'divider') {
        liElm.classList.add('slick-cell-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuCommandItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-cell-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuCommandItem).hidden) {
        liElm.classList.add('slick-cell-menu-item-hidden');
      }

      if ((item as MenuCommandItem).cssClass) {
        liElm.classList.add(...(item as MenuCommandItem).cssClass!.split(' '));
      }

      if ((item as MenuCommandItem).tooltip) {
        liElm.title = (item as MenuCommandItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-cell-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuCommandItem).iconCssClass) {
        iconElm.classList.add(...(item as MenuCommandItem).iconCssClass!.split(' '));
      }

      if ((item as MenuCommandItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuCommandItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-cell-menu-content';
      textElm.textContent = (item as MenuCommandItem).title || '';

      liElm.appendChild(textElm);

      if ((item as MenuCommandItem).textCssClass) {
        textElm.classList.add(...(item as MenuCommandItem).textCssClass!.split(' '));
      }

      commandMenuElm.appendChild(liElm);

      if (addClickListener) {
        this._bindingEventService.bind(liElm, 'click', this.handleMenuItemCommandClick.bind(this, item) as EventListener);
      }
    }
  }

  protected handleMenuItemCommandClick(item: MenuCommandItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if (!item || (item as MenuCommandItem).disabled || (item as MenuCommandItem).divider || item === 'divider') {
      return;
    }

    const command = item.command || '';
    const row = this._currentRow;
    const cell = this._currentCell;
    const columnDef = this._grid.getColumns()[cell];
    const dataContext = this._grid.getDataItem(row);

    if (command !== null && command !== '') {
      // user could execute a callback through 2 ways
      // via the onCommand event and/or an action callback
      const callbackArgs = {
        cell,
        row,
        grid: this._grid,
        command,
        item,
        column: columnDef,
        dataContext,
      };
      this.onCommand.notify(callbackArgs, e, this);

      // execute action callback when defined
      if (typeof item.action === 'function') {
        item.action.call(this, e, callbackArgs);
      }

      if (!e.defaultPrevented) {
        this.closeMenu(e, { cell, row, grid: this._grid });
      }
    }
  }

  protected handleMenuItemOptionClick(item: MenuOptionItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if (!item || (item as MenuOptionItem).disabled || (item as MenuOptionItem).divider || item === 'divider') {
      return;
    }
    if (!this._grid.getEditorLock().commitCurrentEdit()) {
      return;
    }

    const option = item.option !== undefined ? item.option : '';
    const row = this._currentRow;
    const cell = this._currentCell;
    const columnDef = this._grid.getColumns()[cell];
    const dataContext = this._grid.getDataItem(row);

    if (option !== undefined) {
      // user could execute a callback through 2 ways
      // via the onOptionSelected event and/or an action callback
      const callbackArgs = {
        cell,
        row,
        grid: this._grid,
        option,
        item,
        column: columnDef,
        dataContext
      };
      this.onOptionSelected.notify(callbackArgs, e, this);

      // execute action callback when defined
      if (typeof item.action === 'function') {
        item.action.call(this, e, callbackArgs);
      }

      if (!e.defaultPrevented) {
        this.closeMenu(e, { cell, row, grid: this._grid });
      }
    }
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
        CellMenu: SlickCellMenu
      }
    }
  });
}
