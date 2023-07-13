"use strict";
(() => {
  // src/controls/slick.pager.js
  var BindingEventService = Slick.BindingEventService, GlobalEditorLock = Slick.GlobalEditorLock, Utils = Slick.Utils;
  function SlickGridPager(dataView, grid, selectorOrElm, options) {
    let container = getContainerElement(selectorOrElm), statusElm, _options, _defaults = {
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
    };
    var _bindingEventService = new BindingEventService();
    function init() {
      _options = Utils.extend(!0, {}, _defaults, options), dataView.onPagingInfoChanged.subscribe(function(e, pagingInfo) {
        updatePager(pagingInfo);
      }), constructPagerUI(), updatePager(dataView.getPagingInfo());
    }
    function destroy() {
      setPageSize(0), _bindingEventService.unbindAll(), container.innerHTML = "";
    }
    function getNavState() {
      let cannotLeaveEditMode = !GlobalEditorLock.commitCurrentEdit(), pagingInfo = dataView.getPagingInfo(), lastPage = pagingInfo.totalPages - 1;
      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
        pagingInfo
      };
    }
    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: !0
      }), dataView.setPagingOptions({ pageSize: n });
    }
    function gotoFirst() {
      getNavState().canGotoFirst && dataView.setPagingOptions({ pageNum: 0 });
    }
    function gotoLast() {
      let state = getNavState();
      state.canGotoLast && dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
    }
    function gotoPrev() {
      let state = getNavState();
      state.canGotoPrev && dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
    }
    function gotoNext() {
      let state = getNavState();
      state.canGotoNext && dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
    }
    function getContainerElement(selectorOrElm2) {
      return typeof selectorOrElm2 == "string" ? document.querySelector(selectorOrElm2) : typeof selectorOrElm2 == "object" && selectorOrElm2[0] ? selectorOrElm2[0] : selectorOrElm2;
    }
    function constructPagerUI() {
      let container2 = getContainerElement(selectorOrElm);
      if (!container2 || container2.jquery && !container2[0])
        return;
      let navElm = document.createElement("span");
      navElm.className = "slick-pager-nav";
      let settingsElm = document.createElement("span");
      settingsElm.className = "slick-pager-settings", statusElm = document.createElement("span"), statusElm.className = "slick-pager-status";
      let pagerSettingsElm = document.createElement("span");
      pagerSettingsElm.className = "slick-pager-settings-expanded", pagerSettingsElm.textContent = "Show: ";
      for (let o = 0; o < _options.pagingOptions.length; o++) {
        let p = _options.pagingOptions[o], anchorElm = document.createElement("a");
        anchorElm.textContent = p.name, anchorElm.ariaLabel = p.ariaLabel, anchorElm.dataset.val = p.data, pagerSettingsElm.appendChild(anchorElm), _bindingEventService.bind(anchorElm, "click", function(e) {
          let pagesize = e.target.dataset.val;
          if (pagesize !== void 0)
            if (Number(pagesize) === -1) {
              let vp = grid.getViewport();
              setPageSize(vp.bottom - vp.top);
            } else
              setPageSize(parseInt(pagesize));
        });
      }
      pagerSettingsElm.style.display = _options.showPageSizes ? "block" : "none", settingsElm.appendChild(pagerSettingsElm);
      let displayPaginationContainer = document.createElement("span"), displayIconElm = document.createElement("span");
      displayPaginationContainer.className = "sgi-container", displayIconElm.ariaLabel = "Show Pagination Options", displayIconElm.role = "button", displayIconElm.className = "sgi sgi-lightbulb", displayPaginationContainer.appendChild(displayIconElm), _bindingEventService.bind(displayIconElm, "click", () => {
        let styleDisplay = pagerSettingsElm.style.display;
        pagerSettingsElm.style.display = styleDisplay === "none" ? "inline-flex" : "none";
      }), settingsElm.appendChild(displayPaginationContainer), [
        { key: "start", ariaLabel: "First Page", callback: gotoFirst },
        { key: "left", ariaLabel: "Previous Page", callback: gotoPrev },
        { key: "right", ariaLabel: "Next Page", callback: gotoNext },
        { key: "end", ariaLabel: "Last Page", callback: gotoLast }
      ].forEach((pageBtn) => {
        let iconElm = document.createElement("span");
        iconElm.className = "sgi-container";
        let innerIconElm = document.createElement("span");
        innerIconElm.role = "button", innerIconElm.ariaLabel = pageBtn.ariaLabel, innerIconElm.className = `sgi sgi-chevron-${pageBtn.key}`, _bindingEventService.bind(innerIconElm, "click", pageBtn.callback), iconElm.appendChild(innerIconElm), navElm.appendChild(iconElm);
      });
      let slickPagerElm = document.createElement("div");
      slickPagerElm.className = "slick-pager", slickPagerElm.appendChild(navElm), slickPagerElm.appendChild(statusElm), slickPagerElm.appendChild(settingsElm), container2.appendChild(slickPagerElm);
    }
    function updatePager(pagingInfo) {
      if (!container || container.jquery && !container[0])
        return;
      let state = getNavState();
      if (container.querySelectorAll(".slick-pager-nav span").forEach((pagerIcon) => pagerIcon.classList.remove("sgi-state-disabled")), state.canGotoFirst || container.querySelector(".sgi-chevron-start").classList.add("sgi-state-disabled"), state.canGotoLast || container.querySelector(".sgi-chevron-end").classList.add("sgi-state-disabled"), state.canGotoNext || container.querySelector(".sgi-chevron-right").classList.add("sgi-state-disabled"), state.canGotoPrev || container.querySelector(".sgi-chevron-left").classList.add("sgi-state-disabled"), pagingInfo.pageSize === 0 ? statusElm.textContent = _options.showAllText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{pageCount}", pagingInfo.totalPages + "") : statusElm.textContent = _options.showPageText.replace("{pageNum}", pagingInfo.pageNum + 1 + "").replace("{pageCount}", pagingInfo.totalPages + ""), _options.showCount && pagingInfo.pageSize !== 0) {
        let pageBegin = pagingInfo.pageNum * pagingInfo.pageSize, currentText = statusElm.textContent;
        currentText && (currentText += " - "), statusElm.textContent = currentText + _options.showCountText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{countBegin}", pageBegin + 1).replace("{countEnd}", Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows));
      }
    }
    init(), Utils.extend(this, {
      init,
      destroy
    });
  }
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.Pager = SlickGridPager);
})();
