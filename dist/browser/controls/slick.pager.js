"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/controls/slick.pager.ts
  var BindingEventService = Slick.BindingEventService, SlickGlobalEditorLock = Slick.GlobalEditorLock, Utils = Slick.Utils, SlickGridPager = class {
    constructor(dataView, grid, selectorOrElm, options) {
      this.dataView = dataView;
      this.grid = grid;
      // --
      // public API
      // --
      // protected props
      __publicField(this, "_container");
      // the container might be a string, a jQuery object or a native element
      __publicField(this, "_statusElm");
      __publicField(this, "_bindingEventService");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        showAllText: "Showing all {rowCount} rows",
        showPageText: "Showing page {pageNum} of {pageCount}",
        showCountText: "From {countBegin} to {countEnd} of {rowCount} rows",
        showCount: !1,
        pagingOptions: [
          { data: 0, name: "All", ariaLabel: "Show All Pages" },
          { data: -1, name: "Auto", ariaLabel: "Auto Page Size" },
          { data: 25, name: "25", ariaLabel: "Show 25 rows per page" },
          { data: 50, name: "50", ariaLabel: "Show 50 rows per page" },
          { data: 100, name: "100", ariaLabel: "Show 100 rows per page" }
        ],
        showPageSizes: !1
      });
      this._container = this.getContainerElement(selectorOrElm), this._options = Utils.extend(!0, {}, this._defaults, options), this._bindingEventService = new BindingEventService(), this.init();
    }
    init() {
      this.constructPagerUI(), this.updatePager(this.dataView.getPagingInfo()), this.dataView.onPagingInfoChanged.subscribe((_e, pagingInfo) => {
        this.updatePager(pagingInfo);
      });
    }
    /** Destroy function when element is destroyed */
    destroy() {
      this.setPageSize(0), this._bindingEventService.unbindAll(), Utils.emptyElement(this._container);
    }
    getNavState() {
      let cannotLeaveEditMode = !SlickGlobalEditorLock.commitCurrentEdit(), pagingInfo = this.dataView.getPagingInfo(), lastPage = pagingInfo.totalPages - 1;
      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
        pagingInfo
      };
    }
    setPageSize(n) {
      this.dataView.setRefreshHints({
        isFilterUnchanged: !0
      }), this.dataView.setPagingOptions({ pageSize: n });
    }
    gotoFirst() {
      this.getNavState().canGotoFirst && this.dataView.setPagingOptions({ pageNum: 0 });
    }
    gotoLast() {
      let state = this.getNavState();
      state.canGotoLast && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
    }
    gotoPrev() {
      let state = this.getNavState();
      state.canGotoPrev && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
    }
    gotoNext() {
      let state = this.getNavState();
      state.canGotoNext && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
    }
    getContainerElement(selectorOrElm) {
      return typeof selectorOrElm == "string" ? document.querySelector(selectorOrElm) : typeof selectorOrElm == "object" && selectorOrElm[0] ? selectorOrElm[0] : selectorOrElm;
    }
    constructPagerUI() {
      let container = this.getContainerElement(this._container);
      if (!container || container.jquery && !container[0])
        return;
      let navElm = document.createElement("span");
      navElm.className = "slick-pager-nav";
      let settingsElm = document.createElement("span");
      settingsElm.className = "slick-pager-settings", this._statusElm = document.createElement("span"), this._statusElm.className = "slick-pager-status";
      let pagerSettingsElm = document.createElement("span");
      pagerSettingsElm.className = "slick-pager-settings-expanded", pagerSettingsElm.textContent = "Show: ";
      for (let o = 0; o < this._options.pagingOptions.length; o++) {
        let p = this._options.pagingOptions[o], anchorElm = document.createElement("a");
        anchorElm.textContent = p.name, anchorElm.ariaLabel = p.ariaLabel, anchorElm.dataset.val = String(p.data), pagerSettingsElm.appendChild(anchorElm), this._bindingEventService.bind(anchorElm, "click", (e) => {
          let pagesize = e.target.dataset.val;
          if (pagesize !== void 0)
            if (Number(pagesize) === -1) {
              let vp = this.grid.getViewport();
              this.setPageSize(vp.bottom - vp.top);
            } else
              this.setPageSize(parseInt(pagesize));
        });
      }
      pagerSettingsElm.style.display = this._options.showPageSizes ? "block" : "none", settingsElm.appendChild(pagerSettingsElm);
      let displayPaginationContainer = document.createElement("span"), displayIconElm = document.createElement("span");
      displayPaginationContainer.className = "sgi-container", displayIconElm.ariaLabel = "Show Pagination Options", displayIconElm.role = "button", displayIconElm.className = "sgi sgi-lightbulb", displayPaginationContainer.appendChild(displayIconElm), this._bindingEventService.bind(displayIconElm, "click", () => {
        let styleDisplay = pagerSettingsElm.style.display;
        pagerSettingsElm.style.display = styleDisplay === "none" ? "inline-flex" : "none";
      }), settingsElm.appendChild(displayPaginationContainer), [
        { key: "start", ariaLabel: "First Page", callback: this.gotoFirst },
        { key: "left", ariaLabel: "Previous Page", callback: this.gotoPrev },
        { key: "right", ariaLabel: "Next Page", callback: this.gotoNext },
        { key: "end", ariaLabel: "Last Page", callback: this.gotoLast }
      ].forEach((pageBtn) => {
        let iconElm = document.createElement("span");
        iconElm.className = "sgi-container";
        let innerIconElm = document.createElement("span");
        innerIconElm.role = "button", innerIconElm.ariaLabel = pageBtn.ariaLabel, innerIconElm.className = `sgi sgi-chevron-${pageBtn.key}`, this._bindingEventService.bind(innerIconElm, "click", pageBtn.callback.bind(this)), iconElm.appendChild(innerIconElm), navElm.appendChild(iconElm);
      });
      let slickPagerElm = document.createElement("div");
      slickPagerElm.className = "slick-pager", slickPagerElm.appendChild(navElm), slickPagerElm.appendChild(this._statusElm), slickPagerElm.appendChild(settingsElm), container.appendChild(slickPagerElm);
    }
    updatePager(pagingInfo) {
      if (!this._container || this._container.jquery && !this._container[0])
        return;
      let state = this.getNavState();
      if (this._container.querySelectorAll(".slick-pager-nav span").forEach((pagerIcon) => pagerIcon.classList.remove("sgi-state-disabled")), state.canGotoFirst || this._container.querySelector(".sgi-chevron-start").classList.add("sgi-state-disabled"), state.canGotoLast || this._container.querySelector(".sgi-chevron-end").classList.add("sgi-state-disabled"), state.canGotoNext || this._container.querySelector(".sgi-chevron-right").classList.add("sgi-state-disabled"), state.canGotoPrev || this._container.querySelector(".sgi-chevron-left").classList.add("sgi-state-disabled"), pagingInfo.pageSize === 0 ? this._statusElm.textContent = this._options.showAllText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{pageCount}", pagingInfo.totalPages + "") : this._statusElm.textContent = this._options.showPageText.replace("{pageNum}", pagingInfo.pageNum + 1 + "").replace("{pageCount}", pagingInfo.totalPages + ""), this._options.showCount && pagingInfo.pageSize !== 0) {
        let pageBegin = pagingInfo.pageNum * pagingInfo.pageSize, currentText = this._statusElm.textContent;
        currentText && (currentText += " - "), this._statusElm.textContent = currentText + this._options.showCountText.replace("{rowCount}", String(pagingInfo.totalRows)).replace("{countBegin}", String(pageBegin + 1)).replace("{countEnd}", String(Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows)));
      }
    }
  };
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.Pager = SlickGridPager);
})();
//# sourceMappingURL=slick.pager.js.map
