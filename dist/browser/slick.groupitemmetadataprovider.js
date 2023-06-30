"use strict";
(() => {
  // src/slick.groupitemmetadataprovider.js
  var Group = Slick.Group, keyCode = Slick.keyCode, Utils = Slick.Utils;
  function GroupItemMetadataProvider(inputOptions) {
    var _grid, _defaults = {
      checkboxSelect: !1,
      checkboxSelectCssClass: "slick-group-select-checkbox",
      checkboxSelectPlugin: null,
      groupCssClass: "slick-group",
      groupTitleCssClass: "slick-group-title",
      totalsCssClass: "slick-group-totals",
      groupFocusable: !0,
      totalsFocusable: !1,
      toggleCssClass: "slick-group-toggle",
      toggleExpandedCssClass: "expanded",
      toggleCollapsedCssClass: "collapsed",
      enableExpandCollapse: !0,
      groupFormatter: defaultGroupCellFormatter,
      totalsFormatter: defaultTotalsCellFormatter,
      includeHeaderTotals: !1
    }, options = Utils.extend(!0, {}, _defaults, inputOptions);
    function getOptions() {
      return options;
    }
    function setOptions(inputOptions2) {
      Utils.extend(!0, options, inputOptions2);
    }
    function defaultGroupCellFormatter(row, cell, value, columnDef, item, grid) {
      if (!options.enableExpandCollapse)
        return item.title;
      var indentation = item.level * 15 + "px";
      return (options.checkboxSelect ? '<span class="' + options.checkboxSelectCssClass + " " + (item.selectChecked ? "checked" : "unchecked") + '"></span>' : "") + "<span class='" + options.toggleCssClass + " " + (item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) + "' style='margin-left:" + indentation + "'></span><span class='" + options.groupTitleCssClass + "' level='" + item.level + "'>" + item.title + "</span>";
    }
    function defaultTotalsCellFormatter(row, cell, value, columnDef, item, grid) {
      return columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef, grid) || "";
    }
    function init(grid) {
      _grid = grid, _grid.onClick.subscribe(handleGridClick), _grid.onKeyDown.subscribe(handleGridKeyDown);
    }
    function destroy() {
      _grid && (_grid.onClick.unsubscribe(handleGridClick), _grid.onKeyDown.unsubscribe(handleGridKeyDown));
    }
    function handleGridClick(e, args) {
      var target = e.target, item = this.getDataItem(args.row);
      if (item && item instanceof Group && target.classList.contains(options.toggleCssClass || "")) {
        var range = _grid.getRenderedRange();
        this.getData().setRefreshHints({
          ignoreDiffsBefore: range.top,
          ignoreDiffsAfter: range.bottom + 1
        }), item.collapsed ? this.getData().expandGroup(item.groupingKey) : this.getData().collapseGroup(item.groupingKey), e.stopImmediatePropagation(), e.preventDefault();
      }
      if (item && item instanceof Group && target.classList.contains(options.checkboxSelectCssClass)) {
        item.selectChecked = !item.selectChecked, target.classList.remove(item.selectChecked ? "unchecked" : "checked"), target.classList.add(item.selectChecked ? "checked" : "unchecked");
        var rowIndexes = _grid.getData().mapItemsToRows(item.rows);
        (item.selectChecked ? options.checkboxSelectPlugin.selectRows : options.checkboxSelectPlugin.deSelectRows)(rowIndexes);
      }
    }
    function handleGridKeyDown(e, args) {
      if (options.enableExpandCollapse && e.which == keyCode.SPACE) {
        var activeCell = this.getActiveCell();
        if (activeCell) {
          var item = this.getDataItem(activeCell.row);
          if (item && item instanceof Group) {
            var range = _grid.getRenderedRange();
            this.getData().setRefreshHints({
              ignoreDiffsBefore: range.top,
              ignoreDiffsAfter: range.bottom + 1
            }), item.collapsed ? this.getData().expandGroup(item.groupingKey) : this.getData().collapseGroup(item.groupingKey), e.stopImmediatePropagation(), e.preventDefault();
          }
        }
      }
    }
    function getGroupRowMetadata(item) {
      var groupLevel = item && item.level;
      return {
        selectable: !1,
        focusable: options.groupFocusable,
        cssClasses: options.groupCssClass + " slick-group-level-" + groupLevel,
        formatter: options.includeHeaderTotals && options.totalsFormatter,
        columns: {
          0: {
            colspan: options.includeHeaderTotals ? "1" : "*",
            formatter: options.groupFormatter,
            editor: null
          }
        }
      };
    }
    function getTotalsRowMetadata(item) {
      var groupLevel = item && item.group && item.group.level;
      return {
        selectable: !1,
        focusable: options.totalsFocusable,
        cssClasses: options.totalsCssClass + " slick-group-level-" + groupLevel,
        formatter: options.totalsFormatter,
        editor: null
      };
    }
    return {
      init,
      destroy,
      getGroupRowMetadata,
      getTotalsRowMetadata,
      getOptions,
      setOptions
    };
  }
  window.Slick && (window.Slick.Data = window.Slick.Data || {}, window.Slick.Data.GroupItemMetadataProvider = GroupItemMetadataProvider);
})();
