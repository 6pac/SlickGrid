"use strict";
(() => {
  // src/plugins/slick.state.js
  var SlickEvent = Slick.Event, Utils = Slick.Utils, localStorageWrapper = function() {
    var localStorage = window.localStorage;
    return typeof localStorage == "undefined" && console.error("localStorage is not available. slickgrid statepersistor disabled."), {
      get: function(key) {
        return new Promise((resolve, reject) => {
          if (!localStorage) {
            reject("missing localStorage");
            return;
          }
          try {
            var d = localStorage.getItem(key);
            if (d)
              return resolve(JSON.parse(d));
            resolve({});
          } catch (exc) {
            reject(exc);
          }
        });
      },
      set: function(key, obj) {
        localStorage && (typeof obj != "undefined" && (obj = JSON.stringify(obj)), localStorage.setItem(key, obj));
      }
    };
  }, defaults = {
    key_prefix: "slickgrid:",
    storage: new localStorageWrapper(),
    scrollRowIntoView: !0
  };
  function State(options) {
    options = Utils.extend(!0, {}, defaults, options);
    var _grid, _cid, _store = options.storage, onStateChanged = new SlickEvent(), userData = {
      state: null,
      current: null
    };
    function init(grid) {
      _grid = grid, _cid = grid.cid || options.cid, _cid ? (_grid.onColumnsResized.subscribe(save), _grid.onColumnsReordered.subscribe(save), _grid.onSort.subscribe(save)) : console.warn("grid has no client id. state persisting is disabled.");
    }
    function destroy() {
      _grid.onSort.unsubscribe(save), _grid.onColumnsReordered.unsubscribe(save), _grid.onColumnsResized.unsubscribe(save), save();
    }
    function save() {
      if (_cid && _store) {
        var state = {
          sortcols: getSortColumns(),
          viewport: _grid.getViewport(),
          columns: getColumns(),
          userData: null
        };
        return state.userData = userData.current, setUserDataFromState(state.userData), onStateChanged.notify(state), _store.set(options.key_prefix + _cid, state);
      }
    }
    function restore() {
      return new Promise((resolve, reject) => {
        if (!_cid) {
          reject("missing client id");
          return;
        }
        if (!_store) {
          reject("missing store");
          return;
        }
        _store.get(options.key_prefix + _cid).then(function(state) {
          if (state) {
            if (state.sortcols && _grid.setSortColumns(state.sortcols || []), state.viewport && options.scrollRowIntoView && _grid.scrollRowIntoView(state.viewport.top, !0), state.columns) {
              var defaultColumns = options.defaultColumns;
              if (defaultColumns) {
                var defaultColumnsLookup = {};
                defaultColumns.forEach(function(colDef) {
                  defaultColumnsLookup[colDef.id] = colDef;
                });
                var cols = [];
                (state.columns || []).forEach(function(columnDef) {
                  defaultColumnsLookup[columnDef.id] && cols.push(Utils.extend(!0, {}, defaultColumnsLookup[columnDef.id], {
                    width: columnDef.width,
                    headerCssClass: columnDef.headerCssClass
                  }));
                }), state.columns = cols;
              }
              _grid.setColumns(state.columns);
            }
            setUserDataFromState(state.userData);
          }
          resolve(state);
        }).catch(function(e) {
          reject(e);
        });
      });
    }
    function setUserData(data) {
      return userData.current = data, this;
    }
    function setUserDataFromState(data) {
      return userData.state = data, setUserData(data);
    }
    function getUserData() {
      return userData.current;
    }
    function getStateUserData() {
      return userData.state;
    }
    function resetUserData() {
      return userData.current = userData.state, this;
    }
    function getColumns() {
      return _grid.getColumns().map(function(col) {
        return {
          id: col.id,
          width: col.width
        };
      });
    }
    function getSortColumns() {
      var sortCols = _grid.getSortColumns();
      return sortCols;
    }
    function reset() {
      _store.set(options.key_prefix + _cid, {}), setUserDataFromState(null);
    }
    Utils.extend(this, {
      init,
      destroy,
      save,
      setUserData,
      resetUserData,
      getUserData,
      getStateUserData,
      restore,
      onStateChanged,
      reset
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      State
    }
  });
})();
//# sourceMappingURL=slick.state.js.map
