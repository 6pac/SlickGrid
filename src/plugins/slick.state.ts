import { SlickEvent as SlickEvent_, Utils as Utils_ } from '../slick.core';
import type { Column, ColumnSort, Plugin } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export interface SlickStateOption {
  /** optional grid state clientId */
  cid: string;

  /** default columns when loadnig the grid */
  defaultColumns: Column[];

  /** local storage key prefix */
  key_prefix: string;

  /** should we scroll the grid into view? */
  scrollRowIntoView: boolean;

  /** local storage wrapper */
  storage: LocalStorageWrapper;
}

export interface CurrentState {
  columns: Array<{ id: string | number; width: number | undefined; }>;
  sortcols: ColumnSort[];
  userData: any;
  viewport: { top: number; bottom: number; leftPx: number; rightPx: number; };
}

class LocalStorageWrapper {
  protected localStorage = window.localStorage;

  constructor() {
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available. slickgrid statepersistor disabled.');
    }
  }

  get<T = any>(key: string) {
    return new Promise<T>((resolve, reject) => {
      if (!localStorage) {
        reject('missing localStorage');
        return
      }
      try {
        const d = localStorage.getItem(key);
        if (d) {
          return resolve(JSON.parse(d) as T);
        }
        resolve({} as T);
      } catch (exc) {
        reject(exc);
      }
    });
  }

  set(key: string, obj: any) {
    if (!localStorage) return;
    if (typeof obj !== 'undefined') {
      obj = JSON.stringify(obj);
    }
    localStorage.setItem(key, obj);
  }
};

export class SlickState implements Plugin {
  // --
  // public API
  pluginName = 'State' as const;
  onStateChanged = new SlickEvent<CurrentState>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _cid = '';
  protected _store: LocalStorageWrapper;
  protected _options: SlickStateOption;
  protected _state?: CurrentState;
  protected _userData = {
    state: null,
    current: null
  };

  constructor(options: Partial<SlickStateOption>) {
    const defaults = {
      key_prefix: 'slickgrid:',
      storage: new LocalStorageWrapper(),
      scrollRowIntoView: true
    };
    this._options = Utils.extend(true, {}, defaults, options);
    this._store = this._options.storage;
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._cid = grid.cid || this._options.cid;
    if (this._cid) {
      this._grid.onColumnsResized.subscribe(this.save.bind(this));
      this._grid.onColumnsReordered.subscribe(this.save.bind(this));
      this._grid.onSort.subscribe(this.save.bind(this));
    } else {
      console.warn('grid has no client id. state persisting is disabled.');
    }
  }

  destroy() {
    this._grid.onSort.unsubscribe(this.save.bind(this));
    this._grid.onColumnsReordered.unsubscribe(this.save.bind(this));
    this._grid.onColumnsResized.unsubscribe(this.save.bind(this));
    this.save();
  }

  save() {
    if (this._cid && this._store) {
      this._state = {
        sortcols: this.getSortColumns(),
        viewport: this._grid.getViewport(),
        columns: this.getColumns(),
        userData: null
      };
      this._state.userData = this._userData.current;
      this.setUserDataFromState(this._state.userData);
      this.onStateChanged.notify(this._state);

      return this._store.set(this._options.key_prefix + this._cid, this._state);
    }
  }

  restore() {
    return new Promise((resolve, reject) => {
      if (!this._cid) {
        reject('missing client id');
        return;
      }
      if (!this._store) {
        reject('missing store');
        return;
      }

      this._store.get<CurrentState>(this._options.key_prefix + this._cid)
        .then((state) => {
          if (state) {
            if (state.sortcols) {
              this._grid.setSortColumns(state.sortcols || []);
            }
            if (state.viewport && this._options.scrollRowIntoView) {
              this._grid.scrollRowIntoView(state.viewport.top, true);
            }
            if (state.columns) {
              const defaultColumns = this._options.defaultColumns;
              if (defaultColumns) {
                const defaultColumnsLookup: Record<number | string, Column> = {};
                defaultColumns.forEach((colDef) => defaultColumnsLookup[colDef.id] = colDef);

                const cols: Array<{ id: string | number; width: number | undefined; }> = [];
                (state.columns || []).forEach((columnDef) => {
                  if (defaultColumnsLookup[columnDef.id]) {
                    cols.push(Utils.extend(true, {}, defaultColumnsLookup[columnDef.id], {
                      width: columnDef.width,
                      headerCssClass: (columnDef as Column).headerCssClass
                    }));
                  }
                });

                state.columns = cols;
              }

              this._grid.setColumns(state.columns as Column[]);
            }
            this.setUserDataFromState(state.userData);
          }
          resolve(state);
        })
        .catch((e) => {
          reject(e);
        })
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
  setUserData(data: any) {
    this._userData.current = data;
    return this;
  }

  /**
   *
   * @internal
   * @param data
   * @return {State}
   */
  setUserDataFromState(data: any) {
    this._userData.state = data;
    return this.setUserData(data);
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
    this._userData.current = this._userData.state;
    return this;
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
    this._store.set(this._options.key_prefix + this._cid, {});
    this.setUserDataFromState(null);
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      State: SlickState
    }
  });
}

