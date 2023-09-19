import {
  BindingEventService as BindingEventService_,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core';
import type {
  ContextMenuOption,
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
export class SlickContextMenu implements Plugin {
  // --
  // public API
  pluginName = 'ContextMenu' as const;
  onAfterMenuShow = new SlickEvent<MenuFromCellCallbackArgs>();
  onBeforeMenuShow = new SlickEvent<MenuFromCellCallbackArgs>();
  onBeforeMenuClose = new SlickEvent<MenuFromCellCallbackArgs>();
  onCommand = new SlickEvent<MenuCommandItemCallbackArgs>();
  onOptionSelected = new SlickEvent<MenuOptionItemCallbackArgs>();

  // --
  // protected props
  protected _contextMenuProperties: ContextMenuOption;
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
  };

  constructor(optionProperties: Partial<ContextMenuOption>) {
    this._contextMenuProperties = Utils.extend({}, this._defaults, optionProperties);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._gridOptions = grid.getOptions();
    this._gridUid = grid?.getUID() || '';
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

  protected createMenu(evt: SlickEventData_ | MouseEvent) {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent<MouseEvent | TouchEvent>() : evt;
    const targetEvent = (e as TouchEvent).touches?.[0] ?? e;
    const cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0;
    this._currentRow = cell?.row ?? 0;
    const columnDef = this._grid.getColumns()[this._currentCell];
    const dataContext = this._grid.getDataItem(this._currentRow);

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
    }, e, this).getReturnValue() == false) {
      return;
    }

    // create a new context menu
    const maxHeight = isNaN(this._contextMenuProperties.maxHeight as number) ? this._contextMenuProperties.maxHeight : `${this._contextMenuProperties.maxHeight ?? 0}px`;
    const width = isNaN(this._contextMenuProperties.width as number) ? this._contextMenuProperties.width : `${this._contextMenuProperties.maxWidth ?? 0}px`;

    this._menuElm = document.createElement('div');
    this._menuElm.className = `slick-context-menu ${this._gridUid}`;
    this._menuElm.role = 'menu';
    if (width) {
      this._menuElm.style.width = width as string;
    }
    if (maxHeight) {
      this._menuElm.style.maxHeight = maxHeight as string;
    }
    this._menuElm.style.top = `${targetEvent.pageY}px`;
    this._menuElm.style.left = `${targetEvent.pageX}px`;
    this._menuElm.style.display = 'none';

    const closeButtonElm = document.createElement('button');
    closeButtonElm.type = 'button';
    closeButtonElm.className = 'close';
    closeButtonElm.dataset.dismiss = 'slick-context-menu';
    closeButtonElm.ariaLabel = 'Close';

    const spanCloseElm = document.createElement('span');
    spanCloseElm.className = 'close';
    spanCloseElm.ariaHidden = 'true';
    spanCloseElm.innerHTML = '&times;';
    closeButtonElm.appendChild(spanCloseElm);

    // -- Option List section
    if (!this._contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
      const optionMenuElm = document.createElement('div');
      optionMenuElm.className = 'slick-context-menu-option-list';
      optionMenuElm.role = 'menu';

      if (!this._contextMenuProperties.hideCloseButton) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        this._menuElm.appendChild(closeButtonElm);
      }
      this._menuElm.appendChild(optionMenuElm)

      this.populateOptionItems(
        this._contextMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext: dataContext, grid: this._grid }
      );
    }

    // -- Command List section
    if (!this._contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
      const commandMenuElm = document.createElement('div');
      commandMenuElm.className = 'slick-context-menu-command-list';
      commandMenuElm.role = 'menu';

      if (!this._contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || this._contextMenuProperties.hideOptionSection)) {
        this._bindingEventService.bind(closeButtonElm, 'click', this.handleCloseButtonClicked.bind(this) as EventListener);
        this._menuElm.appendChild(closeButtonElm);
      }

      this._menuElm.appendChild(commandMenuElm);
      this.populateCommandItems(
        this._contextMenuProperties,
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

  protected handleCloseButtonClicked(e: MouseEvent | TouchEvent) {
    if (!e.defaultPrevented) {
      this.destroyMenu(e);
    }
  }

  destroyMenu(e?: Event, args?: { cell: number; row: number; }) {
    this._menuElm = this._menuElm || document.querySelector(`.slick-context-menu.${this._gridUid}`);

    if (this._menuElm?.remove) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell ?? 0,
        row: args?.row ?? 0,
        grid: this._grid,
      }, e, this).getReturnValue() == false) {
        return;
      }
      this._menuElm.remove();
      this._menuElm = null;
    }
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

  protected handleOnContextMenu(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs) {
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
      this._menuElm = this.createMenu(e as MouseEvent);

      // reposition the menu to where the user clicked
      if (this._menuElm) {
        this.repositionMenu(e);
        this._menuElm.style.display = 'block';
      }

      this._bindingEventService.bind(document.body, 'click', (e) => {
        if (!e.defaultPrevented) {
          this.destroyMenu(e, { cell: this._currentCell, row: this._currentRow });
        }
      });
    }
  }

  /** Construct the Option Items section. */
  protected populateOptionItems(contextMenu: ContextMenuOption, optionMenuElm: HTMLElement, optionItems: Array<MenuOptionItem | 'divider'>, args: any) {
    if (!args || !optionItems || !contextMenu) {
      return;
    }

    // user could pass a title on top of the Options section
    if (contextMenu?.optionTitle) {
      this._optionTitleElm = document.createElement('div');
      this._optionTitleElm.className = 'title';
      this._optionTitleElm.textContent = contextMenu.optionTitle;
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
      liElm.className = 'slick-context-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuOptionItem).divider || item === 'divider') {
        liElm.classList.add('slick-context-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuOptionItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-context-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuOptionItem).hidden) {
        liElm.classList.add('slick-context-menu-item-hidden');
      }

      if ((item as MenuOptionItem).cssClass) {
        liElm.classList.add(...(item as MenuOptionItem).cssClass!.split(' '));
      }

      if ((item as MenuOptionItem).tooltip) {
        liElm.title = (item as MenuOptionItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.role = 'button';
      iconElm.className = 'slick-context-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuOptionItem).iconCssClass) {
        iconElm.classList.add(...(item as MenuOptionItem).iconCssClass!.split(' '));
      }

      if ((item as MenuOptionItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuOptionItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-context-menu-content';
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
  protected populateCommandItems(contextMenu: ContextMenuOption, commandMenuElm: HTMLElement, commandItems: Array<MenuCommandItem | 'divider'>, args: any) {
    if (!args || !commandItems || !contextMenu) {
      return;
    }

    // user could pass a title on top of the Commands section
    if (contextMenu?.commandTitle) {
      this._commandTitleElm = document.createElement('div');
      this._commandTitleElm.className = 'title';
      this._commandTitleElm.textContent = contextMenu.commandTitle;
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
      liElm.className = 'slick-context-menu-item';
      liElm.role = 'menuitem';

      if ((item as MenuCommandItem).divider || item === 'divider') {
        liElm.classList.add('slick-context-menu-item-divider');
        addClickListener = false;
      }

      // if the item is disabled then add the disabled css class
      if ((item as MenuCommandItem).disabled || !isItemUsable) {
        liElm.classList.add('slick-context-menu-item-disabled');
      }

      // if the item is hidden then add the hidden css class
      if ((item as MenuCommandItem).hidden) {
        liElm.classList.add('slick-context-menu-item-hidden');
      }

      if ((item as MenuCommandItem).cssClass) {
        liElm.classList.add(...(item as MenuCommandItem).cssClass!.split(' '));
      }

      if ((item as MenuCommandItem).tooltip) {
        liElm.title = (item as MenuCommandItem).tooltip || '';
      }

      const iconElm = document.createElement('div');
      iconElm.className = 'slick-context-menu-icon';

      liElm.appendChild(iconElm);

      if ((item as MenuCommandItem).iconCssClass) {
        iconElm.classList.add(...(item as MenuCommandItem).iconCssClass!.split(' '));
      }

      if ((item as MenuCommandItem).iconImage) {
        iconElm.style.backgroundImage = `url(${(item as MenuCommandItem).iconImage})`;
      }

      const textElm = document.createElement('span');
      textElm.className = 'slick-context-menu-content';
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
    if (!item || (item as MenuCommandItem).disabled || (item as MenuCommandItem).divider) {
      return;
    }

    const command = (item as MenuCommandItem).command || '';
    const row = this._currentRow;
    const cell = this._currentCell;
    const columnDef = this._grid.getColumns()[cell];
    const dataContext = this._grid.getDataItem(row);
    let cellValue;

    if (Object.prototype.hasOwnProperty.call(dataContext, columnDef?.field)) {
      cellValue = dataContext[columnDef.field];
    }

    if (command !== null && command !== '') {
      // user could execute a callback through 2 ways
      // via the onCommand event and/or an action callback
      const callbackArgs = {
        cell,
        row,
        grid: this._grid,
        command,
        item: item as MenuCommandItem,
        column: columnDef,
        dataContext,
        value: cellValue
      };
      this.onCommand.notify(callbackArgs, e, this);

      // execute action callback when defined
      if (typeof (item as MenuCommandItem).action === 'function') {
        (item as any).action.call(this, e, callbackArgs);
      }
    }
  }

  protected handleMenuItemOptionClick(item: MenuOptionItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if ((item as MenuOptionItem).disabled || (item as MenuOptionItem).divider) {
      return;
    }
    if (!this._grid.getEditorLock().commitCurrentEdit()) {
      return;
    }

    const option = (item as MenuOptionItem).option !== undefined ? (item as MenuOptionItem).option : '';
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
        item: item as MenuOptionItem,
        column: columnDef,
        dataContext,
      };
      this.onOptionSelected.notify(callbackArgs, e, this);

      // execute action callback when defined
      if (typeof (item as MenuOptionItem).action === 'function') {
        (item as any).action.call(this, e, callbackArgs);
      }
    }
  }

  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if (this._menuElm && e.target) {
      const targetEvent = (e as TouchEvent).touches?.[0] ?? e;
      const parentElm = e.target.closest('.slick-cell') as HTMLDivElement;
      const parentOffset = (parentElm && Utils.offset(parentElm));
      let menuOffsetLeft = targetEvent.pageX;
      let menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : targetEvent.pageY;
      const menuHeight = this._menuElm?.offsetHeight || 0;
      const menuWidth = this._menuElm?.offsetWidth || this._contextMenuProperties.width || 0;
      const rowHeight = this._gridOptions.rowHeight;
      const dropOffset = this._contextMenuProperties.autoAdjustDropOffset;
      const sideOffset = this._contextMenuProperties.autoAlignSideOffset;

      // if autoAdjustDrop is enable, we first need to see what position the drop will be located
      // without necessary toggling it's position just yet, we just want to know the future position for calculation
      if (this._contextMenuProperties.autoAdjustDrop) {
        // since we reposition menu below slick cell, we need to take it in consideration and do our calculation from that element
        const spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom;
        const spaceTop = Utils.calculateAvailableSpace(parentElm).top;
        const spaceBottomRemaining = spaceBottom + (dropOffset || 0) - rowHeight!;
        const spaceTopRemaining = spaceTop - (dropOffset || 0) + rowHeight!;
        const dropPosition = (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining) ? 'top' : 'bottom';
        if (dropPosition === 'top') {
          this._menuElm.classList.remove('dropdown');
          this._menuElm.classList.add('dropup');
          menuOffsetTop = menuOffsetTop - menuHeight - (dropOffset || 0);
        } else {
          this._menuElm.classList.remove('dropup');
          this._menuElm.classList.add('dropdown');
          menuOffsetTop = menuOffsetTop + rowHeight! + (dropOffset || 0);
        }
      }

      // when auto-align is set, it will calculate whether it has enough space in the viewport to show the drop menu on the right (default)
      // if there isn't enough space on the right, it will automatically align the drop menu to the left
      // to simulate an align left, we actually need to know the width of the drop menu
      if (this._contextMenuProperties.autoAlignSide) {
        const gridPos = this._grid.getGridPosition();
        const dropSide = ((menuOffsetLeft + (+menuWidth)) >= gridPos.width) ? 'left' : 'right';
        if (dropSide === 'left') {
          this._menuElm.classList.remove('dropright');
          this._menuElm.classList.add('dropleft');
          menuOffsetLeft = (menuOffsetLeft - (+menuWidth) - (sideOffset || 0));
        } else {
          this._menuElm.classList.remove('dropleft');
          this._menuElm.classList.add('dropright');
          menuOffsetLeft = menuOffsetLeft + (sideOffset || 0);
        }
      }

      // ready to reposition the menu
      this._menuElm.style.top = `${menuOffsetTop}px`;
      this._menuElm.style.left = `${menuOffsetLeft}px`;
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

