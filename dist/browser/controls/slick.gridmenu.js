"use strict";
(() => {
  // src/controls/slick.gridmenu.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils;
  function SlickGridMenu(columns, grid, options) {
    var _grid = grid, _gridOptions, _gridUid = grid && grid.getUID ? grid.getUID() : "", _isMenuOpen = !1, _options = options, _self = this, _columnTitleElm, _customTitleElm, _customMenuElm, _headerElm, _listElm, _buttonElm, _menuElm, columnCheckboxes, _defaults = {
      showButton: !0,
      hideForceFitButton: !1,
      hideSyncResizeButton: !1,
      forceFitTitle: "Force fit columns",
      marginBottom: 15,
      menuWidth: 18,
      contentMinWidth: 0,
      resizeOnShowHeaderRow: !1,
      syncResizeTitle: "Synchronous resize",
      useClickToRepositionMenu: !0,
      headerColumnValueExtractor: function(columnDef) {
        return columnDef.name;
      }
    }, _bindingEventService = new BindingEventService();
    grid.onSetOptions.subscribe(function(e, args) {
      if (args && args.optionsBefore && args.optionsAfter) {
        var switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
        (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && recreateGridMenu();
      }
    });
    function init(grid2) {
      _gridOptions = grid2.getOptions(), createGridMenu(), grid2.onBeforeDestroy.subscribe(destroy);
    }
    function setOptions(newOptions) {
      options = Utils.extend({}, options, newOptions);
    }
    function createGridMenu() {
      var gridMenuWidth = _options.gridMenu && _options.gridMenu.menuWidth || _defaults.menuWidth;
      _gridOptions && _gridOptions.hasOwnProperty("frozenColumn") && _gridOptions.frozenColumn >= 0 ? _headerElm = document.querySelector(`.${_gridUid} .slick-header-right`) : _headerElm = document.querySelector(`.${_gridUid} .slick-header-left`), _headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`;
      var enableResizeHeaderRow = _options.gridMenu && _options.gridMenu.resizeOnShowHeaderRow != null ? _options.gridMenu.resizeOnShowHeaderRow : _defaults.resizeOnShowHeaderRow;
      if (enableResizeHeaderRow && _options.showHeaderRow) {
        let headerRow = document.querySelector(`.${_gridUid}.slick-headerrow`);
        headerRow && (headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`);
      }
      var showButton = _options.gridMenu && _options.gridMenu.showButton !== void 0 ? _options.gridMenu.showButton : _defaults.showButton;
      if (showButton) {
        if (_buttonElm = document.createElement("button"), _buttonElm.className = "slick-gridmenu-button", _buttonElm.ariaLabel = "Grid Menu", _options.gridMenu && _options.gridMenu.iconImage) {
          let iconImageElm = document.createElement("img");
          iconImageElm.src = _options.gridMenu.iconImage, _buttonElm.appendChild(iconImageElm);
        } else
          _options.gridMenu && _options.gridMenu.iconCssClass ? _buttonElm.classList.add(..._options.gridMenu.iconCssClass.split(" ")) : _buttonElm.classList.add("sgi", "sgi-menu");
        options.iconCssClass && _buttonElm.classList.add(...options.iconCssClass.split(" ")), _headerElm.parentElement.insertBefore(_buttonElm, _headerElm.parentElement.firstChild), _bindingEventService.bind(_buttonElm, "click", showGridMenu);
      }
      _menuElm = document.createElement("div"), _menuElm.className = `slick-gridmenu ${_gridUid}`, _menuElm.style.display = "none", document.body.appendChild(_menuElm);
      let buttonElm = document.createElement("button");
      buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-gridmenu", buttonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), _menuElm.appendChild(buttonElm), _customMenuElm = document.createElement("div"), _customMenuElm.className = "slick-gridmenu-custom", _customMenuElm.role = "menu", _menuElm.appendChild(_customMenuElm), populateCustomMenus(_options, _customMenuElm), populateColumnPicker(), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown), _bindingEventService.bind(document.body, "beforeunload", destroy);
    }
    function destroy() {
      _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onColumnsChanged.unsubscribe(), _grid.onColumnsReordered.unsubscribe(updateColumnOrder), _grid.onBeforeDestroy.unsubscribe(), _grid.onSetOptions.unsubscribe(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), deleteMenu();
    }
    function deleteMenu() {
      _bindingEventService.unbindAll();
      let gridMenuElm = document.querySelector(`div.slick-gridmenu.${_gridUid}`);
      gridMenuElm && (gridMenuElm.style.display = "none"), _headerElm && (_headerElm.style.width = "100%"), _buttonElm && _buttonElm.remove(), _menuElm && _menuElm.remove();
    }
    function populateCustomMenus(options2, customMenuElm) {
      if (!(!options2.gridMenu || !options2.gridMenu.customItems)) {
        _options.gridMenu && _options.gridMenu.customTitle && (_customTitleElm = document.createElement("div"), _customTitleElm.className = "title", _customTitleElm.innerHTML = _options.gridMenu.customTitle, customMenuElm.appendChild(_customTitleElm));
        for (let i = 0, ln = options2.gridMenu.customItems.length; i < ln; i++) {
          let addClickListener = !0, item = options2.gridMenu.customItems[i], callbackArgs = {
            grid: _grid,
            menu: _menuElm,
            columns,
            visibleColumns: getVisibleColumns()
          }, isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-gridmenu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-gridmenu-item-divider"), addClickListener = !1), item.disabled && liElm.classList.add("slick-gridmenu-item-disabled"), item.hidden && liElm.classList.add("slick-gridmenu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
          let iconElm = document.createElement("div");
          iconElm.className = "slick-gridmenu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
          let textElm = document.createElement("span");
          textElm.className = "slick-gridmenu-content", textElm.innerHTML = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), customMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemClick.bind(this, item));
        }
      }
    }
    function populateColumnPicker() {
      _grid.onColumnsReordered.subscribe(updateColumnOrder), _options = Utils.extend({}, _defaults, _options), _options.gridMenu && _options.gridMenu.columnTitle && (_columnTitleElm = document.createElement("div"), _columnTitleElm.className = "title", _columnTitleElm.innerHTML = _options.gridMenu.columnTitle, _menuElm.appendChild(_columnTitleElm)), _bindingEventService.bind(_menuElm, "click", updateColumn), _listElm = document.createElement("span"), _listElm.className = "slick-gridmenu-list", _listElm.role = "menu";
    }
    function recreateGridMenu() {
      deleteMenu(), init(_grid);
    }
    function showGridMenu(e) {
      var targetEvent = e.touches ? e.touches[0] : e;
      e.preventDefault(), Utils.emptyElement(_listElm), Utils.emptyElement(_customMenuElm), populateCustomMenus(_options, _customMenuElm), updateColumnOrder(), columnCheckboxes = [];
      var callbackArgs = {
        grid: _grid,
        menu: _menuElm,
        allColumns: columns,
        visibleColumns: getVisibleColumns()
      };
      if (_options && _options.gridMenu && !runOverrideFunctionWhenExists(_options.gridMenu.menuUsabilityOverride, callbackArgs) || typeof e.stopPropagation == "function" && _self.onBeforeMenuShow.notify(callbackArgs, e, _self).getReturnValue() == !1)
        return;
      let columnId, columnLabel, excludeCssClass;
      for (let i = 0; i < columns.length; i++) {
        columnId = columns[i].id, excludeCssClass = columns[i].excludeFromGridMenu ? "hidden" : "";
        let liElm = document.createElement("li");
        liElm.className = excludeCssClass, liElm.ariaLabel = columns[i] && columns[i].name;
        let checkboxElm = document.createElement("input");
        checkboxElm.type = "checkbox", checkboxElm.id = `${_gridUid}-gridmenu-colpicker-${columnId}`, checkboxElm.dataset.columnid = columns[i].id, liElm.appendChild(checkboxElm), _grid.getColumnIndex(columns[i].id) != null && !columns[i].hidden && (checkboxElm.checked = !0), columnCheckboxes.push(checkboxElm), _options && _options.gridMenu && _options.gridMenu.headerColumnValueExtractor ? columnLabel = _options.gridMenu.headerColumnValueExtractor(columns[i], _gridOptions) : columnLabel = _defaults.headerColumnValueExtractor(columns[i], _gridOptions);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-${columnId}`, labelElm.innerHTML = columnLabel, liElm.appendChild(labelElm), _listElm.appendChild(liElm);
      }
      if (_options.gridMenu && (!_options.gridMenu.hideForceFitButton || !_options.gridMenu.hideSyncResizeButton) && _listElm.appendChild(document.createElement("hr")), !(_options.gridMenu && _options.gridMenu.hideForceFitButton)) {
        let forceFitTitle = _options.gridMenu && _options.gridMenu.forceFitTitle || _defaults.forceFitTitle, liElm = document.createElement("li");
        liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", _listElm.appendChild(liElm);
        let forceFitCheckboxElm = document.createElement("input");
        forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), _grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
      }
      if (!(_options.gridMenu && _options.gridMenu.hideSyncResizeButton)) {
        let syncResizeTitle = _options.gridMenu && _options.gridMenu.syncResizeTitle || _defaults.syncResizeTitle, liElm = document.createElement("li");
        liElm.ariaLabel = syncResizeTitle, _listElm.appendChild(liElm);
        let syncResizeCheckboxElm = document.createElement("input");
        syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), _grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
      }
      let buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
      buttonElm || (buttonElm = e.target.parentElement), _menuElm.style.display = "block", _menuElm.style.opacity = "0";
      let menuIconOffset = Utils.offset(buttonElm), menuWidth = _menuElm.offsetWidth, useClickToRepositionMenu = _options.gridMenu && _options.gridMenu.useClickToRepositionMenu !== void 0 ? _options.gridMenu.useClickToRepositionMenu : _defaults.useClickToRepositionMenu, contentMinWidth = _options.gridMenu && _options.gridMenu.contentMinWidth ? _options.gridMenu.contentMinWidth : _defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, nextPositionTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, nextPositionLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10, menuMarginBottom = _options.gridMenu && _options.gridMenu.marginBottom !== void 0 ? _options.gridMenu.marginBottom : _defaults.marginBottom;
      _menuElm.style.top = `${nextPositionTop + 10}px`, _menuElm.style.left = `${nextPositionLeft - currentMenuWidth + 10}px`, contentMinWidth > 0 && (_menuElm.style.minWidth = `${contentMinWidth}px`), _options.gridMenu && _options.gridMenu.height !== void 0 ? _menuElm.style.height = `${_options.gridMenu.height}px` : _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`, _menuElm.style.display = "block", _menuElm.style.opacity = "1", _menuElm.appendChild(_listElm), _isMenuOpen = !0, typeof e.stopPropagation == "function" && _self.onAfterMenuShow.notify(callbackArgs, e, _self).getReturnValue() == !1;
    }
    function handleBodyMouseDown(event) {
      (_menuElm !== event.target && !(_menuElm && _menuElm.contains(event.target)) && _isMenuOpen || event.target.className === "close") && hideMenu(event);
    }
    function handleMenuItemClick(item, e) {
      let command = item.command || "";
      if (!(item.disabled || item.divider || item === "divider")) {
        if (command != null && command != "") {
          var callbackArgs = {
            grid: _grid,
            command,
            item,
            allColumns: columns,
            visibleColumns: getVisibleColumns()
          };
          _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
        }
        var leaveOpen = !!(_options.gridMenu && _options.gridMenu.leaveOpen);
        !leaveOpen && !e.defaultPrevented && hideMenu(e), e.preventDefault(), e.stopPropagation();
      }
    }
    function hideMenu(e) {
      if (_menuElm) {
        Utils.hide(_menuElm), _isMenuOpen = !1;
        var callbackArgs = {
          grid: _grid,
          menu: _menuElm,
          allColumns: columns,
          visibleColumns: getVisibleColumns()
        };
        if (_self.onMenuClose.notify(callbackArgs, e, _self).getReturnValue() == !1)
          return;
      }
    }
    function updateAllTitles(gridMenuOptions) {
      _customTitleElm && _customTitleElm.innerHTML && (_customTitleElm.innerHTML = gridMenuOptions.customTitle), _columnTitleElm && _columnTitleElm.innerHTML && (_columnTitleElm.innerHTML = gridMenuOptions.columnTitle);
    }
    function updateColumnOrder() {
      for (var current = _grid.getColumns().slice(0), ordered = new Array(columns.length), i = 0; i < ordered.length; i++)
        _grid.getColumnIndex(columns[i].id) === void 0 ? ordered[i] = columns[i] : ordered[i] = current.shift();
      columns = ordered;
    }
    function updateColumn(e) {
      if (e.target.dataset.option === "autoresize") {
        var previousVisibleColumns = getVisibleColumns(), isChecked = e.target.checked;
        _grid.setOptions({ forceFitColumns: isChecked }), _grid.setColumns(previousVisibleColumns);
        return;
      }
      if (e.target.dataset.option === "syncresize") {
        _grid.setOptions({ syncColumnCellResize: !!e.target.checked });
        return;
      }
      if (e.target.type === "checkbox") {
        let isChecked2 = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
        if (columnCheckboxes.forEach((columnCheckbox, idx) => {
          columnCheckbox.checked && (columns[idx].hidden && (columns[idx].hidden = !1), visibleColumns.push(columns[idx]));
        }), !visibleColumns.length) {
          e.target.checked = !0;
          return;
        }
        let callbackArgs = {
          columnId,
          showing: isChecked2,
          grid: _grid,
          allColumns: columns,
          columns: visibleColumns
        };
        _grid.setColumns(visibleColumns), _self.onColumnsChanged.notify(callbackArgs, e, _self);
      }
    }
    init(_grid);
    function getAllColumns() {
      return columns;
    }
    function getVisibleColumns() {
      return _grid.getColumns();
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    Utils.extend(this, {
      init,
      getAllColumns,
      getVisibleColumns,
      destroy,
      deleteMenu,
      recreateGridMenu,
      showGridMenu,
      setOptions,
      updateAllTitles,
      hideMenu,
      onAfterMenuShow: new SlickEvent(),
      onBeforeMenuShow: new SlickEvent(),
      onMenuClose: new SlickEvent(),
      onCommand: new SlickEvent(),
      onColumnsChanged: new SlickEvent()
    });
  }
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.GridMenu = SlickGridMenu);
})();
