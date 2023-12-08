"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.state.ts
  var SlickEvent = Slick.Event, Utils = Slick.Utils, LocalStorageWrapper = class {
    constructor() {
      __publicField(this, "localStorage", window.localStorage);
      typeof localStorage == "undefined" && console.error("localStorage is not available. slickgrid statepersistor disabled.");
    }
    get(key) {
      return new Promise((resolve, reject) => {
        if (!localStorage) {
          reject("missing localStorage");
          return;
        }
        try {
          let d = localStorage.getItem(key);
          if (d)
            return resolve(JSON.parse(d));
          resolve({});
        } catch (exc) {
          reject(exc);
        }
      });
    }
    set(key, obj) {
      localStorage && (typeof obj != "undefined" && (obj = JSON.stringify(obj)), localStorage.setItem(key, obj));
    }
  }, SlickState = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "State");
      __publicField(this, "onStateChanged", new SlickEvent("onStateChanged"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_cid", "");
      __publicField(this, "_store");
      __publicField(this, "_options");
      __publicField(this, "_state");
      __publicField(this, "_userData", {
        state: null,
        current: null
      });
      let defaults = {
        key_prefix: "slickgrid:",
        storage: new LocalStorageWrapper(),
        scrollRowIntoView: !0
      };
      this._options = Utils.extend(!0, {}, defaults, options), this._store = this._options.storage;
    }
    init(grid) {
      this._grid = grid, this._cid = grid.cid || this._options.cid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._cid ? (this._grid.onColumnsResized.subscribe(this.save.bind(this)), this._grid.onColumnsReordered.subscribe(this.save.bind(this)), this._grid.onSort.subscribe(this.save.bind(this))) : console.warn("grid has no client id. state persisting is disabled.");
    }
    destroy() {
      this._grid.onSort.unsubscribe(this.save.bind(this)), this._grid.onColumnsReordered.unsubscribe(this.save.bind(this)), this._grid.onColumnsResized.unsubscribe(this.save.bind(this)), this.save();
    }
    save() {
      if (this._cid && this._store)
        return this._state = {
          sortcols: this.getSortColumns(),
          viewport: this._grid.getViewport(),
          columns: this.getColumns(),
          userData: null
        }, this._state.userData = this._userData.current, this.setUserDataFromState(this._state.userData), this.onStateChanged.notify(this._state), this._store.set(this._options.key_prefix + this._cid, this._state);
    }
    restore() {
      return new Promise((resolve, reject) => {
        if (!this._cid) {
          reject("missing client id");
          return;
        }
        if (!this._store) {
          reject("missing store");
          return;
        }
        this._store.get(this._options.key_prefix + this._cid).then((state) => {
          if (state) {
            if (state.sortcols && this._grid.setSortColumns(state.sortcols || []), state.viewport && this._options.scrollRowIntoView && this._grid.scrollRowIntoView(state.viewport.top, !0), state.columns) {
              let defaultColumns = this._options.defaultColumns;
              if (defaultColumns) {
                let defaultColumnsLookup = {};
                defaultColumns.forEach((colDef) => defaultColumnsLookup[colDef.id] = colDef);
                let cols = [];
                (state.columns || []).forEach((columnDef) => {
                  defaultColumnsLookup[columnDef.id] && cols.push(Utils.extend(!0, {}, defaultColumnsLookup[columnDef.id], {
                    width: columnDef.width,
                    headerCssClass: columnDef.headerCssClass
                  }));
                }), state.columns = cols;
              }
              this._grid.setColumns(state.columns);
            }
            this.setUserDataFromState(state.userData);
          }
          resolve(state);
        }).catch((e) => {
          reject(e);
        });
      });
    }
    /**
     * allows users to add their own data to the grid state
     * this function does not trigger the save() function, so the actual act of writing the state happens in save()
     * therefore, it's necessary to call save() function after setting user-data
     *
     * @param data
     * @return {State}
     */
    setUserData(data) {
      return this._userData.current = data, this;
    }
    /**
     *
     * @internal
     * @param data
     * @return {State}
     */
    setUserDataFromState(data) {
      return this._userData.state = data, this.setUserData(data);
    }
    /**
     * returns current value of user-data
     * @return {Object}
     */
    getUserData() {
      return this._userData.current;
    }
    /**
     * returns user-data found in saved state
     *
     * @return {Object}
     */
    getStateUserData() {
      return this._userData.state;
    }
    /**
     * Sets user-data to the value read from state
     * @return {State}
     */
    resetUserData() {
      return this._userData.current = this._userData.state, this;
    }
    getColumns() {
      return this._grid.getColumns().map((col) => ({
        id: col.id,
        width: col.width
      }));
    }
    getSortColumns() {
      return this._grid.getSortColumns();
    }
    reset() {
      this._store.set(this._options.key_prefix + this._cid, {}), this.setUserDataFromState(null);
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      State: SlickState
    }
  });
})();
//# sourceMappingURL=slick.state.js.map
