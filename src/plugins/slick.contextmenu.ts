import {
  BindingEventService as BindingEventService_,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core.js';
import type {
  Column,
  ContextMenuOption,
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
 * A plugin to add Context Menu (mouse right+click), it subscribes to the cell "onContextMenu" event.
 * The "contextMenu" is defined in the Grid Options object
 * You can use it to change a data property (only 1) through a list of Options AND/OR through a list of Commands.
 * A good example of a Command would be an Export to CSV, that can be run from anywhere in the grid by doing a mouse right+click
 *
 * Note:
 *   There is only 1 list of Options, so typically that would be use for 1 column
 *   if you plan to use different Options for different columns, then the CellMenu plugin might be better suited.
 *
 * USAGE:
 *
 * Add the slick.contextmenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * var contextMenuPlugin = new Slick.Plugins.ContextMenu(columns, grid, options);
 *
 * Available grid options, by defining a contextMenu object:
 *
 *  var options = {
 *    enableCellNavigation: true,
 *    contextMenu: {
 *      optionTitle: 'Change Priority',
 *      optionShownOverColumnIds: ["priority"],
 *      optionItems: [
 *        { option: 0, title: 'none', cssClass: 'italic' },
 *        { divider: true },
 *        "divider" // just the string is also accepted
 *        { option: 1, iconCssClass: 'fa fa-fire grey', title: 'Low' },
 *        { option: 3, iconCssClass: 'fa fa-fire red', title: 'High' },
 *        { option: 2, iconCssClass: 'fa fa-fire orange', title: 'Medium' },
 *        { option: 4, iconCssClass: 'fa fa-fire', title: 'Extreme', disabled: true },
 *      ],
 *      commandTitle: 'Commands',
 *      commandShownOverColumnIds: ["title", "complete", "start", "finish", "effortDriven"],
 *      commandItems: [
 *        { command: 'export-excel', title: 'Export to CSV', iconCssClass: 'fa fa-file-excel-o', cssClass: '' },
 *        { command: 'delete-row', title: 'Delete Row', cssClass: 'bold', textCssClass: 'red' },
 *        { command: 'help', title: 'Help', iconCssClass: 'fa fa-question-circle',},
 *        { divider: true },
 *      ],
 *    }
 *  };
 *
 *
 * Available contextMenu properties:
 *    commandTitle:               Title of the Command section (optional)
 *    commandItems:               Array of Command item objects (command/title pair)
 *    commandShownOverColumnIds:  Define which column to show the Commands list. If not defined (defaults), the menu will be shown over all columns
 *    optionTitle:                Title of the Option section (optional)
 *    optionItems:                Array of Options item objects (option/title pair)
 *    optionShownOverColumnIds:   Define which column to show the Options list. If not defined (defaults), the menu will be shown over all columns
 *    hideCloseButton:            Hide the Close button on top right (defaults to false)
 *    hideCommandSection:         Hide the Commands section even when the commandItems array is filled (defaults to false)
 *    hideMenuOnScroll:           Do we want to hide the Cell Menu when a scrolling event occurs (defaults to false)?
 *    hideOptionSection:          Hide the Options section even when the optionItems array is filled (defaults to false)
 *    maxHeight:                  Maximum height that the drop menu will have, can be a number (250) or text ("none")
 *    width:                      Width that the drop menu will have, can be a number (250) or text (defaults to "auto")
 *    autoAdjustDrop:             Auto-align dropup or dropdown menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAdjustDropOffset:       Optionally add an offset to the auto-align of the drop menu (defaults to -4)
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
 *    title:                      Menu item text.
 *    divider:                    Boolean which tell if the current item is a divider, not an actual command. You could also pass "divider" instead of an object
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
 *            value:        Value of the cell we triggered the context menu from
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
 * @param options {Object} Context Menu Options
 * @class Slick.Plugins.ContextMenu
 */
export class SlickContextMenu implements SlickPlugin {
  // --
  // public API
  pluginName = 'ContextMenu' as const;
  onAfterMenuShow = new SlickEvent<MenuFromCellCallbackArgs>('onAfterMenuShow');
  onBeforeMenuShow = new SlickEvent<MenuFromCellCallbackArgs>('onBeforeMenuShow');
  onBeforeMenuClose = new SlickEvent<MenuFromCellCallbackArgs>('onBeforeMenuClose');
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>('onCommand');
  onOptionSelected = new SlickEvent<MenuOptionItemCallbackArgs>('onOptionSelected');

  // --
  // protected props
  protected _bindingEventService = new BindingEventService();
  protected _contextMenuProperties: ContextMenuOption;
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
  protected _defaults: ContextMenuOption = {
    autoAdjustDrop: true,     // dropup/dropdown
    autoAlignSide: true,      // left/right
    autoAdjustDropOffset: -4,
    autoAlignSideOffset: 0,
    hideMenuOnScroll: false,
    maxHeight: 'none',
    width: 'auto',
    optionShownOverColumnIds: [],
    commandShownOverColumnIds: [],
    subMenuOpenByEvent: 'mouseover',
  };

  constructor(optionProperties: Partial<ContextMenuOption>) {
    this._contextMenuProperties = Utils.extend({}, this._defaults, optionProperties);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._gridOptions = grid.getOptions();
    this._gridUid = grid.getUID() || '';
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this._handler.subscribe(this._grid.onContextMenu, this.handleOnContextMenu.bind(this));
    if (this._contextMenuProperties.hideMenuOnScroll) {
      this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
    }
  }

  setOptions(newOptions: Partial<ContextMenuOption>) {
    this._contextMenuProperties = Utils.extend({}, this._contextMenuProperties, newOptions);

    // on the array properties, we want to make sure to overwrite them and not just extending them
    if (newOptions.commandShownOverColumnIds) {
      this._contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds;
    }
    if (newOptions.optionShownOverColumnIds) {
      this._contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds;
    }
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

  protected createParentMenu(evt: SlickEventData_ | MouseEvent) {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent<MouseEvent | TouchEvent>() : evt;
    const targetEvent = (e as TouchEvent).touches?.[0] ?? e;
    const cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0;
    this._currentRow = cell?.row ?? 0;
    const columnDef = this._grid.getColumns()[this._currentCell];

    const isColumnOptionAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.optionShownOverColumnIds ?? [], columnDef.id);
    const isColumnCommandAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.commandShownOverColumnIds ?? [], columnDef.id);
    const commandItems = this._contextMenuProperties.commandItems || [];
    const optionItems = this._contextMenuProperties.optionItems || [];

    // make sure there's at least something to show before creating the Context Menu
    if (!columnDef || (!isColumnCommandAllowed && !isColumnOptionAllowed) || (!commandItems.length && !optionItems.length)) {
      return;
    }

    // delete any prior context menu
    this.destroyMenu(e);

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
    this._menuElm.style.top = `${targetEvent.pageY}px`;
    this._menuElm.style.left = `${targetEvent.pageX}px`;
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

  protected createMenu(commandItems: Array<MenuCommandItem | 'divider'>, optionItems: Array<MenuOptionItem | 'divider'>, level = 0, item?: MenuCommandItem | MenuOptionItem | 'divider') {
    const columnDef = this._grid.getColumns()[this._currentCell];
    const dataContext = this._grid.getDataItem(this._currentRow);
    const isColumnOptionAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.optionShownOverColumnIds ?? [], columnDef.id);
    const isColumnCommandAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.commandShownOverColumnIds ?? [], columnDef.id);

    // create a new context menu
    const maxHeight = isNaN(this._contextMenuProperties.maxHeight as number) ? this._contextMenuProperties.maxHeight : `${this._contextMenuProperties.maxHeight ?? 0}px`;
    const width = isNaN(this._contextMenuProperties.width as number) ? this._contextMenuProperties.width : `${this._contextMenuProperties.maxWidth ?? 0}px`;

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

    const menuClasses = `slick-context-menu slick-menu-level-${level} ${this._gridUid}`;
    const bodyMenuElm = document.body.querySelector<HTMLDivElement>(`.slick-context-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);

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
    menuElm.ariaLabel = level > 1 ? 'SubMenu' : 'Context Menu';
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
      closeButtonElm.dataset.dismiss = 'slick-context-menu';
      closeButtonElm.ariaLabel = 'Close';

      const spanCloseElm = document.createElement('span');
      spanCloseElm.className = 'close';
      spanCloseElm.ariaHidden = 'true';
      spanCloseElm.textContent = '×';
      closeButtonElm.appendChild(spanCloseElm);
    }

    // -- Option List section
    if (!this._contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
      const optionMenuElm = document.createElement('div');
      optionMenuElm.className = 'slick-context-menu-option-list';
      optionMenuElm.role = 'menu';

      // when creating sub-menu add its sub-menu title when exists
      if (item && level > 0) {
        this.addSubMenuTitleWhenExists(item, optionMenuElm); // add sub-menu title when exists
      }

      if (closeButtonElm && !this._contextMenuProperties.hideCloseButton) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        menuElm.appendChild(closeButtonElm);
      }
      menuElm.appendChild(optionMenuElm);

      this.populateCommandOrOptionItems(
        'option',
        this._contextMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }

    // -- Command List section
    if (!this._contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
      const commandMenuElm = document.createElement('div');
      commandMenuElm.className = 'slick-context-menu-command-list';
      commandMenuElm.role = 'menu';

      // when creating sub-menu add its sub-menu title when exists
      if (item && level > 0) {
        this.addSubMenuTitleWhenExists(item, commandMenuElm); // add sub-menu title when exists
      }

      if (closeButtonElm && !this._contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || this._contextMenuProperties.hideOptionSection)) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        menuElm.appendChild(closeButtonElm);
      }

      menuElm.appendChild(commandMenuElm);
      this.populateCommandOrOptionItems(
        'command',
        this._contextMenuProperties,
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

  protected handleCloseButtonClicked(e: MouseEvent | TouchEvent) {
    if (!e.defaultPrevented) {
      this.destroyMenu(e);
    }
  }

  destroyMenu(e?: Event | SlickEventData_, args?: { cell: number; row: number; }) {
    this._menuElm = this._menuElm || document.querySelector(`.slick-context-menu${this.getGridUidSelector()}`);

    if (this._menuElm?.remove) {
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
    document.querySelectorAll(`.slick-context-menu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll('sub-menu');
    document.querySelectorAll(`.slick-context-menu.slick-submenu${this.getGridUidSelector()}`)
      .forEach(subElm => subElm.remove());
  }

  protected checkIsColumnAllowed(columnIds: Array<number | string>, columnId: number | string) {
    let isAllowedColumn = false;

    if (columnIds?.length > 0) {
      for (let o = 0, ln = columnIds.length; o < ln; o++) {
        if (columnIds[o] === columnId) {
          isAllowedColumn = true;
        }
      }
    } else {
      isAllowedColumn = true;
    }
    return isAllowedColumn;
  }

  protected getGridUidSelector() {
    const gridUid = this._grid.getUID() || '';
    return gridUid ? `.${gridUid}` : '';
  }

  protected handleOnContextMenu(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs) {
    this.destroyAllMenus(); // make there's only 1 parent menu opened at a time
    const e = evt instanceof SlickEventData ? evt.getNativeEvent<DOMMouseOrTouchEvent<HTMLDivElement>>() : evt;
    e.preventDefault();
    const cell = this._grid.getCellFromEvent(e);

    if (cell) {
      const columnDef = this._grid.getColumns()[cell.cell];
      const dataContext = this._grid.getDataItem(cell.row);

      // run the override function (when defined), if the result is false it won't go further
      args = args || {};
      args.cell = cell.cell;
      args.row = cell.row;
      args.column = columnDef;
      args.dataContext = dataContext;
      args.grid = this._grid;

      if (!this.runOverrideFunctionWhenExists(this._contextMenuProperties.menuUsabilityOverride, args)) {
        return;
      }

      // create the DOM element
      this._menuElm = this.createParentMenu(e as MouseEvent);

      // reposition the menu to where the user clicked
      if (this._menuElm) {
        this.repositionMenu(e, this._menuElm);
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
        .querySelectorAll(`.slick-context-menu.slick-submenu${this.getGridUidSelector()}`)
        .forEach(subElm => {
          if (subElm.contains(e.target)) {
            isMenuClicked = true;
          }
        });
    }

    if (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented) {
      this.destroyMenu(e, { cell: this._currentCell, row: this._currentRow });
    }
  }

  /** Construct the Command Items section. */
  protected populateCommandOrOptionItems(
    itemType: MenuType,
    contextMenu: ContextMenuOption,
    commandOrOptionMenuElm: HTMLElement,
    commandOrOptionItems: Array<MenuCommandItem | 'divider'> | Array<MenuOptionItem | 'divider'>,
    args: { cell: number, row: number, column: Column, dataContext: any, grid: SlickGrid, level: number }
  ) {
    if (!args || !commandOrOptionItems || !contextMenu) {
      return;
    }

    // user could pass a title on top of the Commands/Options section
    const level = args?.level || 0;
    const isSubMenu = level > 0;
    if (contextMenu?.[`${itemType}Title`] && !isSubMenu) {
      this[`_${itemType}TitleElm`] = document.createElement('div');
      this[`_${itemType}TitleElm`]!.className = 'slick-menu-title';
      this[`_${itemType}TitleElm`]!.textContent = contextMenu[`${itemType}Title`] as string;
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
      // so that "handleMenuItemClick" has the correct flag and won't trigger a command clicked event
      if (Object.prototype.hasOwnProperty.call(item, 'itemUsabilityOverride')) {
        (item as MenuCommandItem | MenuOptionItem).disabled = isItemUsable ? false : true;
      }

      const liElm = document.createElement('div');
      liElm.className = 'slick-context-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuCommandItem | MenuOptionItem).divider || item === 'divider') {
        liElm.classList.add('slick-context-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuCommandItem | MenuOptionItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-context-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuCommandItem | MenuOptionItem).hidden) {
        liElm.classList.add('slick-context-menu-item-hidden');
      }

      if ((item as MenuCommandItem | MenuOptionItem).cssClass) {
        liElm.classList.add(...Utils.classNameToList((item as MenuCommandItem | MenuOptionItem).cssClass));
      }

      if ((item as MenuCommandItem | MenuOptionItem).tooltip) {
        liElm.title = (item as MenuCommandItem | MenuOptionItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-context-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuCommandItem | MenuOptionItem).iconCssClass) {
        iconElm.classList.add(...Utils.classNameToList((item as MenuCommandItem | MenuOptionItem).iconCssClass));
      }

      if ((item as MenuCommandItem | MenuOptionItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuCommandItem | MenuOptionItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-context-menu-content';
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
      if (this._contextMenuProperties.subMenuOpenByEvent === 'mouseover') {
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
        if (this._contextMenuProperties.subItemChevronClass) {
          chevronElm.classList.add(...Utils.classNameToList(this._contextMenuProperties.subItemChevronClass));
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
      let cellValue;

      if (Object.prototype.hasOwnProperty.call(dataContext, columnDef?.field)) {
        cellValue = dataContext[columnDef.field];
      }

      if (optionOrCommand !== undefined && !(item as any)[`${type}Items`]) {
        // user could execute a callback through 2 ways
        // via the onCommand event and/or an action callback
        const callbackArgs = {
          cell,
          row,
          grid: this._grid,
          [type]: optionOrCommand,
          item,
          column: columnDef,
          dataContext,
          value: cellValue
        };
        const eventType = type === 'command' ? 'onCommand' : 'onOptionSelected';
        this[eventType].notify(callbackArgs as any, e, this);

        // execute action callback when defined
        if (typeof (item as MenuCommandItem).action === 'function') {
          (item as any).action.call(this, e, callbackArgs);
        }

        if (!e.defaultPrevented) {
          this.destroyMenu(e, { cell, row });
        }
      } else if ((item as MenuCommandItem).commandItems || (item as MenuOptionItem).optionItems) {
        this.repositionSubMenu(item, type, level, e);
      } else {
        this.destroySubMenus();
      }
      this._lastMenuTypeClicked = type;
    }
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
  protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, menuElm: HTMLElement) {
    const isSubMenu = menuElm.classList.contains('slick-submenu');
    const targetEvent = (e as TouchEvent).touches?.[0] ?? e;
    const parentElm = isSubMenu
      ? e.target.closest('.slick-context-menu-item') as HTMLDivElement
      : e.target.closest('.slick-cell') as HTMLDivElement;

    if (menuElm && parentElm) {
      const parentOffset = Utils.offset(parentElm);
      let menuOffsetLeft = (isSubMenu && parentElm) ? parentOffset?.left ?? 0 : targetEvent.pageX;
      let menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : targetEvent.pageY;
      const menuHeight = menuElm?.offsetHeight || 0;
      const menuWidth = Number(menuElm?.offsetWidth || this._contextMenuProperties.width || 0);
      const rowHeight = this._gridOptions.rowHeight;
      const dropOffset = Number(this._contextMenuProperties.autoAdjustDropOffset || 0);
      const sideOffset = Number(this._contextMenuProperties.autoAlignSideOffset || 0);

      // if autoAdjustDrop is enable, we first need to see what position the drop will be located
      // without necessary toggling it's position just yet, we just want to know the future position for calculation
      if (this._contextMenuProperties.autoAdjustDrop) {
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
      // if there isn't enough space on the right, it will automatically align the drop menu to the left
      // to simulate an align left, we actually need to know the width of the drop menu
      if (this._contextMenuProperties.autoAlignSide) {
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
          menuOffsetLeft -= menuWidth - sideOffset;
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
        ContextMenu: SlickContextMenu
      }
    }
  });
}
