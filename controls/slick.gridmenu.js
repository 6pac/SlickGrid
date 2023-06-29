/***
 * A control to add a Grid Menu (hambuger menu on top-right of the grid)
 *
 * USAGE:
 *
 * Add the slick.gridmenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * var gridMenuControl = new Slick.Controls.GridMenu(columns, grid, options);
 *
 * Available grid options, by defining a gridMenu object:
 *
 *  var options = {
 *    enableCellNavigation: true,
 *    gridMenu: {
 *      customTitle: "Custom Menus",                // default to empty string
 *      columnTitle: "Columns",                     // default to empty string
 *      iconImage: "../images/drag-handle.png",     // this is the Grid Menu icon (hamburger icon)
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
 *
 *
 * @param options {Object} Options:
 *    buttonCssClass:   an extra CSS class to add to the menu button
 *    buttonImage:      a url to the menu button image (default '../images/down.gif')
 * @class Slick.Controls.GridMenu
 * @constructor
 */

'use strict';

(function (window) {
  // register namespace
  Slick.Utils.extend(true, window, {
    "Slick": {
      "Controls": {
        "GridMenu": SlickGridMenu
      }
    }
  });

  function SlickGridMenu(columns, grid, options) {
    var _grid = grid;
    var _gridOptions;
    var _gridUid = (grid && grid.getUID) ? grid.getUID() : '';
    var _isMenuOpen = false;
    var _options = options;
    var _self = this;
    var _columnTitleElm;
    var _customTitleElm;
    var _customMenuElm;
    var _headerElm;
    var _listElm;
    var _buttonElm;
    var _menuElm;
    var columnCheckboxes;
    var _defaults = {
      showButton: true,
      hideForceFitButton: false,
      hideSyncResizeButton: false,
      forceFitTitle: "Force fit columns",
      marginBottom: 15,
      menuWidth: 18,
      contentMinWidth: 0,
      resizeOnShowHeaderRow: false,
      syncResizeTitle: "Synchronous resize",
      useClickToRepositionMenu: true,
      headerColumnValueExtractor: function (columnDef) {
        return columnDef.name;
      }
    };
    var _bindingEventService = new Slick.BindingEventService();

    // when a grid optionally changes from a regular grid to a frozen grid, we need to destroy & recreate the grid menu
    // we do this change because the Grid Menu is on the left container for a regular grid, it is however on the right container for a frozen grid
    grid.onSetOptions.subscribe(function (e, args) {
      if (args && args.optionsBefore && args.optionsAfter) {
        var switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1;
        var switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
        if (switchedFromRegularToFrozen || switchedFromFrozenToRegular) {
          recreateGridMenu();
        }
      }
    });

    function init(grid) {
      _gridOptions = grid.getOptions();
      createGridMenu();

      // subscribe to the grid, when it's destroyed, we should also destroy the Grid Menu
      grid.onBeforeDestroy.subscribe(destroy);
    }

    function setOptions(newOptions) {
      options = Slick.Utils.extend({}, options, newOptions);
    }

    function createGridMenu() {
      var gridMenuWidth = (_options.gridMenu && _options.gridMenu.menuWidth) || _defaults.menuWidth;
      if (_gridOptions && _gridOptions.hasOwnProperty('frozenColumn') && _gridOptions.frozenColumn >= 0) {
        _headerElm = document.querySelector(`.${_gridUid} .slick-header-right`);
      } else {
        _headerElm = document.querySelector(`.${_gridUid} .slick-header-left`);
      }
      _headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`;

      // if header row is enabled, we need to resize its width also
      var enableResizeHeaderRow = (_options.gridMenu && _options.gridMenu.resizeOnShowHeaderRow != undefined) ? _options.gridMenu.resizeOnShowHeaderRow : _defaults.resizeOnShowHeaderRow;
      if (enableResizeHeaderRow && _options.showHeaderRow) {
        const headerRow = document.querySelector(`.${_gridUid}.slick-headerrow`);
        if (headerRow) {
          headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`;
        }
      }

      var showButton = (_options.gridMenu && _options.gridMenu.showButton !== undefined) ? _options.gridMenu.showButton : _defaults.showButton;
      if (showButton) {
        _buttonElm = document.createElement('button');
        _buttonElm.className = 'slick-gridmenu-button';
        _buttonElm.ariaLabel = 'Grid Menu';

        if (_options.gridMenu && _options.gridMenu.iconCssClass) {
          _buttonElm.classList.add(..._options.gridMenu.iconCssClass.split(' '));
        } else {
          const iconImageElm = document.createElement('img');
          iconImageElm.src = (_options.gridMenu && _options.gridMenu.iconImage) ? _options.gridMenu.iconImage : "../images/drag-handle.png";
          _buttonElm.appendChild(iconImageElm);
        }
        if (options.iconCssClass) {
          _buttonElm.classList.add(...options.iconCssClass.split(' '));
        }
        _headerElm.parentElement.insertBefore(_buttonElm, _headerElm.parentElement.firstChild);

        // add on click handler for the Grid Menu itself
        _bindingEventService.bind(_buttonElm, 'click', showGridMenu);
      }

      _menuElm = document.createElement('div');
      _menuElm.className = `slick-gridmenu ${_gridUid}`;
      _menuElm.style.display = 'none';
      document.body.appendChild(_menuElm);

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
      _menuElm.appendChild(buttonElm);

      _customMenuElm = document.createElement('div');
      _customMenuElm.className = 'slick-gridmenu-custom';
      _customMenuElm.role = 'menu';

      _menuElm.appendChild(_customMenuElm);

      populateCustomMenus(_options, _customMenuElm);
      populateColumnPicker();

      // Hide the menu on outside click.
      _bindingEventService.bind(document.body, 'mousedown', handleBodyMouseDown);

      // destroy the picker if user leaves the page
      _bindingEventService.bind(document.body, 'beforeunload', destroy);
    }

    /** Destroy the plugin by unsubscribing every events & also delete the menu DOM elements */
    function destroy() {
      _self.onAfterMenuShow.unsubscribe();
      _self.onBeforeMenuShow.unsubscribe();
      _self.onMenuClose.unsubscribe();
      _self.onCommand.unsubscribe();
      _self.onColumnsChanged.unsubscribe();
      _grid.onColumnsReordered.unsubscribe(updateColumnOrder);
      _grid.onBeforeDestroy.unsubscribe();
      _grid.onSetOptions.unsubscribe();
      _bindingEventService.unbindAll();
      if (_menuElm && _menuElm.remove) {
        _menuElm.remove();
      }
      deleteMenu();
    }

    /** Delete the menu DOM element but without unsubscribing any events */
    function deleteMenu() {
      _bindingEventService.unbindAll();
      const gridMenuElm = document.querySelector(`div.slick-gridmenu.${_gridUid}`);
      if (gridMenuElm) {
        gridMenuElm.style.display = 'none';
      }
      if (_headerElm) {
        // put back original width (fixes width and frozen+gridMenu on left header)
        _headerElm.style.width = '100%';
      }
      _buttonElm && _buttonElm.remove();
      _menuElm && _menuElm.remove();
    }

    function populateCustomMenus(options, customMenuElm) {
      // Construct the custom menu items.
      if (!options.gridMenu || !options.gridMenu.customItems) {
        return;
      }

      // user could pass a title on top of the custom section
      if (_options.gridMenu && _options.gridMenu.customTitle) {
        _customTitleElm = document.createElement('div');
        _customTitleElm.className = 'title';
        _customTitleElm.innerHTML = _options.gridMenu.customTitle;
        customMenuElm.appendChild(_customTitleElm);
      }

      for (let i = 0, ln = options.gridMenu.customItems.length; i < ln; i++) {
        let addClickListener = true;
        let item = options.gridMenu.customItems[i];
        let callbackArgs = {
          "grid": _grid,
          "menu": _menuElm,
          "columns": columns,
          "visibleColumns": getVisibleColumns()
        };

        // run each override functions to know if the item is visible and usable
        let isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs);
        let isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);

        // if the result is not visible then there's no need to go further
        if (!isItemVisible) {
          continue;
        }

        // when the override is defined, we need to use its result to update the disabled property
        // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
        if (Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride")) {
          item.disabled = isItemUsable ? false : true;
        }

        const liElm = document.createElement('div');
        liElm.className = 'slick-gridmenu-item';
        liElm.role = 'menuitem';

        if (item.divider || item === "divider") {
          liElm.classList.add("slick-gridmenu-item-divider");
          addClickListener = false;
        }
        if (item.disabled) {
          liElm.classList.add("slick-gridmenu-item-disabled");
        }

        if (item.hidden) {
          liElm.classList.add("slick-gridmenu-item-hidden");
        }

        if (item.cssClass) {
          liElm.classList.add(...item.cssClass.split(' '));
        }

        if (item.tooltip) {
          liElm.title = item.tooltip;
        }

        const iconElm = document.createElement('div');
        iconElm.className = 'slick-gridmenu-icon';

        liElm.appendChild(iconElm);

        if (item.iconCssClass) {
          iconElm.classList.add(...item.iconCssClass.split(' '));
        }

        if (item.iconImage) {
          iconElm.style.backgroundImage = "url(" + item.iconImage + ")";
        }

        const textElm = document.createElement('span');
        textElm.className = 'slick-gridmenu-content';
        textElm.innerHTML = item.title;

        liElm.appendChild(textElm);

        if (item.textCssClass) {
          textElm.classList.add(...item.textCssClass.split(' '));
        }

        customMenuElm.appendChild(liElm);

        if (addClickListener) {
          _bindingEventService.bind(liElm, 'click', handleMenuItemClick.bind(this, item));
        }
      }
    }

    /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
    function populateColumnPicker() {
      _grid.onColumnsReordered.subscribe(updateColumnOrder);
      _options = Slick.Utils.extend({}, _defaults, _options);

      // user could pass a title on top of the columns list
      if (_options.gridMenu && _options.gridMenu.columnTitle) {
        _columnTitleElm = document.createElement('div');
        _columnTitleElm.className = 'title';
        _columnTitleElm.innerHTML = _options.gridMenu.columnTitle;
        _menuElm.appendChild(_columnTitleElm);
      }

      _bindingEventService.bind(_menuElm, 'click', updateColumn);
      _listElm = document.createElement('span');
      _listElm.className = 'slick-gridmenu-list';
      _listElm.role = 'menu';
    }

    /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
    function recreateGridMenu() {
      deleteMenu();
      init(_grid);
    }

    function showGridMenu(e) {
      var targetEvent = e.touches ? e.touches[0] : e;
      e.preventDefault();

      // empty both the picker list & the command list
      Slick.Utils.emptyElement(_listElm);
      Slick.Utils.emptyElement(_customMenuElm);

      populateCustomMenus(_options, _customMenuElm);
      updateColumnOrder();
      columnCheckboxes = [];

      var callbackArgs = {
        "grid": _grid,
        "menu": _menuElm,
        "allColumns": columns,
        "visibleColumns": getVisibleColumns()
      };

      // run the override function (when defined), if the result is false it won't go further
      if (_options && _options.gridMenu && !runOverrideFunctionWhenExists(_options.gridMenu.menuUsabilityOverride, callbackArgs)) {
        return;
      }

      // notify of the onBeforeMenuShow only works when
      // this mean that we cannot notify when the grid menu is attach to a button event
      if (typeof e.stopPropagation === "function") {
        if (_self.onBeforeMenuShow.notify(callbackArgs, e, _self).getReturnValue() == false) {
          return;
        }
      }

      let columnId, columnLabel, excludeCssClass;
      for (let i = 0; i < columns.length; i++) {
        columnId = columns[i].id;
        excludeCssClass = columns[i].excludeFromGridMenu ? "hidden" : "";

        const liElm = document.createElement('li');
        liElm.className = excludeCssClass;
        liElm.ariaLabel = columns[i] && columns[i].name;

        const checkboxElm = document.createElement('input');
        checkboxElm.type = 'checkbox';
        checkboxElm.id = `${_gridUid}-gridmenu-colpicker-${columnId}`;
        checkboxElm.dataset.columnid = columns[i].id;
        liElm.appendChild(checkboxElm);

        if (_grid.getColumnIndex(columns[i].id) != null && !columns[i].hidden) {
          checkboxElm.checked = true;
        }

        columnCheckboxes.push(checkboxElm);

        // get the column label from the picker value extractor (user can optionally provide a custom extractor)
        if (_options && _options.gridMenu && _options.gridMenu.headerColumnValueExtractor) {
          columnLabel = _options.gridMenu.headerColumnValueExtractor(columns[i], _gridOptions);
        } else {
          columnLabel = _defaults.headerColumnValueExtractor(columns[i], _gridOptions);
        }

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-${columnId}`;
        labelElm.innerHTML = columnLabel;
        liElm.appendChild(labelElm);
        _listElm.appendChild(liElm);
      }

      if (_options.gridMenu && (!_options.gridMenu.hideForceFitButton || !_options.gridMenu.hideSyncResizeButton)) {
        _listElm.appendChild(document.createElement('hr'));
      }

      if (!(_options.gridMenu && _options.gridMenu.hideForceFitButton)) {
        let forceFitTitle = (_options.gridMenu && _options.gridMenu.forceFitTitle) || _defaults.forceFitTitle;

        const liElm = document.createElement('li');
        liElm.ariaLabel = forceFitTitle;
        liElm.role = 'menuitem';
        _listElm.appendChild(liElm);

        const forceFitCheckboxElm = document.createElement('input');
        forceFitCheckboxElm.type = 'checkbox';
        forceFitCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-forcefit`;
        forceFitCheckboxElm.dataset.option = 'autoresize';
        liElm.appendChild(forceFitCheckboxElm);

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-forcefit`;
        labelElm.textContent = forceFitTitle;
        liElm.appendChild(labelElm);

        if (_grid.getOptions().forceFitColumns) {
          forceFitCheckboxElm.checked = true;
        }
      }

      if (!(_options.gridMenu && _options.gridMenu.hideSyncResizeButton)) {
        let syncResizeTitle = (_options.gridMenu && _options.gridMenu.syncResizeTitle) || _defaults.syncResizeTitle;

        const liElm = document.createElement('li');
        liElm.ariaLabel = syncResizeTitle;
        _listElm.appendChild(liElm);

        const syncResizeCheckboxElm = document.createElement('input');
        syncResizeCheckboxElm.type = 'checkbox';
        syncResizeCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-syncresize`;
        syncResizeCheckboxElm.dataset.option = 'syncresize';
        liElm.appendChild(syncResizeCheckboxElm);

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-syncresize`;
        labelElm.textContent = syncResizeTitle;
        liElm.appendChild(labelElm);

        if (_grid.getOptions().syncColumnCellResize) {
          syncResizeCheckboxElm.checked = true;
        }
      }

      let buttonElm = e.target.nodeName === 'BUTTON' ? e.target : e.target.querySelector('button'); // get button element
      if (!buttonElm) {
        buttonElm = e.target.parentElement; // external grid menu might fall in this last case if wrapped in a span/div
      }

      // we need to display the menu to properly calculate its width but we can however make it invisible
      _menuElm.style.display = 'block';
      _menuElm.style.opacity = '0';

      let menuIconOffset = Slick.Utils.offset(buttonElm); // get button offset position
      let menuWidth = _menuElm.offsetWidth;
      let useClickToRepositionMenu = (_options.gridMenu && _options.gridMenu.useClickToRepositionMenu !== undefined) ? _options.gridMenu.useClickToRepositionMenu : _defaults.useClickToRepositionMenu;
      let contentMinWidth = (_options.gridMenu && _options.gridMenu.contentMinWidth) ? _options.gridMenu.contentMinWidth : _defaults.contentMinWidth;
      let currentMenuWidth = (contentMinWidth > menuWidth) ? contentMinWidth : menuWidth + 5;
      let nextPositionTop = (useClickToRepositionMenu && targetEvent.pageY > 0) ? targetEvent.pageY : menuIconOffset.top + 10;
      let nextPositionLeft = (useClickToRepositionMenu && targetEvent.pageX > 0) ? targetEvent.pageX : menuIconOffset.left + 10;
      let menuMarginBottom = (_options.gridMenu && _options.gridMenu.marginBottom !== undefined) ? _options.gridMenu.marginBottom : _defaults.marginBottom;

      _menuElm.style.top = `${nextPositionTop + 10}px`;
      _menuElm.style.left = `${nextPositionLeft - currentMenuWidth + 10}px`;

      if (contentMinWidth > 0) {
        _menuElm.style.minWidth = `${contentMinWidth}px`;
      }

      // set "height" when defined OR ELSE use the "max-height" with available window size and optional margin bottom
      if (_options.gridMenu && _options.gridMenu.height !== undefined) {
        _menuElm.style.height = `${_options.gridMenu.height}px`;
      } else {
        _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`;
      }

      _menuElm.style.display = 'block';
      _menuElm.style.opacity = '1'; // restore menu visibility
      _menuElm.appendChild(_listElm);
      _isMenuOpen = true;

      if (typeof e.stopPropagation === "function") {
        if (_self.onAfterMenuShow.notify(callbackArgs, e, _self).getReturnValue() == false) {
          return;
        }
      }
    }

    function handleBodyMouseDown(event) {
      if ((_menuElm !== event.target && !(_menuElm && _menuElm.contains(event.target)) && _isMenuOpen) || event.target.className === 'close') {
        hideMenu(event);
      }
    }

    function handleMenuItemClick(item, e) {
      const command = item.command || '';

      if (item.disabled || item.divider || item === "divider") {
        return;
      }

      if (command != null && command != '') {
        var callbackArgs = {
          "grid": _grid,
          "command": command,
          "item": item,
          "allColumns": columns,
          "visibleColumns": getVisibleColumns()
        };
        _self.onCommand.notify(callbackArgs, e, _self);

        // execute action callback when defined
        if (typeof item.action === "function") {
          item.action.call(this, e, callbackArgs);
        }
      }

      // does the user want to leave open the Grid Menu after executing a command?
      var leaveOpen = (_options.gridMenu && _options.gridMenu.leaveOpen) ? true : false;
      if (!leaveOpen && !e.defaultPrevented) {
        hideMenu(e);
      }

      // Stop propagation so that it doesn't register as a header click event.
      e.preventDefault();
      e.stopPropagation();
    }

    function hideMenu(e) {
      if (_menuElm) {
        Slick.Utils.hide(_menuElm);
        _isMenuOpen = false;

        var callbackArgs = {
          "grid": _grid,
          "menu": _menuElm,
          "allColumns": columns,
          "visibleColumns": getVisibleColumns()
        };
        if (_self.onMenuClose.notify(callbackArgs, e, _self).getReturnValue() == false) {
          return;
        }
      }
    }

    /** Update the Titles of each sections (command, customTitle, ...) */
    function updateAllTitles(gridMenuOptions) {
      if (_customTitleElm && _customTitleElm.innerHTML) {
        _customTitleElm.innerHTML = gridMenuOptions.customTitle;
      }
      if (_columnTitleElm && _columnTitleElm.innerHTML) {
        _columnTitleElm.innerHTML = gridMenuOptions.columnTitle;
      }
    }

    function updateColumnOrder() {
      // Because columns can be reordered, we have to update the `columns`
      // to reflect the new order, however we can't just take `grid.getColumns()`,
      // as it does not include columns currently hidden by the picker.
      // We create a new `columns` structure by leaving currently-hidden
      // columns in their original ordinal position and interleaving the results
      // of the current column sort.
      var current = _grid.getColumns().slice(0);
      var ordered = new Array(columns.length);
      for (var i = 0; i < ordered.length; i++) {
        if (_grid.getColumnIndex(columns[i].id) === undefined) {
          // If the column doesn't return a value from getColumnIndex,
          // it is hidden. Leave it in this position.
          ordered[i] = columns[i];
        } else {
          // Otherwise, grab the next visible column.
          ordered[i] = current.shift();
        }
      }
      columns = ordered;
    }

    function updateColumn(e) {
      if (e.target.dataset.option === 'autoresize') {
        // when calling setOptions, it will resize with ALL Columns (even the hidden ones)
        // we can avoid this problem by keeping a reference to the visibleColumns before setOptions and then setColumns after
        var previousVisibleColumns = getVisibleColumns();
        var isChecked = e.target.checked;
        _grid.setOptions({ forceFitColumns: isChecked });
        _grid.setColumns(previousVisibleColumns);
        return;
      }

      if (e.target.dataset.option === 'syncresize') {
        _grid.setOptions({ syncColumnCellResize: !!(e.target.checked) });
        return;
      }

      if (e.target.type === 'checkbox') {
        const isChecked = e.target.checked;
        const columnId = e.target.dataset.columnid || '';
        let visibleColumns = [];
        columnCheckboxes.forEach((columnCheckbox, idx) => {
          if (columnCheckbox.checked) {
            if (columns[idx].hidden) { columns[idx].hidden = false; }
            visibleColumns.push(columns[idx]);
          }
        });

        if (!visibleColumns.length) {
          e.target.checked = true;
          return;
        }

        const callbackArgs = {
          "columnId": columnId,
          "showing": isChecked,
          "grid": _grid,
          "allColumns": columns,
          "columns": visibleColumns
        };
        _grid.setColumns(visibleColumns);
        _self.onColumnsChanged.notify(callbackArgs, e, _self);
      }
    }

    init(_grid);

    function getAllColumns() {
      return columns;
    }

    /** visible columns, we can simply get them directly from the grid */
    function getVisibleColumns() {
      return _grid.getColumns();
    }

    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    function runOverrideFunctionWhenExists(overrideFn, args) {
      if (typeof overrideFn === 'function') {
        return overrideFn.call(this, args);
      }
      return true;
    }

    Slick.Utils.extend(this, {
      "init": init,
      "getAllColumns": getAllColumns,
      "getVisibleColumns": getVisibleColumns,
      "destroy": destroy,
      "deleteMenu": deleteMenu,
      "recreateGridMenu": recreateGridMenu,
      "showGridMenu": showGridMenu,
      "setOptions": setOptions,
      "updateAllTitles": updateAllTitles,
      "hideMenu": hideMenu,

      "onAfterMenuShow": new Slick.Event(),
      "onBeforeMenuShow": new Slick.Event(),
      "onMenuClose": new Slick.Event(),
      "onCommand": new Slick.Event(),
      "onColumnsChanged": new Slick.Event()
    });
  }
})(window);
