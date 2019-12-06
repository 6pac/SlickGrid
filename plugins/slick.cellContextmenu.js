(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "CellContextMenu": CellContextMenu
      }
    }
  });

  /***
   * A plugin to add Context Menu on a Cell (click on the cell that has the cellContextMenu object defined)
   *
   * USAGE:
   *
   * Add the slick.cellContextmenu.(js|css) files and register it with the grid.
   *
   * To specify a menu in a column header, extend the column definition like so:
   * var cellContextMenuControl = new Slick.Plugins.CellContextMenu(columns, grid, options);
   *
   * Available grid options, by defining a contextMenu object:
   *
   *  var columns = [
   *    {
   *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
   *      cellContextMenu: {
   *        commandTitle: "Commands",
   *        commandItems: [
   *          { command: "delete-row", title: "Delete Row", iconImage: "../images/delete.png", cssClass: "red" },
   *          { divider: true },
   *          { command: "help", title: "Help", iconCssClass: "icon-help" },
   *          { command: "help", title: "Disabled Command", disabled: true },
   *        ],
   *      }
   *    }
   *  ];
   *
   *
   * Available menu Command/Option item properties:
   *    title:            Menu item text.
   *    divider:          Whether the current item is a divider, not an actual command.
   *    disabled:         Whether the item is disabled.
   *    tooltip:          Item tooltip.
   *    command:          A command identifier to be passed to the onCommand event handlers.
   *    cssClass:         A CSS class to be added to the menu item container.
   *    iconCssClass:     A CSS class to be added to the menu item icon.
   *    iconImage:        A url to the icon image.
   *    minWidth:         Minimum width that the drop menu will have
   *    autoAlign:        Auto-align drop menu to the left when not enough viewport space to show on the right
   *    autoAlignOffset:  When drop menu is aligned to the left, it might not be perfectly aligned with the header menu icon, if that is the case you can add an offset (positive/negative number to move right/left)
   *
   *
   * The plugin exposes the following events:
   * 
   *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
   *        Event args:
   *            cell:        Cell or column index          
   *            row:         Row index
   *            grid:        Reference to the grid.
   * 
   *    onBeforeMenuClose:   Fired when the menu is closing.
   *        Event args:
   *            cell:        Cell or column index          
   *            row:         Row index
   *            grid:        Reference to the grid.
   *            menu:        Menu DOM element
   *
   *    onCommand: Fired on menu option clicked from the Command items list
   *        Event args:
   *            cell:        Cell or column index          
   *            row:         Row index
   *            grid:        Reference to the grid.
   *            command:     Menu command identified.
   *            item:        Menu item selected
   *            columnDef:   Cell Column definition
   *            dataContext: Cell Data Context (data object)
   *
   *    onOptionSelected: Fired on menu option clicked from the Option items list
   *        Event args:
   *            cell:        Cell or column index          
   *            row:         Row index
   *            grid:        Reference to the grid.
   *            command:     Menu command identified.
   *            item:        Menu item selected
   *            columnDef:   Cell Column definition
   *            dataContext: Cell Data Context (data object)
   *
   *
   * @param gridOptions {Object} Grid Options
   * @class Slick.Plugins.ContextMenu
   * @constructor
   */
  function CellContextMenu(optionProperties) {
    var _grid;
    var _self = this;
    var $optionTitleElm;
    var $commandTitleElm;
    var _contextMenuProperties;
    var _currentCell = -1;
    var _currentRow = -1;
    var _gridUid = "";
    var _handler = new Slick.EventHandler();
    var _defaults = {
      cssClass: null,
      fadeSpeed: 250,
      minWidth: 180,
      optionShownOverColumnIds: [],
      commandShownOverColumnIds: [],
    };
    var $menu;

    function init(grid) {
      _grid = grid;
      _contextMenuProperties = $.extend(true, {}, _defaults, optionProperties);
      _gridUid = (grid && grid.getUID) ? grid.getUID() : "";
      _handler.subscribe(_grid.onClick, showMenu);
    }

    function setOptions(newOptions) {
      _contextMenuProperties = $.extend(true, {}, _contextMenuProperties, newOptions);

      // on the array properties, we want to make sure to overwrite them and not just extending them
      if (newOptions.commandShownOverColumnIds) {
        _contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds;
      }
      if (newOptions.optionShownOverColumnIds) {
        _contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds;
      }
    }

    function destroy() {
      _self.onBeforeMenuShow.unsubscribe();
      _self.onBeforeMenuClose.unsubscribe();
      _self.onCommand.unsubscribe();
      _self.onOptionSelected.unsubscribe();
      _handler.unsubscribeAll();
      $menu.remove();
    }

    function createMenu(e) {
      var cell = _grid.getCellFromEvent(e);
      _currentCell = cell && cell.cell;
      _currentRow = cell && cell.row;
      var columnDef = _grid.getColumns()[_currentCell];

      // merge the contextMenu of the column definition with the default properties
      _contextMenuProperties = $.extend(true, {}, _contextMenuProperties, columnDef.cellContextMenu);

      var isColumnOptionAllowed = checkIsColumnAllowed(_contextMenuProperties.optionShownOverColumnIds, columnDef.id);
      var isColumnCommandAllowed = checkIsColumnAllowed(_contextMenuProperties.commandShownOverColumnIds, columnDef.id);
      var commandItems = _contextMenuProperties.commandItems || [];
      var optionItems = _contextMenuProperties.optionItems || [];

      // make sure there's at least something to show before creating the Context Menu
      if (!columnDef || !columnDef.cellContextMenu || (!isColumnOptionAllowed && !isColumnCommandAllowed) || (!commandItems.length && optionItems.length)) {
        return;
      }

      // delete any prior context menu
      destroyMenu();

      // Let the user modify the menu or cancel altogether,
      // or provide alternative menu implementation.
      if (_self.onBeforeMenuShow.notify({
        "cell": _currentCell,
        "row": _currentRow,
        "grid": _grid
      }, e, _self) == false) {
        return;
      }

      // create a new context menu
      var menu = $('<div class="slick-cell-context-menu ' + _gridUid + '" style="min-width: ' + _contextMenuProperties.minWidth + 'px" />')
        .css("top", e.pageY)
        .css("left", e.pageX)
        .css("display", "none");

      // -- Option List sub-menu
      if (isColumnOptionAllowed && optionItems.length > 0) {
        var $optionMenu = $('<div class="slick-cell-context-menu-option-list" />');
        $optionMenu.appendTo(menu);
        populateOptionItems(_contextMenuProperties, $optionMenu);
      }

      // -- Command List sub-menu
      if (isColumnCommandAllowed && commandItems.length > 0) {
        var $commandMenu = $('<div class="slick-cell-context-menu-command-list" />');
        $commandMenu.appendTo(menu);
        populateCommandItems(_contextMenuProperties, $commandMenu);
      }

      menu.show();
      menu.appendTo("body");

      return menu;
    }

    function destroyMenu() {
      if ($menu) {
        $menu.remove();
        $menu = null;
      }
    }

    function checkIsColumnAllowed(columnIds, columnId) {
      var isAllowedColumn = false;

      if (columnIds && columnIds.length > 0) {
        for (var o = 0, ln = columnIds.length; o < ln; o++) {
          if (columnIds[o] === columnId) {
            isAllowedColumn = true;
          }
        }
      } else {
        isAllowedColumn = true;
      }
      return isAllowedColumn;
    }

    function showMenu(e, args) {
      e.preventDefault();

      // create the DOM element 
      $menu = createMenu(e, args);

      // reposition the menu to where the user clicked
      if ($menu) {
        $menu
          .data("cell", _currentCell)
          .data("row", _currentRow)
          .show();
      }

      // Hide the menu on outside click.
      $("body").on("mousedown." + _gridUid, handleBodyMouseDown);
    }

    function handleBodyMouseDown(e) {
      if ($menu && $menu[0] != e.target && !$.contains($menu[0], e.target)) {
        closeMenu(e, { cell: _currentCell, row: _currentRow });
      }
    }

    function closeMenu(e, args) {
      if ($menu && $menu.length > 0) {
        if (_self.onBeforeMenuClose.notify({
          "cell": args && args.cell,
          "row": args && args.row,
          "grid": _grid,
          "menu": $menu
        }, e, _self) == false) {
          return;
        }
        $menu.remove();
        $menu = null;
      }
    }

    /** Construct the Option Items sub-menu. */
    function populateOptionItems(contextMenu, $optionMenu) {
      if (!contextMenu || !contextMenu.optionItems) {
        return;
      }

      // user could pass a title on top of the Options section
      if (contextMenu && contextMenu.optionTitle) {
        $optionTitleElm = $('<div class="title"/>').append(contextMenu.optionTitle);
        $optionTitleElm.appendTo($optionMenu);
      }

      for (var i = 0, ln = contextMenu.optionItems.length; i < ln; i++) {
        var item = contextMenu.optionItems[i];

        var $li = $('<div class="slick-cell-context-menu-item"></div>')
          .data("option", item.option || "")
          .data("item", item)
          .on("click", handleMenuItemOptionClick)
          .appendTo($optionMenu);

        if (item.disabled) {
          $li.addClass("slick-cell-context-menu-item-disabled");
        }

        if (item.divider) {
          $li.addClass("slick-cell-context-menu-item-divider");
          continue;
        }

        if (item.cssClass) {
          $li.addClass(item.cssClass);
        }

        if (item.tooltip) {
          $li.attr("title", item.tooltip);
        }

        var $icon = $('<div class="slick-cell-context-menu-icon"></div>')
          .appendTo($li);

        if (item.iconCssClass) {
          $icon.addClass(item.iconCssClass);
        }

        if (item.iconImage) {
          $icon.css("background-image", "url(" + item.iconImage + ")");
        }

        $('<span class="slick-cell-context-menu-content"></span>')
          .text(item.title)
          .appendTo($li);
      }
    }

    /** Construct the Command Items sub-menu. */
    function populateCommandItems(contextMenu, $commandMenu) {
      if (!contextMenu || !contextMenu.commandItems) {
        return;
      }

      // user could pass a title on top of the Commands section
      if (contextMenu && contextMenu.commandTitle) {
        $commandTitleElm = $('<div class="title"/>').append(contextMenu.commandTitle);
        $commandTitleElm.appendTo($commandMenu);
      }

      for (var i = 0, ln = contextMenu.commandItems.length; i < ln; i++) {
        var item = contextMenu.commandItems[i];

        var $li = $('<div class="slick-cell-context-menu-item"></div>')
          .data("command", item.command || "")
          .data("item", item)
          .on("click", handleMenuItemCommandClick)
          .appendTo($commandMenu);

        if (item.disabled) {
          $li.addClass("slick-cell-context-menu-item-disabled");
        }

        if (item.divider) {
          $li.addClass("slick-cell-context-menu-item-divider");
          continue;
        }

        if (item.cssClass) {
          $li.addClass(item.cssClass);
        }

        if (item.tooltip) {
          $li.attr("title", item.tooltip);
        }

        var $icon = $('<div class="slick-cell-context-menu-icon"></div>')
          .appendTo($li);

        if (item.iconCssClass) {
          $icon.addClass(item.iconCssClass);
        }

        if (item.iconImage) {
          $icon.css("background-image", "url(" + item.iconImage + ")");
        }

        $('<span class="slick-cell-context-menu-content"></span>')
          .text(item.title)
          .appendTo($li);
      }
    }

    function handleMenuItemCommandClick(e) {
      var command = $(this).data("command");
      var item = $(this).data("item");

      if (item.disabled || item.divider) {
        return;
      }

      var row = $menu.data("row");
      var cell = $menu.data("cell");

      var columnDef = _grid.getColumns()[cell];
      var dataContext = _grid.getDataItem(row);

      if (command !== null && command !== "") {
        closeMenu(e, { cell: cell, row: row });

        _self.onCommand.notify({
          "cell": cell,
          "row": row,
          "grid": _grid,
          "command": command,
          "item": item,
          "columnDef": columnDef,
          "dataContext": dataContext
        }, e, _self);
      }
    }

    function handleMenuItemOptionClick(e) {
      var option = $(this).data("option");
      var item = $(this).data("item");

      if (item.disabled || item.divider) {
        return;
      }
      if (!_grid.getEditorLock().commitCurrentEdit()) {
        return;
      }

      var row = $menu.data("row");
      var cell = $menu.data("cell");

      var columnDef = _grid.getColumns()[cell];
      var dataContext = _grid.getDataItem(row);

      if (option != null) {
        _self.onOptionSelected.notify({
          "cell": cell,
          "row": row,
          "grid": _grid,
          "option": option,
          "item": item,
          "columnDef": columnDef,
          "dataContext": dataContext
        }, e, _self);
      }
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "pluginName": "ContextMenu",
      "setOptions": setOptions,

      "onBeforeMenuShow": new Slick.Event(),
      "onCommand": new Slick.Event(),
      "onBeforeMenuClose": new Slick.Event(),
      "onOptionSelected": new Slick.Event()
    });
  }
})(jQuery);
