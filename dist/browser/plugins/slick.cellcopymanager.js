"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.cellcopymanager.ts
  var keyCode = Slick.keyCode, SlickEvent = Slick.Event, Utils = Slick.Utils, SlickCellCopyManager = class {
    constructor() {
      // --
      // public API
      __publicField(this, "pluginName", "CellCopyManager");
      __publicField(this, "onCopyCells", new SlickEvent("onCopyCells"));
      __publicField(this, "onCopyCancelled", new SlickEvent("onCopyCancelled"));
      __publicField(this, "onPasteCells", new SlickEvent("onPasteCells"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_copiedRanges", null);
    }
    init(grid) {
      this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));
    }
    destroy() {
      this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
    }
    handleKeyDown(e) {
      var _a, _b, _c;
      let ranges;
      this._grid.getEditorLock().isActive() || (e.which === keyCode.ESCAPE && this._copiedRanges && (e.preventDefault(), this.clearCopySelection(), this.onCopyCancelled.notify({ ranges: this._copiedRanges }), this._copiedRanges = null), e.which === 67 && (e.ctrlKey || e.metaKey) && (ranges = (_b = (_a = this._grid.getSelectionModel()) == null ? void 0 : _a.getSelectedRanges()) != null ? _b : [], ranges.length !== 0 && (e.preventDefault(), this._copiedRanges = ranges, this.markCopySelection(ranges), this.onCopyCells.notify({ ranges }))), e.which === 86 && (e.ctrlKey || e.metaKey) && this._copiedRanges && (e.preventDefault(), ranges = (_c = this._grid.getSelectionModel()) == null ? void 0 : _c.getSelectedRanges(), this.onPasteCells.notify({ from: this._copiedRanges, to: ranges }), this._grid.getOptions().preserveCopiedSelectionOnPaste || (this.clearCopySelection(), this._copiedRanges = null)));
    }
    markCopySelection(ranges) {
      let columns = this._grid.getColumns(), hash = {};
      for (let i = 0; i < ranges.length; i++)
        for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
            hash[j][columns[k].id] = "copied";
        }
      this._grid.setCellCssStyles("copy-manager", hash);
    }
    clearCopySelection() {
      this._grid.removeCellCssStyles("copy-manager");
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellCopyManager: SlickCellCopyManager
    }
  });
})();
//# sourceMappingURL=slick.cellcopymanager.js.map
