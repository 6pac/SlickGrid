import {
  BindingEventService as BindingEventService_,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core.js';
import type {
  CellMenuOption,
  Column,
  DOMMouseOrTouchEvent,
  GridOption,
  MenuCommandItem,
  MenuCommandItemCallbackArgs,
  MenuFromCellCallbackArgs,
  MenuOptionItem,
  MenuOptionItemCallbackArgs,
  MenuType,
  SlickPlugin
} from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';

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
 *    subItemChevronClass:        CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon)
 *    subMenuOpenByEvent:         defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click"
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
 *    subMenuTitle:               Optional sub-menu title that will shows up when sub-menu commmands/options list is opened
 *    subMenuTitleCssClass:       Optional sub-menu title CSS class to use with `subMenuTitle`
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
export class SlickCellMenu implements SlickPlugin {
  // --
  // public API
  pluginName = 'CellMenu' as const;
  onAfterMenuShow = new SlickEvent<MenuFromCellCallbackArgs>('onAfterMenuShow');
  onBeforeMenuShow = new SlickEvent<MenuFromCellCallbackArgs>('onBeforeMenuShow');
  onBeforeMenuClose = new SlickEvent<MenuFromCellCallbackArgs>('onBeforeMenuClose');
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>('onCommand');
  onOptionSelected = new SlickEvent<MenuOptionItemCallbackArgs>('onOptionSelected');

  // --
  // protected props
  protected _bindingEventService = new BindingEventService();
  protected _cellMenuProperties: CellMenuOption;
  protected _currentCell = -1;
  protected _currentRow = -1;
  protected _grid!: SlickGrid;
  protected _gridOptions!: GridOption;
  protected _gridUid = '';
  protected _handler = new EventHandler();
  protected _commandTitleElm?: HTMLSpanElement;
  protected _optionTitleElm?: HTMLSpanElement;
  protected _lastMenuTypeClicked = '';
  protected _menuElm?: HTMLDivElement | null;
  protected _subMenuParentId = '';
  protected _defaults: CellMenuOption = {
    autoAdjustDrop: true,     // dropup/dropdown
    autoAlignSide: true,      // left/right
    autoAdjustDropOffset: 0,
    autoAlignSideOffset: 0,
    hideMenuOnScroll: true,
    maxHeight: 'none',
    width: 'auto',
    subMenuOpenByEvent: 'mouseover',
  };

  constructor(optionProperties: Partial<CellMenuOption>) {
    this._cellMenuProperties = Utils.extend({}, this._defaults, optionProperties);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._gridOptions = grid.getOptions();
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this._gridUid = grid?.getUID() || '';
    this._handler.subscribe(this._grid.onClick as any, this.handleCellClick.bind(this));
    if (this._cellMenuProperties.hideMenuOnScroll) {
      this._handler.subscribe(this._grid.onScroll, this.closeMenu.bind(this));
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

  protected createParentMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    const cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0;
    this._currentRow = cell?.row ?? 0;
    const columnDef = this._grid.getColumns()[this._currentCell];

    const commandItems = this._cellMenuProperties.commandItems || [];
    const optionItems = this._cellMenuProperties.optionItems || [];

    // make sure there's at least something to show before creating the Cell Menu
    if (!columnDef || !columnDef.cellMenu || (!commandItems.length && !optionItems.length)) {
      return;
    }

    // delete any prior Cell Menu
    this.closeMenu();

    // Let the user modify the menu or cancel altogether,
    // or provide alternative menu implementation.
    if (this.onBeforeMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() === false) {
      return;
    }

    // create 1st parent menu container & reposition it
    this._menuElm = this.createMenu(commandItems, optionItems);
    this._menuElm.style.top = `${e.pageY + 5}px`;
    this._menuElm.style.left = `${e.pageX}px`;
    this._menuElm.style.display = 'block';
    document.body.appendChild(this._menuElm);

    if (this.onAfterMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() === false) {
      return;
    }

    return this._menuElm;
  }

  /**
   * Create parent menu or sub-menu(s), a parent menu will start at level 0 while sub-menu(s) will be incremented
   * @param commandItems - array of optional commands or dividers
   * @param optionItems - array of optional options or dividers
   * @param level - menu level
   * @param item - command, option or divider
   * @returns menu DOM element
   */
  protected createMenu(commandItems: Array<MenuCommandItem | 'divider'>, optionItems: Array<MenuOptionItem | 'divider'>, level = 0, item?: MenuCommandItem | MenuOptionItem | 'divider') {
    const columnDef = this._grid.getColumns()[this._currentCell];
    const dataContext = this._grid.getDataItem(this._currentRow);

    // create a new cell menu
    const maxHeight = isNaN(this._cellMenuProperties.maxHeight as number) ? this._cellMenuProperties.maxHeight : `${this._cellMenuProperties.maxHeight ?? 0}px`;
    const width = isNaN(this._cellMenuProperties.width as number) ? this._cellMenuProperties.width : `${this._cellMenuProperties.maxWidth ?? 0}px`;

    // to avoid having multiple sub-menu trees opened,
    // we need to somehow keep trace of which parent menu the tree belongs to
    // and we should keep ref of only the first sub-menu parent, we can use the command name (remove any whitespaces though)
    const subMenuCommand = (item as MenuCommandItem)?.command;
    let subMenuId = (level === 1 && subMenuCommand) ? subMenuCommand.replaceAll(' ', '') : '';
    if (subMenuId) {
      this._subMenuParentId = subMenuId;
    }
    if (level > 1) {
      subMenuId = this._subMenuParentId;
    }

    const menuClasses = `slick-cell-menu slick-menu-level-${level} ${this._gridUid}`;
    const bodyMenuElm = document.body.querySelector<HTMLDivElement>(`.slick-cell-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);

    // return menu/sub-menu if it's already opened unless we are on different sub-menu tree if so close them all
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId) {
        return bodyMenuElm;
      }
      this.destroySubMenus();
    }

    const menuElm = document.createElement('div');
    menuElm.className = menuClasses;
    if (level > 0) {
      menuElm.classList.add('slick-submenu');
      if (subMenuId) {
        menuElm.dataset.subMenuParent = subMenuId;
      }
    }
    menuElm.ariaLabel = level > 1 ? 'SubMenu' : 'Cell Menu';
    menuElm.role = 'menu';
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
      closeButtonElm.dataset.dismiss = 'slick-cell-menu';
      closeButtonElm.ariaLabel = 'Close';

      const spanCloseElm = document.createElement('span');
      spanCloseElm.className = 'close';
      spanCloseElm.ariaHidden = 'true';
      spanCloseElm.textContent = '×';
      closeButtonElm.appendChild(spanCloseElm);
    }

    // -- Option List section
    if (!this._cellMenuProperties.hideOptionSection && optionItems.length > 0) {
      const optionMenuElm = document.createElement('div');
      optionMenuElm.className = 'slick-cell-menu-option-list';
      optionMenuElm.role = 'menu';

      // when creating sub-menu add its sub-menu title when exists
      if (item && level > 0) {
        this.addSubMenuTitleWhenExists(item, optionMenuElm); // add sub-menu title when exists
      }

      if (closeButtonElm && !this._cellMenuProperties.hideCloseButton) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        menuElm.appendChild(closeButtonElm);
      }
      menuElm.appendChild(optionMenuElm);

      this.populateCommandOrOptionItems(
        'option',
        this._cellMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }

    // -- Command List section
    if (!this._cellMenuProperties.hideCommandSection && commandItems.length > 0) {
      const commandMenuElm = document.createElement('div');
      commandMenuElm.className = 'slick-cell-menu-command-list';
      commandMenuElm.role = 'menu';

      // when creating sub-menu add its sub-menu title when exists
      if (item && level > 0) {
        this.addSubMenuTitleWhenExists(item, commandMenuElm); // add sub-menu title when exists
      }

      if (closeButtonElm && !this._cellMenuProperties.hideCloseButton && (optionItems.length === 0 || this._cellMenuProperties.hideOptionSection)) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        menuElm.appendChild(closeButtonElm);
      }
      menuElm.appendChild(commandMenuElm);

      this.populateCommandOrOptionItems(
        'command',
        this._cellMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }

    // increment level for possible next sub-menus if exists
    level++;

    return menuElm;
  }

  protected addSubMenuTitleWhenExists(item: MenuCommandItem | MenuOptionItem | 'divider', commandOrOptionMenu: HTMLDivElement) {
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

  protected handleCloseButtonClicked(e: DOMMouseOrTouchEvent<HTMLButtonElement>) {
    if (!e.defaultPrevented) {
      this.closeMenu(e);
    }
  }

  /** Close and destroy Cell Menu */
  closeMenu(e?: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement> | SlickEventData_, args?: MenuFromCellCallbackArgs) {
    if (this._menuElm) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell ?? 0,
        row: args?.row ?? 0,
        grid: this._grid,
      }, e, this).getReturnValue() === false) {
        return;
      }
      this._menuElm.remove();
      this._menuElm = null;
    }
    this.destroySubMenus();
  }

  /** Destroy all parent menus and any sub-menus */
  destroyAllMenus() {
    this.destroySubMenus();

    // remove all parent menu listeners before removing them from the DOM
    this._bindingEventService.unbindAll('parent-menu');
    document.querySelectorAll(`.slick-cell-menu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll('sub-menu');
    document.querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  protected repositionSubMenu(item: MenuCommandItem | MenuOptionItem | 'divider', type: MenuType, level: number, e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    // when we're clicking a grid cell OR our last menu type (command/option) differs then we know that we need to start fresh and close any sub-menus that might still be open
    if (e.target.classList.contains('slick-cell') || this._lastMenuTypeClicked !== type) {
      this.destroySubMenus();
    }

    // creating sub-menu, we'll also pass level & the item object since we might have "subMenuTitle" to show
    const subMenuElm = this.createMenu((item as MenuCommandItem)?.commandItems || [], (item as MenuOptionItem)?.optionItems || [], level + 1, item);
    subMenuElm.style.display = 'block';
    document.body.appendChild(subMenuElm);
    this.repositionMenu(e, subMenuElm);
  }

  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, menuElm: HTMLElement) {
    const isSubMenu = menuElm.classList.contains('slick-submenu');
    const parentElm = isSubMenu
      ? e.target.closest('.slick-cell-menu-item') as HTMLDivElement
      : e.target.closest('.slick-cell') as HTMLDivElement;

    if (menuElm && parentElm) {
      const parentOffset = Utils.offset(parentElm);
      let menuOffsetLeft = parentElm ? parentOffset?.left ?? 0 : e?.pageX ?? 0;
      let menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : e?.pageY ?? 0;
      const parentCellWidth = parentElm?.offsetWidth || 0;
      const menuHeight = menuElm?.offsetHeight ?? 0;
      const menuWidth = Number(menuElm?.offsetWidth ?? this._cellMenuProperties.width ?? 0);
      const rowHeight = this._gridOptions.rowHeight;
      const dropOffset = Number(this._cellMenuProperties.autoAdjustDropOffset || 0);
      const sideOffset = Number(this._cellMenuProperties.autoAlignSideOffset || 0);

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
          menuElm.classList.remove('dropdown');
          menuElm.classList.add('dropup');
          if (isSubMenu) {
            menuOffsetTop -= (menuHeight - dropOffset - parentElm.clientHeight);
          } else {
            menuOffsetTop -= menuHeight - dropOffset;
          }
        } else {
          menuElm.classList.remove('dropup');
          menuElm.classList.add('dropdown');
          if (isSubMenu) {
            menuOffsetTop += dropOffset;
          } else {
            menuOffsetTop += rowHeight! + dropOffset;
          }
        }
      }

      // when auto-align is set, it will calculate whether it has enough space in the viewport to show the drop menu on the right (default)
      // if there isn't enough space on the right, it will automatically align the drop menu to the left (defaults to the right)
      // to simulate an align left, we actually need to know the width of the drop menu
      if (this._cellMenuProperties.autoAlignSide) {
        const gridPos = this._grid.getGridPosition();
        let subMenuPosCalc = menuOffsetLeft + Number(menuWidth); // calculate coordinate at caller element far right
        if (isSubMenu) {
          subMenuPosCalc += parentElm.clientWidth;
        }
        const browserWidth = document.documentElement.clientWidth;
        const dropSide = (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth) ? 'left' : 'right';
        if (dropSide === 'left') {
          menuElm.classList.remove('dropright');
          menuElm.classList.add('dropleft');
          if (isSubMenu) {
            menuOffsetLeft -= menuWidth - sideOffset;
          } else {
            menuOffsetLeft -= menuWidth - parentCellWidth - sideOffset;
          }
        } else {
          menuElm.classList.remove('dropleft');
          menuElm.classList.add('dropright');
          if (isSubMenu) {
            menuOffsetLeft += sideOffset + parentElm.offsetWidth;
          } else {
            menuOffsetLeft += sideOffset;
          }
        }
      }

      // ready to reposition the menu
      menuElm.style.top = `${menuOffsetTop}px`;
      menuElm.style.left = `${menuOffsetLeft}px`;
    }
  }

  protected getGridUidSelector() {
    const gridUid = this._grid.getUID() || '';
    return gridUid ? `.${gridUid}` : '';
  }

  protected handleCellClick(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs) {
    this.destroyAllMenus(); // make there's only 1 parent menu opened at a time
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
      this._menuElm = this.createParentMenu(e);

      // reposition the menu to where the user clicked
      if (this._menuElm) {
        this.repositionMenu(e, this._menuElm);
        this._menuElm.setAttribute('aria-expanded', 'true');
        this._menuElm.style.display = 'block';
      }

      // Hide the menu on outside click.
      this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);
    }
  }

  /** When users click outside the Cell Menu, we will typically close the Cell Menu (and any sub-menus) */
  protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    // did we click inside the menu or any of its sub-menu(s)
    let isMenuClicked = false;
    if (this._menuElm?.contains(e.target)) {
      isMenuClicked = true;
    }
    if (!isMenuClicked) {
      document
        .querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`)
        .forEach(subElm => {
          if (subElm.contains(e.target)) {
            isMenuClicked = true;
          }
        });
    }

    if (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented) {
      this.closeMenu(e, { cell: this._currentCell, row: this._currentRow, grid: this._grid });
    }
  }

  /** Build the Command Items section. */
  protected populateCommandOrOptionItems(
    itemType: MenuType,
    cellMenu: CellMenuOption,
    commandOrOptionMenuElm: HTMLElement,
    commandOrOptionItems: Array<MenuCommandItem | 'divider'> | Array<MenuOptionItem | 'divider'>,
    args: { cell: number, row: number, column: Column, dataContext: any, grid: SlickGrid, level: number }
  ) {
    if (!args || !commandOrOptionItems || !cellMenu) {
      return;
    }

    // user could pass a title on top of the Commands/Options section
    const level = args?.level || 0;
    const isSubMenu = level > 0;
    if (cellMenu?.[`${itemType}Title`] && !isSubMenu) {
      this[`_${itemType}TitleElm`] = document.createElement('div');
      this[`_${itemType}TitleElm`]!.className = 'slick-menu-title';
      this[`_${itemType}TitleElm`]!.textContent = cellMenu[`${itemType}Title`] as string;
      commandOrOptionMenuElm.appendChild(this[`_${itemType}TitleElm`]!);
    }

    for (let i = 0, ln = commandOrOptionItems.length; i < ln; i++) {
      let addClickListener = true;
      const item = commandOrOptionItems[i];

      // run each override functions to know if the item is visible and usable
      const isItemVisible = this.runOverrideFunctionWhenExists<typeof args>((item as MenuCommandItem | MenuOptionItem).itemVisibilityOverride, args);
      const isItemUsable = this.runOverrideFunctionWhenExists<typeof args>((item as MenuCommandItem | MenuOptionItem).itemUsabilityOverride, args);

      // if the result is not visible then there's no need to go further
      if (!isItemVisible) {
        continue;
      }

      // when the override is defined, we need to use its result to update the disabled property
      // so that "handleMenuItemClick" has the correct flag and won't trigger a command/option clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as MenuCommandItem | MenuOptionItem).disabled = isItemUsable ? false : true;
      }

      const liElm = document.createElement('div');
      liElm.className = 'slick-cell-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuCommandItem | MenuOptionItem).divider || item === 'divider') {
        liElm.classList.add('slick-cell-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuCommandItem | MenuOptionItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-cell-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuCommandItem | MenuOptionItem).hidden) {
        liElm.classList.add('slick-cell-menu-item-hidden');
      }

      if ((item as MenuCommandItem | MenuOptionItem).cssClass) {
        liElm.classList.add(...Utils.classNameToList((item as MenuCommandItem | MenuOptionItem).cssClass));
      }

      if ((item as MenuCommandItem | MenuOptionItem).tooltip) {
        liElm.title = (item as MenuCommandItem | MenuOptionItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-cell-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuCommandItem | MenuOptionItem).iconCssClass) {
        iconElm.classList.add(...Utils.classNameToList((item as MenuCommandItem | MenuOptionItem).iconCssClass));
      }

      if ((item as MenuCommandItem | MenuOptionItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuCommandItem | MenuOptionItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-cell-menu-content';
      textElm.textContent = (item as MenuCommandItem | MenuOptionItem).title || '';

      liElm.appendChild(textElm);

      if ((item as MenuCommandItem | MenuOptionItem).textCssClass) {
        textElm.classList.add(...Utils.classNameToList((item as MenuCommandItem | MenuOptionItem).textCssClass));
      }

      commandOrOptionMenuElm.appendChild(liElm);

      if (addClickListener) {
        const eventGroup = isSubMenu ? 'sub-menu' : 'parent-menu';
        this._bindingEventService.bind(liElm, 'click', this.handleMenuItemClick.bind(this, item, itemType, level) as EventListener, undefined, eventGroup);
      }

      // optionally open sub-menu(s) by mouseover
      if (this._cellMenuProperties.subMenuOpenByEvent === 'mouseover') {
        this._bindingEventService.bind(liElm, 'mouseover', ((e: DOMMouseOrTouchEvent<HTMLDivElement>) => {
          if ((item as MenuCommandItem).commandItems || (item as MenuOptionItem).optionItems) {
            this.repositionSubMenu(item, itemType, level, e);
            this._lastMenuTypeClicked = itemType;
          } else if (!isSubMenu) {
            this.destroySubMenus();
          }
        }) as EventListener);
      }

      // the option/command item could be a sub-menu if it has another list of commands/options
      if ((item as MenuCommandItem).commandItems || (item as MenuOptionItem).optionItems) {
        const chevronElm = document.createElement('span');
        chevronElm.className = 'sub-item-chevron';
        if (this._cellMenuProperties.subItemChevronClass) {
          chevronElm.classList.add(...Utils.classNameToList(this._cellMenuProperties.subItemChevronClass));
        } else {
          chevronElm.textContent = '⮞'; // ⮞ or ▸
        }

        liElm.classList.add('slick-submenu-item');
        liElm.appendChild(chevronElm);
        continue;
      }
    }
  }

  protected handleMenuItemClick(item: MenuCommandItem | MenuOptionItem | 'divider', type: MenuType, level = 0, e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if ((item as never)?.[type] !== undefined && item !== 'divider' && !item.disabled && !(item as MenuCommandItem | MenuOptionItem).divider && this._currentCell !== undefined && this._currentRow !== undefined) {
      if (type === 'option' && !this._grid.getEditorLock().commitCurrentEdit()) {
        return;
      }
      const optionOrCommand = (item as any)[type] !== undefined ? (item as any)[type] : '';
      const row = this._currentRow;
      const cell = this._currentCell;
      const columnDef = this._grid.getColumns()[cell];
      const dataContext = this._grid.getDataItem(row);

      if (optionOrCommand !== undefined && !(item as any)[`${type}Items`]) {
        // user could execute a callback through 2 ways
        // via the onCommand/onOptionSelected event and/or an action callback
        const callbackArgs = {
          cell,
          row,
          grid: this._grid,
          [type]: optionOrCommand,
          item,
          column: columnDef,
          dataContext,
        };
        const eventType = type === 'command' ? 'onCommand' : 'onOptionSelected';
        this[eventType].notify(callbackArgs as any, e, this);

        // execute action callback when defined
        if (typeof item.action === 'function') {
          (item as any).action.call(this, e, callbackArgs);
        }

        // unless prevented, close the menu
        if (!e.defaultPrevented) {
          this.closeMenu(e, { cell, row, grid: this._grid });
        }
      } else if ((item as MenuCommandItem).commandItems || (item as MenuOptionItem).optionItems) {
        this.repositionSubMenu(item, type, level, e);
      } else {
        this.destroySubMenus();
      }
      this._lastMenuTypeClicked = type;
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
