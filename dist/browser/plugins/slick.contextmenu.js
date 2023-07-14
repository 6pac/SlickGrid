"use strict";
(() => {
  // src/plugins/slick.contextmenu.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventData = Slick.EventData, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function ContextMenu(optionProperties) {
    let _contextMenuProperties, _currentCell = -1, _currentRow = -1, _grid, _gridOptions, _gridUid = "", _handler = new EventHandler(), _self = this, _optionTitleElm, _commandTitleElm, _menuElm, _bindingEventService = new BindingEventService(), _defaults = {
      autoAdjustDrop: !0,
      // dropup/dropdown
      autoAlignSide: !0,
      // left/right
      autoAdjustDropOffset: -4,
      autoAlignSideOffset: 0,
      hideMenuOnScroll: !1,
      maxHeight: "none",
      width: "auto",
      optionShownOverColumnIds: [],
      commandShownOverColumnIds: []
    };
    function init(grid) {
      _grid = grid, _gridOptions = grid.getOptions(), _contextMenuProperties = Utils.extend({}, _defaults, optionProperties), _gridUid = grid && grid.getUID ? grid.getUID() : "", _handler.subscribe(_grid.onContextMenu, handleOnContextMenu), _contextMenuProperties.hideMenuOnScroll && _handler.subscribe(_grid.onScroll, destroyMenu);
    }
    function setOptions(newOptions) {
      _contextMenuProperties = Utils.extend({}, _contextMenuProperties, newOptions), newOptions.commandShownOverColumnIds && (_contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds), newOptions.optionShownOverColumnIds && (_contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds);
    }
    function destroy() {
      _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onBeforeMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onOptionSelected.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), _commandTitleElm = null, _optionTitleElm = null, _menuElm = null;
    }
    function createMenu(e) {
      e instanceof EventData && (e = e.getNativeEvent());
      let targetEvent = e.touches ? e.touches[0] : e, cell = _grid.getCellFromEvent(e);
      _currentCell = cell && cell.cell, _currentRow = cell && cell.row;
      let columnDef = _grid.getColumns()[_currentCell], dataContext = _grid.getDataItem(_currentRow), isColumnOptionAllowed = checkIsColumnAllowed(_contextMenuProperties.optionShownOverColumnIds, columnDef.id), isColumnCommandAllowed = checkIsColumnAllowed(_contextMenuProperties.commandShownOverColumnIds, columnDef.id), commandItems = _contextMenuProperties.commandItems || [], optionItems = _contextMenuProperties.optionItems || [];
      if (!columnDef || !isColumnCommandAllowed && !isColumnOptionAllowed || !commandItems.length && !optionItems.length || (destroyMenu(e), _self.onBeforeMenuShow.notify({
        cell: _currentCell,
        row: _currentRow,
        grid: _grid
      }, e, _self).getReturnValue() == !1))
        return;
      let maxHeight = isNaN(_contextMenuProperties.maxHeight) ? _contextMenuProperties.maxHeight : _contextMenuProperties.maxHeight + "px", width = isNaN(_contextMenuProperties.width) ? _contextMenuProperties.width : _contextMenuProperties.width + "px";
      _menuElm = document.createElement("div"), _menuElm.className = `slick-context-menu ${_gridUid}`, _menuElm.role = "menu", _menuElm.style.width = width, _menuElm.style.maxHeight = maxHeight, _menuElm.style.top = `${targetEvent.pageY}px`, _menuElm.style.left = `${targetEvent.pageX}px`, _menuElm.style.display = "none";
      let closeButtonElm = document.createElement("button");
      closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-context-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !_contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
        let optionMenuElm = document.createElement("div");
        optionMenuElm.className = "slick-context-menu-option-list", optionMenuElm.role = "menu", _contextMenuProperties.hideCloseButton || (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(optionMenuElm), populateOptionItems(
          _contextMenuProperties,
          optionMenuElm,
          optionItems,
          { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
        );
      }
      if (!_contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
        let commandMenuElm = document.createElement("div");
        commandMenuElm.className = "slick-context-menu-command-list", commandMenuElm.role = "menu", !_contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || _contextMenuProperties.hideOptionSection) && (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(commandMenuElm), populateCommandItems(
          _contextMenuProperties,
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
      if (_menuElm = _menuElm || document.querySelector(".slick-context-menu." + _gridUid), _menuElm && _menuElm.remove) {
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
    function checkIsColumnAllowed(columnIds, columnId) {
      let isAllowedColumn = !1;
      if (columnIds && columnIds.length > 0)
        for (let o = 0, ln = columnIds.length; o < ln; o++)
          columnIds[o] === columnId && (isAllowedColumn = !0);
      else
        isAllowedColumn = !0;
      return isAllowedColumn;
    }
    function handleOnContextMenu(e, args) {
      e instanceof EventData && (e = e.getNativeEvent()), e.preventDefault();
      let cell = _grid.getCellFromEvent(e), columnDef = _grid.getColumns()[cell.cell], dataContext = _grid.getDataItem(cell.row);
      args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = dataContext, args.grid = _grid, runOverrideFunctionWhenExists(_contextMenuProperties.menuUsabilityOverride, args) && (_menuElm = createMenu(e, args), _menuElm && (repositionMenu(e), _menuElm.style.display = "block"), _bindingEventService.bind(document.body, "click", (e2) => {
        e2.defaultPrevented || destroyMenu(e2, { cell: _currentCell, row: _currentRow });
      }));
    }
    function populateOptionItems(contextMenu, optionMenuElm, optionItems, args) {
      if (!(!args || !optionItems || !contextMenu)) {
        contextMenu && contextMenu.optionTitle && (_optionTitleElm = document.createElement("div"), _optionTitleElm.className = "title", _optionTitleElm.textContent = contextMenu.optionTitle, optionMenuElm.appendChild(_optionTitleElm));
        for (let i = 0, ln = optionItems.length; i < ln; i++) {
          let addClickListener = !0, item = optionItems[i], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
          let iconElm = document.createElement("div");
          iconElm.role = "button", iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
          let textElm = document.createElement("span");
          textElm.className = "slick-context-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemOptionClick.bind(this, item));
        }
      }
    }
    function populateCommandItems(contextMenu, commandMenuElm, commandItems, args) {
      if (!(!args || !commandItems || !contextMenu)) {
        contextMenu && contextMenu.commandTitle && (_commandTitleElm = document.createElement("div"), _commandTitleElm.className = "title", _commandTitleElm.textContent = contextMenu.commandTitle, commandMenuElm.appendChild(_commandTitleElm));
        for (let i = 0, ln = commandItems.length; i < ln; i++) {
          let addClickListener = !0, item = commandItems[i], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
          let iconElm = document.createElement("div");
          iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
          let textElm = document.createElement("span");
          textElm.className = "slick-context-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemCommandClick.bind(this, item));
        }
      }
    }
    function handleMenuItemCommandClick(item, e) {
      if (!item || item.disabled || item.divider)
        return;
      let command = item.command || "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row), cellValue;
      if (Object.prototype.hasOwnProperty.call(dataContext, columnDef && columnDef.field) && (cellValue = dataContext[columnDef.field]), command != null && command !== "") {
        let callbackArgs = {
          cell,
          row,
          grid: _grid,
          command,
          item,
          column: columnDef,
          dataContext,
          value: cellValue
        };
        _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
    }
    function handleMenuItemOptionClick(item, e) {
      if (item.disabled || item.divider || !_grid.getEditorLock().commitCurrentEdit())
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
        _self.onOptionSelected.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
    }
    function repositionMenu(e) {
      let targetEvent = e.touches ? e.touches[0] : e, parentElm = e.target.closest(".slick-cell"), menuOffsetLeft = targetEvent.pageX, menuOffsetTop = parentElm ? Utils.offset(parentElm).top : targetEvent.pageY, menuHeight = _menuElm && _menuElm.offsetHeight || 0, menuWidth = _menuElm && _menuElm.offsetWidth || _contextMenuProperties.width || 0, rowHeight = _gridOptions.rowHeight, dropOffset = _contextMenuProperties.autoAdjustDropOffset, sideOffset = _contextMenuProperties.autoAlignSideOffset;
      if (_contextMenuProperties.autoAdjustDrop) {
        let spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
        (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (_menuElm.classList.remove("dropdown"), _menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (_menuElm.classList.remove("dropup"), _menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
      }
      if (_contextMenuProperties.autoAlignSide) {
        let gridPos = _grid.getGridPosition();
        (menuOffsetLeft + menuWidth >= gridPos.width ? "left" : "right") === "left" ? (_menuElm.classList.remove("dropright"), _menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - menuWidth - sideOffset) : (_menuElm.classList.remove("dropleft"), _menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
      }
      _menuElm.style.top = `${menuOffsetTop}px`, _menuElm.style.left = `${menuOffsetLeft}px`;
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    Utils.extend(this, {
      init,
      closeMenu: destroyMenu,
      destroy,
      pluginName: "ContextMenu",
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
        ContextMenu
      }
    }
  });
})();
//# sourceMappingURL=slick.contextmenu.js.map
