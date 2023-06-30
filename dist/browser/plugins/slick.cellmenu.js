"use strict";
(() => {
  // src/plugins/slick.cellmenu.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventData = Slick.EventData, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function CellMenu(optionProperties) {
    let _cellMenuProperties, _currentCell = -1, _currentRow = -1, _grid, _gridOptions, _gridUid = "", _handler = new EventHandler(), _self = this, _commandTitleElm, _optionTitleElm, _menuElm, _bindingEventService = new BindingEventService(), _defaults = {
      autoAdjustDrop: !0,
      // dropup/dropdown
      autoAlignSide: !0,
      // left/right
      autoAdjustDropOffset: 0,
      autoAlignSideOffset: 0,
      hideMenuOnScroll: !0,
      maxHeight: "none",
      width: "auto"
    };
    function init(grid) {
      _grid = grid, _gridOptions = grid.getOptions(), _cellMenuProperties = Utils.extend({}, _defaults, optionProperties), _gridUid = grid && grid.getUID ? grid.getUID() : "", _handler.subscribe(_grid.onClick, handleCellClick), _cellMenuProperties.hideMenuOnScroll && _handler.subscribe(_grid.onScroll, destroyMenu);
    }
    function setOptions(newOptions) {
      _cellMenuProperties = Utils.extend({}, _cellMenuProperties, newOptions);
    }
    function destroy() {
      _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onBeforeMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onOptionSelected.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), _commandTitleElm = null, _optionTitleElm = null, _menuElm = null;
    }
    function createMenu(e) {
      let cell = _grid.getCellFromEvent(e);
      _currentCell = cell && cell.cell, _currentRow = cell && cell.row;
      let columnDef = _grid.getColumns()[_currentCell], dataContext = _grid.getDataItem(_currentRow), commandItems = _cellMenuProperties.commandItems || [], optionItems = _cellMenuProperties.optionItems || [];
      if (!columnDef || !columnDef.cellMenu || !commandItems.length && !optionItems.length || (destroyMenu(), _self.onBeforeMenuShow.notify({
        cell: _currentCell,
        row: _currentRow,
        grid: _grid
      }, e, _self).getReturnValue() == !1))
        return;
      let maxHeight = isNaN(_cellMenuProperties.maxHeight) ? _cellMenuProperties.maxHeight : _cellMenuProperties.maxHeight + "px", width = isNaN(_cellMenuProperties.width) ? _cellMenuProperties.width : _cellMenuProperties.width + "px";
      _menuElm = document.createElement("div"), _menuElm.className = `slick-cell-menu ${_gridUid}`, _menuElm.role = "menu", _menuElm.style.width = width, _menuElm.style.maxHeight = maxHeight, _menuElm.style.top = `${e.pageY + 5}px`, _menuElm.style.left = `${e.pageX}px`, _menuElm.style.display = "none";
      let closeButtonElm = document.createElement("button");
      closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-cell-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !_cellMenuProperties.hideOptionSection && optionItems.length > 0) {
        let optionMenuElm = document.createElement("div");
        optionMenuElm.className = "slick-cell-menu-option-list", optionMenuElm.role = "menu", _cellMenuProperties.hideCloseButton || (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(optionMenuElm), populateOptionItems(
          _cellMenuProperties,
          optionMenuElm,
          optionItems,
          { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
        );
      }
      if (!_cellMenuProperties.hideCommandSection && commandItems.length > 0) {
        let commandMenuElm = document.createElement("div");
        commandMenuElm.className = "slick-cell-menu-command-list", commandMenuElm.role = "menu", !_cellMenuProperties.hideCloseButton && (optionItems.length === 0 || _cellMenuProperties.hideOptionSection) && (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(commandMenuElm), populateCommandItems(
          _cellMenuProperties,
          commandMenuElm,
          commandItems,
          { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
        );
      }
      if (_menuElm.style.display = "block", document.body.appendChild(_menuElm), _self.onAfterMenuShow.notify({
        cell: _currentCell,
        row: _currentRow,
        grid: _grid
      }, e, _self).getReturnValue() != !1)
        return _menuElm;
    }
    function handleCloseButtonClicked(e) {
      e.defaultPrevented || destroyMenu(e);
    }
    function destroyMenu(e, args) {
      if (_menuElm = _menuElm || document.querySelector(".slick-cell-menu." + _gridUid), _menuElm && _menuElm.remove) {
        if (_self.onBeforeMenuClose.notify({
          cell: args && args.cell,
          row: args && args.row,
          grid: _grid,
          menu: _menuElm
        }, e, _self).getReturnValue() == !1)
          return;
        _menuElm.remove(), _menuElm = null;
      }
    }
    function repositionMenu(e) {
      let parentElm = e.target.closest(".slick-cell"), parentOffset = parentElm && Utils.offset(parentElm), menuOffsetLeft = parentElm ? parentOffset.left : e.pageX, menuOffsetTop = parentElm ? parentOffset.top : e.pageY, parentCellWidth = parentElm.offsetWidth || 0, menuHeight = _menuElm && _menuElm.offsetHeight || 0, menuWidth = _menuElm && _menuElm.offsetWidth || _cellMenuProperties.width || 0, rowHeight = _gridOptions.rowHeight, dropOffset = _cellMenuProperties.autoAdjustDropOffset, sideOffset = _cellMenuProperties.autoAlignSideOffset;
      if (_cellMenuProperties.autoAdjustDrop) {
        let spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
        (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (_menuElm.classList.remove("dropdown"), _menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (_menuElm.classList.remove("dropup"), _menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
      }
      if (_cellMenuProperties.autoAlignSide) {
        let gridPos = _grid.getGridPosition();
        (menuOffsetLeft + menuWidth >= gridPos.width ? "left" : "right") === "left" ? (_menuElm.classList.remove("dropright"), _menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - (menuWidth - parentCellWidth) - sideOffset) : (_menuElm.classList.remove("dropleft"), _menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
      }
      _menuElm.style.top = `${menuOffsetTop}px`, _menuElm.style.left = `${menuOffsetLeft}px`;
    }
    function handleCellClick(e, args) {
      e instanceof EventData && (e = e.getNativeEvent());
      let cell = _grid.getCellFromEvent(e), dataContext = _grid.getDataItem(cell.row), columnDef = _grid.getColumns()[cell.cell];
      columnDef && columnDef.cellMenu && e.preventDefault(), _cellMenuProperties = Utils.extend({}, _cellMenuProperties, columnDef.cellMenu), args || (args = {}), args.columnDef = columnDef, args.dataContext = dataContext, args.grid = _grid, runOverrideFunctionWhenExists(_cellMenuProperties.menuUsabilityOverride, args) && (_menuElm = createMenu(e, args), _menuElm && (repositionMenu(e), _menuElm.setAttribute("aria-expanded", "true"), _menuElm.style.display = "block"), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown.bind(this)));
    }
    function handleBodyMouseDown(e) {
      _menuElm != e.target && !(_menuElm && _menuElm.contains(e.target)) && (e.defaultPrevented || closeMenu(e, { cell: _currentCell, row: _currentRow }));
    }
    function closeMenu(e, args) {
      if (_menuElm) {
        if (_self.onBeforeMenuClose.notify({
          cell: args && args.cell,
          row: args && args.row,
          grid: _grid,
          menu: _menuElm
        }, e, _self).getReturnValue() == !1)
          return;
        _menuElm && _menuElm.remove && (_menuElm.remove(), _menuElm = null);
      }
    }
    function populateOptionItems(cellMenu, optionMenuElm, optionItems, args) {
      if (!(!args || !optionItems || !cellMenu)) {
        cellMenu && cellMenu.optionTitle && (_optionTitleElm = document.createElement("div"), _optionTitleElm.className = "title", _optionTitleElm.textContent = cellMenu.optionTitle, optionMenuElm.appendChild(_optionTitleElm));
        for (let i = 0, ln = optionItems.length; i < ln; i++) {
          let addClickListener = !0, item = optionItems[i], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
          let iconElm = document.createElement("div");
          iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
          let textElm = document.createElement("span");
          textElm.className = "slick-cell-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemOptionClick.bind(this, item));
        }
      }
    }
    function populateCommandItems(cellMenu, commandMenuElm, commandItems, args) {
      if (!(!args || !commandItems || !cellMenu)) {
        cellMenu && cellMenu.commandTitle && (_commandTitleElm = document.createElement("div"), _commandTitleElm.className = "title", _commandTitleElm.textContent = cellMenu.commandTitle, commandMenuElm.appendChild(_commandTitleElm));
        for (let i = 0, ln = commandItems.length; i < ln; i++) {
          let addClickListener = !0, item = commandItems[i], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
          let iconElm = document.createElement("div");
          iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
          let textElm = document.createElement("span");
          textElm.className = "slick-cell-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemCommandClick.bind(this, item));
        }
      }
    }
    function handleMenuItemCommandClick(item, e) {
      if (!item || item.disabled || item.divider || item === "divider")
        return;
      let command = item.command || "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row);
      if (command !== null && command !== "") {
        let callbackArgs = {
          cell,
          row,
          grid: _grid,
          command,
          item,
          column: columnDef,
          dataContext
        };
        _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || closeMenu(e, { cell, row });
      }
    }
    function handleMenuItemOptionClick(item, e) {
      if (!item || item.disabled || item.divider || item === "divider" || !_grid.getEditorLock().commitCurrentEdit())
        return;
      let option = item.option !== void 0 ? item.option : "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row);
      if (option !== void 0) {
        let callbackArgs = {
          cell,
          row,
          grid: _grid,
          option,
          item,
          column: columnDef,
          dataContext
        };
        _self.onOptionSelected.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || closeMenu(e, { cell, row });
      }
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    Utils.extend(this, {
      init,
      closeMenu: destroyMenu,
      destroy,
      pluginName: "CellMenu",
      setOptions,
      onAfterMenuShow: new SlickEvent(),
      onBeforeMenuShow: new SlickEvent(),
      onBeforeMenuClose: new SlickEvent(),
      onCommand: new SlickEvent(),
      onOptionSelected: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        CellMenu
      }
    }
  });
})();
