"use strict";
(() => {
  // src/slick.dataview.js
  var SlickEvent = Slick.Event, EventData = Slick.EventData, Group = Slick.Group, GroupTotals = Slick.GroupTotals, Utils = Slick.Utils, GroupItemMetadataProvider = Slick.GroupItemMetadataProvider;
  function DataView(options) {
    var self = this, defaults = {
      groupItemMetadataProvider: null,
      inlineFilters: !1
    }, idProperty = "id", items = [], rows = [], idxById = /* @__PURE__ */ new Map(), rowsById = null, filter = null, updated = null, suspend = !1, isBulkSuspend = !1, bulkDeleteIds = /* @__PURE__ */ new Map(), sortAsc = !0, fastSortField, sortComparer, refreshHints = {}, prevRefreshHints = {}, filterArgs, filteredItems = [], compiledFilter, compiledFilterWithCaching, filterCache = [], _grid = null, groupingInfoDefaults = {
      getter: null,
      formatter: null,
      comparer: function(a, b) {
        return a.value === b.value ? 0 : a.value > b.value ? 1 : -1;
      },
      predefinedValues: [],
      aggregators: [],
      aggregateEmpty: !1,
      aggregateCollapsed: !1,
      aggregateChildGroups: !1,
      collapsed: !1,
      displayTotalsRow: !0,
      lazyTotalsCalculation: !1
    }, groupingInfos = [], groups = [], toggledGroupsByLevel = [], groupingDelimiter = ":|:", selectedRowIds = null, preSelectedRowIdsChangeFn, pagesize = 0, pagenum = 0, totalRows = 0, onSelectedRowIdsChanged = new SlickEvent(), onSetItemsCalled = new SlickEvent(), onRowCountChanged = new SlickEvent(), onRowsChanged = new SlickEvent(), onRowsOrCountChanged = new SlickEvent(), onBeforePagingInfoChanged = new SlickEvent(), onPagingInfoChanged = new SlickEvent(), onGroupExpanded = new SlickEvent(), onGroupCollapsed = new SlickEvent();
    options = Utils.extend(!0, {}, defaults, options);
    function beginUpdate(bulkUpdate) {
      suspend = !0, isBulkSuspend = bulkUpdate === !0;
    }
    function endUpdate() {
      var wasBulkSuspend = isBulkSuspend;
      isBulkSuspend = !1, suspend = !1, wasBulkSuspend && (processBulkDelete(), ensureIdUniqueness()), refresh();
    }
    function destroy() {
      items = [], idxById = null, rowsById = null, filter = null, updated = null, sortComparer = null, filterCache = [], filteredItems = [], compiledFilter = null, compiledFilterWithCaching = null, _grid && _grid.onSelectedRowsChanged && _grid.onCellCssStylesChanged && (_grid.onSelectedRowsChanged.unsubscribe(), _grid.onCellCssStylesChanged.unsubscribe()), self.onRowsOrCountChanged && self.onRowsOrCountChanged.unsubscribe();
    }
    function setRefreshHints(hints) {
      refreshHints = hints;
    }
    function setFilterArgs(args) {
      filterArgs = args;
    }
    function processBulkDelete() {
      if (idxById) {
        for (var id, item, newIdx = 0, i = 0, l = items.length; i < l; i++) {
          if (item = items[i], id = item[idProperty], id === void 0)
            throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
          bulkDeleteIds.has(id) ? idxById.delete(id) : (items[newIdx] = item, idxById.set(id, newIdx), ++newIdx);
        }
        items.length = newIdx, bulkDeleteIds = /* @__PURE__ */ new Map();
      }
    }
    function updateIdxById(startingIndex) {
      if (!(isBulkSuspend || !idxById)) {
        startingIndex = startingIndex || 0;
        for (var id, i = startingIndex, l = items.length; i < l; i++) {
          if (id = items[i][idProperty], id === void 0)
            throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
          idxById.set(id, i);
        }
      }
    }
    function ensureIdUniqueness() {
      if (!(isBulkSuspend || !idxById)) {
        for (var id, i = 0, l = items.length; i < l; i++)
          if (id = items[i][idProperty], id === void 0 || idxById.get(id) !== i)
            throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
      }
    }
    function getItems() {
      return items;
    }
    function getIdPropertyName() {
      return idProperty;
    }
    function setItems(data, objectIdProperty) {
      objectIdProperty !== void 0 && (idProperty = objectIdProperty), items = filteredItems = data, onSetItemsCalled.notify({ idProperty: objectIdProperty, itemCount: items.length }, null, self), idxById = /* @__PURE__ */ new Map(), updateIdxById(), ensureIdUniqueness(), refresh();
    }
    function setPagingOptions(args) {
      onBeforePagingInfoChanged.notify(getPagingInfo(), null, self).getReturnValue() !== !1 && (args.pageSize != null && (pagesize = args.pageSize, pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0), args.pageNum != null && (pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1))), onPagingInfoChanged.notify(getPagingInfo(), null, self), refresh());
    }
    function getPagingInfo() {
      var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
      return { pageSize: pagesize, pageNum: pagenum, totalRows, totalPages, dataView: self };
    }
    function sort(comparer, ascending) {
      sortAsc = ascending, sortComparer = comparer, fastSortField = null, ascending === !1 && items.reverse(), items.sort(comparer), ascending === !1 && items.reverse(), idxById = /* @__PURE__ */ new Map(), updateIdxById(), refresh();
    }
    function fastSort(field, ascending) {
      sortAsc = ascending, fastSortField = field, sortComparer = null;
      var oldToString = Object.prototype.toString;
      Object.prototype.toString = typeof field == "function" ? field : function() {
        return this[field];
      }, ascending === !1 && items.reverse(), items.sort(), Object.prototype.toString = oldToString, ascending === !1 && items.reverse(), idxById = /* @__PURE__ */ new Map(), updateIdxById(), refresh();
    }
    function reSort() {
      sortComparer ? sort(sortComparer, sortAsc) : fastSortField && fastSort(fastSortField, sortAsc);
    }
    function getFilteredItems() {
      return filteredItems;
    }
    function getFilteredItemCount() {
      return filteredItems.length;
    }
    function getFilter() {
      return filter;
    }
    function setFilter(filterFn) {
      filter = filterFn, options.inlineFilters && (compiledFilter = compileFilter(), compiledFilterWithCaching = compileFilterWithCaching()), refresh();
    }
    function getGrouping() {
      return groupingInfos;
    }
    function setGrouping(groupingInfo) {
      options.groupItemMetadataProvider || (options.groupItemMetadataProvider = new GroupItemMetadataProvider()), groups = [], toggledGroupsByLevel = [], groupingInfo = groupingInfo || [], groupingInfos = groupingInfo instanceof Array ? groupingInfo : [groupingInfo];
      for (var i = 0; i < groupingInfos.length; i++) {
        var gi = groupingInfos[i] = Utils.extend(!0, {}, groupingInfoDefaults, groupingInfos[i]);
        gi.getterIsAFn = typeof gi.getter == "function", gi.compiledAccumulators = [];
        for (var idx = gi.aggregators.length; idx--; )
          gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
        toggledGroupsByLevel[i] = {};
      }
      refresh();
    }
    function groupBy(valueGetter, valueFormatter, sortComparer2) {
      if (valueGetter == null) {
        setGrouping([]);
        return;
      }
      setGrouping({
        getter: valueGetter,
        formatter: valueFormatter,
        comparer: sortComparer2
      });
    }
    function setAggregators(groupAggregators, includeCollapsed) {
      if (!groupingInfos.length)
        throw new Error("[SlickGrid DataView] At least one grouping must be specified before calling setAggregators().");
      groupingInfos[0].aggregators = groupAggregators, groupingInfos[0].aggregateCollapsed = includeCollapsed, setGrouping(groupingInfos);
    }
    function getItemByIdx(i) {
      return items[i];
    }
    function getIdxById(id) {
      return idxById && idxById.get(id);
    }
    function ensureRowsByIdCache() {
      if (!rowsById) {
        rowsById = {};
        for (var i = 0, l = rows.length; i < l; i++)
          rowsById[rows[i][idProperty]] = i;
      }
    }
    function getRowByItem(item) {
      return ensureRowsByIdCache(), rowsById[item[idProperty]];
    }
    function getRowById(id) {
      return ensureRowsByIdCache(), rowsById[id];
    }
    function getItemById(id) {
      return items[idxById && idxById.get(id)];
    }
    function mapItemsToRows(itemArray) {
      var rows2 = [];
      ensureRowsByIdCache();
      for (var i = 0, l = itemArray.length; i < l; i++) {
        var row = rowsById[itemArray[i][idProperty]];
        row != null && (rows2[rows2.length] = row);
      }
      return rows2;
    }
    function mapIdsToRows(idArray) {
      var rows2 = [];
      ensureRowsByIdCache();
      for (var i = 0, l = idArray.length; i < l; i++) {
        var row = rowsById[idArray[i]];
        row != null && (rows2[rows2.length] = row);
      }
      return rows2;
    }
    function mapRowsToIds(rowArray) {
      for (var ids = [], i = 0, l = rowArray.length; i < l; i++)
        if (rowArray[i] < rows.length) {
          let rowItem = rows[rowArray[i]];
          ids[ids.length] = rowItem && rowItem[idProperty];
        }
      return ids;
    }
    function updateSingleItem(id, item) {
      if (idxById) {
        if (!idxById.has(id))
          throw new Error("[SlickGrid DataView] Invalid id");
        if (id !== item[idProperty]) {
          var newId = item[idProperty];
          if (newId == null)
            throw new Error("[SlickGrid DataView] Cannot update item to associate with a null id");
          if (idxById.has(newId))
            throw new Error("[SlickGrid DataView] Cannot update item to associate with a non-unique id");
          idxById.set(newId, idxById.get(id)), idxById.delete(id), updated && updated[id] && delete updated[id], id = newId;
        }
        items[idxById.get(id)] = item, updated || (updated = {}), updated[id] = !0;
      }
    }
    function updateItem(id, item) {
      updateSingleItem(id, item), refresh();
    }
    function updateItems(ids, newItems) {
      if (ids.length !== newItems.length)
        throw new Error("[SlickGrid DataView] Mismatch on the length of ids and items provided to update");
      for (var i = 0, l = newItems.length; i < l; i++)
        updateSingleItem(ids[i], newItems[i]);
      refresh();
    }
    function insertItem(insertBefore, item) {
      items.splice(insertBefore, 0, item), updateIdxById(insertBefore), refresh();
    }
    function insertItems(insertBefore, newItems) {
      Array.prototype.splice.apply(items, [insertBefore, 0].concat(newItems)), updateIdxById(insertBefore), refresh();
    }
    function addItem(item) {
      items.push(item), updateIdxById(items.length - 1), refresh();
    }
    function addItems(newItems) {
      items = items.concat(newItems), updateIdxById(items.length - newItems.length), refresh();
    }
    function deleteItem(id) {
      if (idxById)
        if (isBulkSuspend)
          bulkDeleteIds.set(id, !0);
        else {
          var idx = idxById.get(id);
          if (idx === void 0)
            throw new Error("[SlickGrid DataView] Invalid id");
          idxById.delete(id), items.splice(idx, 1), updateIdxById(idx), refresh();
        }
    }
    function deleteItems(ids) {
      if (!(ids.length === 0 || !idxById))
        if (isBulkSuspend)
          for (var i = 0, l = ids.length; i < l; i++) {
            var id = ids[i], idx = idxById.get(id);
            if (idx === void 0)
              throw new Error("[SlickGrid DataView] Invalid id");
            bulkDeleteIds.set(id, !0);
          }
        else {
          for (var indexesToDelete = [], i = 0, l = ids.length; i < l; i++) {
            var id = ids[i], idx = idxById.get(id);
            if (idx === void 0)
              throw new Error("[SlickGrid DataView] Invalid id");
            idxById.delete(id), indexesToDelete.push(idx);
          }
          indexesToDelete.sort();
          for (var i = indexesToDelete.length - 1; i >= 0; --i)
            items.splice(indexesToDelete[i], 1);
          updateIdxById(indexesToDelete[0]), refresh();
        }
    }
    function sortedAddItem(item) {
      if (!sortComparer)
        throw new Error("[SlickGrid DataView] sortedAddItem() requires a sort comparer, use sort()");
      insertItem(sortedIndex(item), item);
    }
    function sortedUpdateItem(id, item) {
      if (idxById) {
        if (!idxById.has(id) || id !== item[idProperty])
          throw new Error("[SlickGrid DataView] Invalid or non-matching id " + idxById.get(id));
        if (!sortComparer)
          throw new Error("[SlickGrid DataView] sortedUpdateItem() requires a sort comparer, use sort()");
        var oldItem = getItemById(id);
        sortComparer(oldItem, item) !== 0 ? (deleteItem(id), sortedAddItem(item)) : updateItem(id, item);
      }
    }
    function sortedIndex(searchItem) {
      for (var low = 0, high = items.length; low < high; ) {
        var mid = low + high >>> 1;
        sortComparer(items[mid], searchItem) === -1 ? low = mid + 1 : high = mid;
      }
      return low;
    }
    function getItemCount() {
      return items.length;
    }
    function getLength() {
      return rows.length;
    }
    function getItem(i) {
      var item = rows[i];
      if (item && item.__group && item.totals && !item.totals.initialized) {
        var gi = groupingInfos[item.level];
        gi.displayTotalsRow || (calculateTotals(item.totals), item.title = gi.formatter ? gi.formatter(item) : item.value);
      } else
        item && item.__groupTotals && !item.initialized && calculateTotals(item);
      return item;
    }
    function getItemMetadata(i) {
      var item = rows[i];
      return item === void 0 ? null : item.__group ? options.groupItemMetadataProvider.getGroupRowMetadata(item) : item.__groupTotals ? options.groupItemMetadataProvider.getTotalsRowMetadata(item) : null;
    }
    function expandCollapseAllGroups(level, collapse) {
      if (level == null)
        for (var i = 0; i < groupingInfos.length; i++)
          toggledGroupsByLevel[i] = {}, groupingInfos[i].collapsed = collapse, collapse === !0 ? onGroupCollapsed.notify({ level: i, groupingKey: null }) : onGroupExpanded.notify({ level: i, groupingKey: null });
      else
        toggledGroupsByLevel[level] = {}, groupingInfos[level].collapsed = collapse, collapse === !0 ? onGroupCollapsed.notify({ level, groupingKey: null }) : onGroupExpanded.notify({ level, groupingKey: null });
      refresh();
    }
    function collapseAllGroups(level) {
      expandCollapseAllGroups(level, !0);
    }
    function expandAllGroups(level) {
      expandCollapseAllGroups(level, !1);
    }
    function expandCollapseGroup(level, groupingKey, collapse) {
      toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse, refresh();
    }
    function collapseGroup(varArgs) {
      var args = Array.prototype.slice.call(arguments), arg0 = args[0], groupingKey, level;
      args.length === 1 && arg0.indexOf(groupingDelimiter) !== -1 ? (groupingKey = arg0, level = arg0.split(groupingDelimiter).length - 1) : (groupingKey = args.join(groupingDelimiter), level = args.length - 1), expandCollapseGroup(level, groupingKey, !0), onGroupCollapsed.notify({ level, groupingKey });
    }
    function expandGroup(varArgs) {
      var args = Array.prototype.slice.call(arguments), arg0 = args[0], groupingKey, level;
      args.length === 1 && arg0.indexOf(groupingDelimiter) !== -1 ? (level = arg0.split(groupingDelimiter).length - 1, groupingKey = arg0) : (level = args.length - 1, groupingKey = args.join(groupingDelimiter)), expandCollapseGroup(level, groupingKey, !1), onGroupExpanded.notify({ level, groupingKey });
    }
    function getGroups() {
      return groups;
    }
    function extractGroups(rows2, parentGroup) {
      for (var group, val, groups2 = [], groupsByVal = {}, r, level = parentGroup ? parentGroup.level + 1 : 0, gi = groupingInfos[level], i = 0, l = gi.predefinedValues.length; i < l; i++)
        val = gi.predefinedValues[i], group = groupsByVal[val], group || (group = new Group(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : "") + val, groups2[groups2.length] = group, groupsByVal[val] = group);
      for (var i = 0, l = rows2.length; i < l; i++)
        r = rows2[i], val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter], group = groupsByVal[val], group || (group = new Group(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : "") + val, groups2[groups2.length] = group, groupsByVal[val] = group), group.rows[group.count++] = r;
      if (level < groupingInfos.length - 1)
        for (var i = 0; i < groups2.length; i++)
          group = groups2[i], group.groups = extractGroups(group.rows, group);
      return groups2.length && addTotals(groups2, level), groups2.sort(groupingInfos[level].comparer), groups2;
    }
    function calculateTotals(totals) {
      var group = totals.group, gi = groupingInfos[group.level], isLeafLevel = group.level == groupingInfos.length, agg, idx = gi.aggregators.length;
      if (!isLeafLevel && gi.aggregateChildGroups)
        for (var i = group.groups.length; i--; )
          group.groups[i].totals.initialized || calculateTotals(group.groups[i].totals);
      for (; idx--; )
        agg = gi.aggregators[idx], agg.init(), !isLeafLevel && gi.aggregateChildGroups ? gi.compiledAccumulators[idx].call(agg, group.groups) : gi.compiledAccumulators[idx].call(agg, group.rows), agg.storeResult(totals);
      totals.initialized = !0;
    }
    function addGroupTotals(group) {
      var gi = groupingInfos[group.level], totals = new GroupTotals();
      totals.group = group, group.totals = totals, gi.lazyTotalsCalculation || calculateTotals(totals);
    }
    function addTotals(groups2, level) {
      level = level || 0;
      for (var gi = groupingInfos[level], groupCollapsed = gi.collapsed, toggledGroups = toggledGroupsByLevel[level], idx = groups2.length, g; idx--; )
        g = groups2[idx], !(g.collapsed && !gi.aggregateCollapsed) && (g.groups && addTotals(g.groups, level + 1), gi.aggregators.length && (gi.aggregateEmpty || g.rows.length || g.groups && g.groups.length) && addGroupTotals(g), g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey], g.title = gi.formatter ? gi.formatter(g) : g.value);
    }
    function flattenGroupedRows(groups2, level) {
      level = level || 0;
      for (var gi = groupingInfos[level], groupedRows = [], rows2, gl = 0, g, i = 0, l = groups2.length; i < l; i++) {
        if (g = groups2[i], groupedRows[gl++] = g, !g.collapsed) {
          rows2 = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
          for (var j = 0, jj = rows2.length; j < jj; j++)
            groupedRows[gl++] = rows2[j];
        }
        g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed) && (groupedRows[gl++] = g.totals);
      }
      return groupedRows;
    }
    function getFunctionInfo(fn) {
      var fnStr = fn.toString(), usingEs5 = fnStr.indexOf("function") >= 0, fnRegex = usingEs5 ? /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/ : /^[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/, matches = fn.toString().match(fnRegex);
      return {
        params: matches[1].split(","),
        body: matches[2]
      };
    }
    function compileAccumulatorLoop(aggregator) {
      if (aggregator.accumulate) {
        var accumulatorInfo = getFunctionInfo(aggregator.accumulate), fn = new Function(
          "_items",
          "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" + accumulatorInfo.params[0] + " = _items[_i]; " + accumulatorInfo.body + "}"
        ), fnName = "compiledAccumulatorLoop";
        return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
      } else
        return function() {
        };
    }
    function compileFilter() {
      var filterInfo = getFunctionInfo(filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
        /return ([^;}]+?)\s*([;}]|$)/gi,
        "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
      ), tpl = [
        //"function(_items, _args) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
      var fn = new Function("_items,_args", tpl), fnName = "compiledFilter";
      return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
    }
    function compileFilterWithCaching() {
      var filterInfo = getFunctionInfo(filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
        /return ([^;}]+?)\s*([;}]|$)/gi,
        "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
      ), tpl = [
        //"function(_items, _args, _cache) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "if (_cache[_i]) { ",
        "_retval[_idx++] = $item$; ",
        "continue _coreloop; ",
        "} ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
      var fn = new Function("_items,_args,_cache", tpl), fnName = "compiledFilterWithCaching";
      return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
    }
    function setFunctionName(fn, fnName) {
      try {
        Object.defineProperty(fn, "name", {
          writable: !0,
          value: fnName
        });
      } catch (err) {
        fn.name = fnName;
      }
    }
    function uncompiledFilter(items2, args) {
      for (var retval = [], idx = 0, i = 0, ii = items2.length; i < ii; i++)
        filter(items2[i], args) && (retval[idx++] = items2[i]);
      return retval;
    }
    function uncompiledFilterWithCaching(items2, args, cache) {
      for (var retval = [], idx = 0, item, i = 0, ii = items2.length; i < ii; i++)
        item = items2[i], cache[i] ? retval[idx++] = item : filter(item, args) && (retval[idx++] = item, cache[i] = !0);
      return retval;
    }
    function getFilteredAndPagedItems(items2) {
      if (filter) {
        var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter, batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;
        refreshHints.isFilterNarrowing ? filteredItems = batchFilter(filteredItems, filterArgs) : refreshHints.isFilterExpanding ? filteredItems = batchFilterWithCaching(items2, filterArgs, filterCache) : refreshHints.isFilterUnchanged || (filteredItems = batchFilter(items2, filterArgs));
      } else
        filteredItems = pagesize ? items2 : items2.concat();
      var paged;
      return pagesize ? (filteredItems.length <= pagenum * pagesize && (filteredItems.length === 0 ? pagenum = 0 : pagenum = Math.floor((filteredItems.length - 1) / pagesize)), paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize)) : paged = filteredItems, { totalRows: filteredItems.length, rows: paged };
    }
    function getRowDiffs(rows2, newRows) {
      var item, r, eitherIsNonData, diff = [], from = 0, to = Math.max(newRows.length, rows2.length);
      refreshHints && refreshHints.ignoreDiffsBefore && (from = Math.max(
        0,
        Math.min(newRows.length, refreshHints.ignoreDiffsBefore)
      )), refreshHints && refreshHints.ignoreDiffsAfter && (to = Math.min(
        newRows.length,
        Math.max(0, refreshHints.ignoreDiffsAfter)
      ));
      for (var i = from, rl = rows2.length; i < to; i++)
        i >= rl ? diff[diff.length] = i : (item = newRows[i], r = rows2[i], (!item || groupingInfos.length && (eitherIsNonData = item.__nonDataRow || r.__nonDataRow) && item.__group !== r.__group || item.__group && !item.equals(r) || eitherIsNonData && // no good way to compare totals since they are arbitrary DTOs
        // deep object comparison is pretty expensive
        // always considering them 'dirty' seems easier for the time being
        (item.__groupTotals || r.__groupTotals) || item[idProperty] != r[idProperty] || updated && updated[item[idProperty]]) && (diff[diff.length] = i));
      return diff;
    }
    function recalc(_items) {
      rowsById = null, (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing || refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) && (filterCache = []);
      var filteredItems2 = getFilteredAndPagedItems(_items);
      totalRows = filteredItems2.totalRows;
      var newRows = filteredItems2.rows;
      groups = [], groupingInfos.length && (groups = extractGroups(newRows), groups.length && (newRows = flattenGroupedRows(groups)));
      var diff = getRowDiffs(rows, newRows);
      return rows = newRows, diff;
    }
    function refresh() {
      if (!suspend) {
        var previousPagingInfo = Utils.extend(!0, {}, getPagingInfo()), countBefore = rows.length, totalRowsBefore = totalRows, diff = recalc(items, filter);
        pagesize && totalRows < pagenum * pagesize && (pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1), diff = recalc(items, filter)), updated = null, prevRefreshHints = refreshHints, refreshHints = {}, totalRowsBefore !== totalRows && onBeforePagingInfoChanged.notify(previousPagingInfo, null, self) !== !1 && onPagingInfoChanged.notify(getPagingInfo(), null, self), countBefore !== rows.length && onRowCountChanged.notify({ previous: countBefore, current: rows.length, itemCount: items.length, dataView: self, callingOnRowsChanged: diff.length > 0 }, null, self), diff.length > 0 && onRowsChanged.notify({ rows: diff, itemCount: items.length, dataView: self, calledOnRowCountChanged: countBefore !== rows.length }, null, self), (countBefore !== rows.length || diff.length > 0) && onRowsOrCountChanged.notify({
          rowsDiff: diff,
          previousRowCount: countBefore,
          currentRowCount: rows.length,
          itemCount: items.length,
          rowCountChanged: countBefore !== rows.length,
          rowsChanged: diff.length > 0,
          dataView: self
        }, null, self);
      }
    }
    function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
      var self2 = this;
      _grid = grid;
      var inHandler;
      selectedRowIds = self2.mapRowsToIds(grid.getSelectedRows());
      function setSelectedRowIds(rowIds) {
        rowIds === !1 ? selectedRowIds = [] : selectedRowIds.sort().join(",") !== rowIds.sort().join(",") && (selectedRowIds = rowIds);
      }
      function update() {
        if (selectedRowIds.length > 0 && !inHandler) {
          inHandler = !0;
          var selectedRows = self2.mapIdsToRows(selectedRowIds);
          if (!preserveHidden) {
            var selectedRowsChangedArgs = {
              grid: _grid,
              ids: self2.mapRowsToIds(selectedRows),
              rows: selectedRows,
              dataView: self2
            };
            preSelectedRowIdsChangeFn(selectedRowsChangedArgs), onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
              selectedRowIds,
              filteredIds: self2.getAllSelectedFilteredIds()
            }), new EventData(), self2);
          }
          grid.setSelectedRows(selectedRows), inHandler = !1;
        }
      }
      return grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (!inHandler) {
          var newSelectedRowIds = self2.mapRowsToIds(args.rows), selectedRowsChangedArgs = {
            grid: _grid,
            ids: newSelectedRowIds,
            rows: args.rows,
            added: !0,
            dataView: self2
          };
          preSelectedRowIdsChangeFn(selectedRowsChangedArgs), onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
            selectedRowIds,
            filteredIds: self2.getAllSelectedFilteredIds()
          }), new EventData(), self2);
        }
      }), preSelectedRowIdsChangeFn = function(args) {
        if (!inHandler) {
          inHandler = !0;
          var overwrite = typeof args.added == "undefined";
          if (overwrite)
            setSelectedRowIds(args.ids);
          else {
            var rowIds;
            if (args.added)
              if (preserveHiddenOnSelectionChange && grid.getOptions().multiSelect) {
                var hiddenSelectedRowIds = selectedRowIds.filter(function(id) {
                  return self2.getRowById(id) === void 0;
                });
                rowIds = hiddenSelectedRowIds.concat(args.ids);
              } else
                rowIds = args.ids;
            else
              preserveHiddenOnSelectionChange && grid.getOptions().multiSelect ? rowIds = selectedRowIds.filter(function(id) {
                return args.ids.indexOf(id) === -1;
              }) : rowIds = [];
            setSelectedRowIds(rowIds);
          }
          inHandler = !1;
        }
      }, this.onRowsOrCountChanged.subscribe(update), onSelectedRowIdsChanged;
    }
    function getAllSelectedIds() {
      return selectedRowIds;
    }
    function getAllSelectedFilteredIds() {
      return getAllSelectedFilteredItems().map(function(item) {
        return item[idProperty];
      });
    }
    function setSelectedIds(selectedIds, options2) {
      var isRowBeingAdded = options2 && options2.isRowBeingAdded, shouldTriggerEvent = options2 && options2.shouldTriggerEvent, applyRowSelectionToGrid = options2 && options2.applyRowSelectionToGrid;
      isRowBeingAdded !== !1 && (isRowBeingAdded = !0);
      var selectedRows = self.mapIdsToRows(selectedIds), selectedRowsChangedArgs = {
        grid: _grid,
        ids: selectedIds,
        rows: selectedRows,
        added: isRowBeingAdded,
        dataView: self
      };
      preSelectedRowIdsChangeFn(selectedRowsChangedArgs), shouldTriggerEvent !== !1 && onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
        selectedRowIds,
        filteredIds: self.getAllSelectedFilteredIds()
      }), new EventData(), self), applyRowSelectionToGrid !== !1 && _grid && _grid.setSelectedRows(selectedRows);
    }
    function getAllSelectedItems() {
      var selectedData = [], selectedIds = getAllSelectedIds();
      return selectedIds.forEach(function(id) {
        selectedData.push(self.getItemById(id));
      }), selectedData;
    }
    function getAllSelectedFilteredItems() {
      if (!Array.isArray(selectedRowIds))
        return [];
      var intersection = filteredItems.filter(function(a) {
        return selectedRowIds.some(function(b) {
          return a[idProperty] === b;
        });
      });
      return intersection || [];
    }
    function syncGridCellCssStyles(grid, key) {
      var hashById, inHandler;
      storeCellCssStyles(grid.getCellCssStyles(key));
      function storeCellCssStyles(hash) {
        hashById = {};
        for (var row in hash) {
          var id = rows[row][idProperty];
          hashById[id] = hash[row];
        }
      }
      function update() {
        if (hashById) {
          inHandler = !0, ensureRowsByIdCache();
          var newHash = {};
          for (var id in hashById) {
            var row = rowsById[id];
            row != null && (newHash[row] = hashById[id]);
          }
          grid.setCellCssStyles(key, newHash), inHandler = !1;
        }
      }
      grid.onCellCssStylesChanged.subscribe(function(e, args) {
        debugger;
        inHandler || key == args.key && (args.hash ? storeCellCssStyles(args.hash) : (grid.onCellCssStylesChanged.unsubscribe(), self.onRowsOrCountChanged.unsubscribe(update)));
      }), this.onRowsOrCountChanged.subscribe(update);
    }
    Utils.extend(this, {
      // methods
      beginUpdate,
      endUpdate,
      destroy,
      setPagingOptions,
      getPagingInfo,
      getIdPropertyName,
      getItems,
      setItems,
      setFilter,
      getFilter,
      getFilteredItems,
      getFilteredItemCount,
      sort,
      fastSort,
      reSort,
      setGrouping,
      getGrouping,
      groupBy,
      setAggregators,
      collapseAllGroups,
      expandAllGroups,
      collapseGroup,
      expandGroup,
      getGroups,
      getAllSelectedIds,
      getAllSelectedItems,
      getAllSelectedFilteredIds,
      getAllSelectedFilteredItems,
      setSelectedIds,
      getIdxById,
      getRowByItem,
      getRowById,
      getItemById,
      getItemByIdx,
      mapItemsToRows,
      mapRowsToIds,
      mapIdsToRows,
      setRefreshHints,
      setFilterArgs,
      refresh,
      updateItem,
      updateItems,
      insertItem,
      insertItems,
      addItem,
      addItems,
      deleteItem,
      deleteItems,
      sortedAddItem,
      sortedUpdateItem,
      syncGridSelection,
      syncGridCellCssStyles,
      // data provider methods
      getItemCount,
      getLength,
      getItem,
      getItemMetadata,
      // events
      onSelectedRowIdsChanged,
      // NOTE this will only work when used with "syncGridSelection"
      onSetItemsCalled,
      onRowCountChanged,
      onRowsChanged,
      onRowsOrCountChanged,
      onBeforePagingInfoChanged,
      onPagingInfoChanged,
      onGroupExpanded,
      onGroupCollapsed
    });
  }
  function AvgAggregator(field) {
    this.field_ = field, this.init = function() {
      this.count_ = 0, this.nonNullCount_ = 0, this.sum_ = 0;
    }, this.accumulate = function(item) {
      var val = item[this.field_];
      this.count_++, val != null && val !== "" && !isNaN(val) && (this.nonNullCount_++, this.sum_ += parseFloat(val));
    }, this.storeResult = function(groupTotals) {
      groupTotals.avg || (groupTotals.avg = {}), this.nonNullCount_ !== 0 && (groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_);
    };
  }
  function MinAggregator(field) {
    this.field_ = field, this.init = function() {
      this.min_ = null;
    }, this.accumulate = function(item) {
      var val = item[this.field_];
      val != null && val !== "" && !isNaN(val) && (this.min_ == null || val < this.min_) && (this.min_ = val);
    }, this.storeResult = function(groupTotals) {
      groupTotals.min || (groupTotals.min = {}), groupTotals.min[this.field_] = this.min_;
    };
  }
  function MaxAggregator(field) {
    this.field_ = field, this.init = function() {
      this.max_ = null;
    }, this.accumulate = function(item) {
      var val = item[this.field_];
      val != null && val !== "" && !isNaN(val) && (this.max_ == null || val > this.max_) && (this.max_ = val);
    }, this.storeResult = function(groupTotals) {
      groupTotals.max || (groupTotals.max = {}), groupTotals.max[this.field_] = this.max_;
    };
  }
  function SumAggregator(field) {
    this.field_ = field, this.init = function() {
      this.sum_ = null;
    }, this.accumulate = function(item) {
      var val = item[this.field_];
      val != null && val !== "" && !isNaN(val) && (this.sum_ += parseFloat(val));
    }, this.storeResult = function(groupTotals) {
      groupTotals.sum || (groupTotals.sum = {}), groupTotals.sum[this.field_] = this.sum_;
    };
  }
  function CountAggregator(field) {
    this.field_ = field, this.init = function() {
    }, this.storeResult = function(groupTotals) {
      groupTotals.count || (groupTotals.count = {}), groupTotals.count[this.field_] = groupTotals.group.rows.length;
    };
  }
  var Aggregators = {
    Avg: AvgAggregator,
    Min: MinAggregator,
    Max: MaxAggregator,
    Sum: SumAggregator,
    Count: CountAggregator
  };
  window.Slick && (window.Slick.Data = window.Slick.Data || {}, window.Slick.Data.DataView = DataView, window.Slick.Data.Aggregators = Aggregators);
})();
