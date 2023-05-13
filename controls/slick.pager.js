(function (window) {
  // Slick.Controls.Pager
  Slick.Utils.extend(true, window, {
    "Slick": {
      "Controls": {
        "Pager": SlickGridPager
      }
    }
  });

  function SlickGridPager(dataView, grid, selectorOrElm, options) {
    // the container might be a string, a jQuery object or a native element
    const container = getContainerElement(selectorOrElm);

    let statusElm;
    let _options;
    let _defaults = {
      showAllText: 'Showing all {rowCount} rows',
      showPageText: 'Showing page {pageNum} of {pageCount}',
      showCountText: 'From {countBegin} to {countEnd} of {rowCount} rows',
      showCount: false,
      pagingOptions: [
        { data: 0, name: 'All', ariaLabel: 'Show All Pages' },
        { data: -1, name: 'Auto', ariaLabel: 'Auto Page Size' },
        { data: 25, name: '25', ariaLabel: 'Show 25 rows per page' },
        { data: 50, name: '50', ariaLabel: 'Show 50 rows per page' },
        { data: 100, name: '100', ariaLabel: 'Show 100 rows per page' },
      ],
      showPageSizes: false
    };
    var _bindingEventService = new Slick.BindingEventService();

    function init() {
      _options = Slick.Utils.extend(true, {}, _defaults, options);

      dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
        updatePager(pagingInfo);
      });

      constructPagerUI();
      updatePager(dataView.getPagingInfo());
    }

    /** Destroy function when element is destroyed */
    function destroy() {
      setPageSize(0);
      _bindingEventService.unbindAll();
      container.innerHTML = '';
    }

    function getNavState() {
      let cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
      let pagingInfo = dataView.getPagingInfo();
      let lastPage = pagingInfo.totalPages - 1;

      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
        pagingInfo: pagingInfo
      };
    }

    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      dataView.setPagingOptions({pageSize: n});
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        dataView.setPagingOptions({pageNum: 0});
      }
    }

    function gotoLast() {
      let state = getNavState();
      if (state.canGotoLast) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
      }
    }

    function gotoPrev() {
      let state = getNavState();
      if (state.canGotoPrev) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
      }
    }

    function gotoNext() {
      let state = getNavState();
      if (state.canGotoNext) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
      }
    }

    function getContainerElement(selectorOrElm) {
      // the container might be a string, a jQuery object or a native element
      return typeof selectorOrElm === 'string'
        ? document.querySelector(selectorOrElm)
        : typeof selectorOrElm === 'object' && selectorOrElm[0]
          ? selectorOrElm[0]
          : selectorOrElm;
    }

    function constructPagerUI() {
      // the container might be a string, a jQuery object or a native element
      const container = getContainerElement(selectorOrElm);
      if (!container || (container.jquery && !container[0])) return;

      const navElm = document.createElement('span');
      navElm.className = 'slick-pager-nav';

      const settingsElm = document.createElement('span');
      settingsElm.className = 'slick-pager-settings';

      statusElm = document.createElement('span');
      statusElm.className = 'slick-pager-status';

      const pagerSettingsElm = document.createElement('span');
      pagerSettingsElm.className = 'slick-pager-settings-expanded';
      pagerSettingsElm.textContent = 'Show: ';

      for (let o = 0; o < _options.pagingOptions.length; o++) {
        let p = _options.pagingOptions[o];

        const anchorElm = document.createElement('a');
        anchorElm.textContent = p.name;
        anchorElm.ariaLabel = p.ariaLabel;
        anchorElm.dataset.val = p.data;
        pagerSettingsElm.appendChild(anchorElm);

        _bindingEventService.bind(anchorElm, 'click', (function (e) {
          let pagesize = e.target.dataset.val;
          if (pagesize !== undefined) {
            if (Number(pagesize) === -1) {
              let vp = grid.getViewport();
              setPageSize(vp.bottom - vp.top);
            } else {
              setPageSize(parseInt(pagesize));
            }
          }
        }));
      }

      pagerSettingsElm.style.display = _options.showPageSizes ? 'block' : 'none';

      settingsElm.appendChild(pagerSettingsElm);

      // light bulb icon
      const displayPaginationContainer = document.createElement('span');
      const displayIconElm = document.createElement('span');
      displayPaginationContainer.className = 'ui-state-default ui-corner-all ui-icon-container';
      displayIconElm.ariaLabel = 'Show Pagination Options';
      displayIconElm.role = 'button';
      displayIconElm.className = 'ui-icon ui-icon-lightbulb slick-icon-lightbulb';
      displayPaginationContainer.appendChild(displayIconElm);

      _bindingEventService.bind(displayIconElm, 'click', () => {
        const styleDisplay = pagerSettingsElm.style.display;
        pagerSettingsElm.style.display = styleDisplay === 'none' ? 'inline' : 'none';
      });
      settingsElm.appendChild(displayPaginationContainer);

      const pageButtons = [
        { key: 'first', ariaLabel: 'First Page', callback: gotoFirst },
        { key: 'prev', ariaLabel: 'Previous Page', callback: gotoPrev },
        { key: 'next', ariaLabel: 'Next Page', callback: gotoNext },
        { key: 'end', ariaLabel: 'Last Page', callback: gotoLast },
      ];

      pageButtons.forEach(pageBtn => {
        const iconElm = document.createElement('span');
        iconElm.className = 'ui-state-default ui-corner-all ui-icon-container';

        const innerIconElm = document.createElement('span');
        innerIconElm.role = 'button';
        innerIconElm.ariaLabel = pageBtn.ariaLabel;
        innerIconElm.className = `ui-icon ui-icon-seek-${pageBtn.key} slick-icon-seek-${pageBtn.key}`;
        _bindingEventService.bind(innerIconElm, 'click', pageBtn.callback);

        iconElm.appendChild(innerIconElm);
        navElm.appendChild(iconElm);
      });

      const slickPagerElm = document.createElement('div');
      slickPagerElm.className = 'slick-pager';

      slickPagerElm.appendChild(navElm);
      slickPagerElm.appendChild(settingsElm);
      slickPagerElm.appendChild(statusElm);

      container.appendChild(slickPagerElm);
    }

    function updatePager(pagingInfo) {
      if (!container || (container.jquery && !container[0])) return;
      let state = getNavState();

      // remove disabled class on all icons
      container.querySelectorAll(".slick-pager-nav span")
        .forEach(pagerIcon => pagerIcon.classList.remove("ui-state-disabled", "slick-icon-state-disabled"));

        // add back disabled class to only necessary icons
      if (!state.canGotoFirst) {
        container.querySelector(".ui-icon-seek-first").classList.add("ui-state-disabled");
        container.querySelector(".slick-icon-seek-first").classList.add("slick-icon-state-disabled");
      }
      if (!state.canGotoLast) {
        container.querySelector(".ui-icon-seek-end").classList.add("ui-state-disabled");
        container.querySelector(".slick-icon-seek-end").classList.add("slick-icon-state-disabled");
      }
      if (!state.canGotoNext) {
        container.querySelector(".ui-icon-seek-next").classList.add("ui-state-disabled");
        container.querySelector(".slick-icon-seek-next").classList.add("slick-icon-state-disabled");
      }
      if (!state.canGotoPrev) {
        container.querySelector(".ui-icon-seek-prev").classList.add("ui-state-disabled");
        container.querySelector(".slick-icon-seek-prev").classList.add("slick-icon-state-disabled");
      }

      if (pagingInfo.pageSize === 0) {
        statusElm.textContent = (_options.showAllText.replace('{rowCount}', pagingInfo.totalRows + "").replace('{pageCount}', pagingInfo.totalPages + ""));
      } else {
        statusElm.textContent = (_options.showPageText.replace('{pageNum}', pagingInfo.pageNum + 1 + "").replace('{pageCount}', pagingInfo.totalPages + ""));
      }

      if (_options.showCount && pagingInfo.pageSize !== 0) {
        let pageBegin = pagingInfo.pageNum * pagingInfo.pageSize;
        let currentText = statusElm.textContent;

        if (currentText) {
          currentText += " - ";
        }

        statusElm.textContent =
            currentText +
            _options.showCountText
                .replace('{rowCount}', pagingInfo.totalRows + "")
                .replace("{countBegin}", pageBegin + 1)
            .replace("{countEnd}", Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows));
      }
    }

    init();

    Slick.Utils.extend(this, {
      "init": init,
      "destroy": destroy,
    });
  }
})(window);
