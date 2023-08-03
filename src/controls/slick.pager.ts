import type { PagingInfo } from '../models/index';
import { BindingEventService as BindingEventService_, SlickGlobalEditorLock as SlickGlobalEditorLock_, Utils as Utils_ } from '../slick.core';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickGlobalEditorLock = IIFE_ONLY ? Slick.GlobalEditorLock : SlickGlobalEditorLock_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export interface GridPagerOption {
  showAllText: string;
  showPageText: string;
  showCountText: string;
  showCount: boolean;
  pagingOptions: Array<{ data: number; name: string; ariaLabel: string; }>;
  showPageSizes: boolean;
}

export class SlickGridPager {
  // --
  // public API

  // --
  // protected props
  protected _container: HTMLElement; // the container might be a string, a jQuery object or a native element
  protected _statusElm!: HTMLElement;
  protected _bindingEventService: BindingEventService_;
  protected _options: GridPagerOption;
  protected _defaults: GridPagerOption = {
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

  constructor(protected readonly dataView: SlickDataView, protected readonly grid: SlickGrid, selectorOrElm: HTMLElement | string, options?: Partial<GridPagerOption>) {
    this._container = this.getContainerElement(selectorOrElm) as HTMLElement;
    this._options = Utils.extend(true, {}, this._defaults, options);
    this._bindingEventService = new BindingEventService();
    this.init();
  }

  init() {
    this.constructPagerUI();
    this.updatePager(this.dataView.getPagingInfo());
    this.dataView.onPagingInfoChanged.subscribe((_e, pagingInfo) => {
      this.updatePager(pagingInfo);
    });
  }

  /** Destroy function when element is destroyed */
  destroy() {
    this.setPageSize(0);
    this._bindingEventService.unbindAll();
    this._container.innerHTML = '';
  }

  protected getNavState() {
    const cannotLeaveEditMode = !SlickGlobalEditorLock.commitCurrentEdit();
    const pagingInfo = this.dataView.getPagingInfo();
    const lastPage = pagingInfo.totalPages - 1;

    return {
      canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
      canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
      pagingInfo: pagingInfo
    };
  }

  protected setPageSize(n: number) {
    this.dataView.setRefreshHints({
      isFilterUnchanged: true
    });
    this.dataView.setPagingOptions({ pageSize: n });
  }

  protected gotoFirst() {
    if (this.getNavState().canGotoFirst) {
      this.dataView.setPagingOptions({ pageNum: 0 });
    }
  }

  protected gotoLast() {
    const state = this.getNavState();
    if (state.canGotoLast) {
      this.dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
    }
  }

  protected gotoPrev() {
    const state = this.getNavState();
    if (state.canGotoPrev) {
      this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
    }
  }

  protected gotoNext() {
    const state = this.getNavState();
    if (state.canGotoNext) {
      this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
    }
  }

  protected getContainerElement(selectorOrElm: object | HTMLElement | string) {
    // the container might be a string, a jQuery object or a native element
    return typeof selectorOrElm === 'string'
      ? document.querySelector(selectorOrElm)
      : typeof selectorOrElm === 'object' && (selectorOrElm as any)[0]
        ? (selectorOrElm as any)[0] as HTMLElement
        : selectorOrElm;
  }

  protected constructPagerUI() {
    // the container might be a string, a jQuery object or a native element
    const container = this.getContainerElement(this._container) as HTMLElement | HTMLElement[];
    if (!container || ((container as any).jquery && !(container as HTMLElement[])[0])) return;

    const navElm = document.createElement('span');
    navElm.className = 'slick-pager-nav';

    const settingsElm = document.createElement('span');
    settingsElm.className = 'slick-pager-settings';

    this._statusElm = document.createElement('span');
    this._statusElm.className = 'slick-pager-status';

    const pagerSettingsElm = document.createElement('span');
    pagerSettingsElm.className = 'slick-pager-settings-expanded';
    pagerSettingsElm.textContent = 'Show: ';

    for (let o = 0; o < this._options.pagingOptions.length; o++) {
      const p = this._options.pagingOptions[o];

      const anchorElm = document.createElement('a');
      anchorElm.textContent = p.name;
      anchorElm.ariaLabel = p.ariaLabel;
      anchorElm.dataset.val = String(p.data);
      pagerSettingsElm.appendChild(anchorElm);

      this._bindingEventService.bind(anchorElm, 'click', ((e: any) => {
        const pagesize = e.target.dataset.val;
        if (pagesize !== undefined) {
          if (Number(pagesize) === -1) {
            const vp = this.grid.getViewport();
            this.setPageSize(vp.bottom - vp.top);
          } else {
            this.setPageSize(parseInt(pagesize));
          }
        }
      }));
    }

    pagerSettingsElm.style.display = this._options.showPageSizes ? 'block' : 'none';

    settingsElm.appendChild(pagerSettingsElm);

    // light bulb icon
    const displayPaginationContainer = document.createElement('span');
    const displayIconElm = document.createElement('span');
    displayPaginationContainer.className = 'sgi-container';
    displayIconElm.ariaLabel = 'Show Pagination Options';
    displayIconElm.role = 'button';
    displayIconElm.className = 'sgi sgi-lightbulb';
    displayPaginationContainer.appendChild(displayIconElm);

    this._bindingEventService.bind(displayIconElm, 'click', () => {
      const styleDisplay = pagerSettingsElm.style.display;
      pagerSettingsElm.style.display = styleDisplay === 'none' ? 'inline-flex' : 'none';
    });
    settingsElm.appendChild(displayPaginationContainer);

    const pageButtons = [
      { key: 'start', ariaLabel: 'First Page', callback: this.gotoFirst },
      { key: 'left', ariaLabel: 'Previous Page', callback: this.gotoPrev },
      { key: 'right', ariaLabel: 'Next Page', callback: this.gotoNext },
      { key: 'end', ariaLabel: 'Last Page', callback: this.gotoLast },
    ];

    pageButtons.forEach(pageBtn => {
      const iconElm = document.createElement('span');
      iconElm.className = 'sgi-container';

      const innerIconElm = document.createElement('span');
      innerIconElm.role = 'button';
      innerIconElm.ariaLabel = pageBtn.ariaLabel;
      innerIconElm.className = `sgi sgi-chevron-${pageBtn.key}`;
      this._bindingEventService.bind(innerIconElm, 'click', pageBtn.callback.bind(this));

      iconElm.appendChild(innerIconElm);
      navElm.appendChild(iconElm);
    });

    const slickPagerElm = document.createElement('div');
    slickPagerElm.className = 'slick-pager';

    slickPagerElm.appendChild(navElm);
    slickPagerElm.appendChild(this._statusElm);
    slickPagerElm.appendChild(settingsElm);

    (container as HTMLElement).appendChild(slickPagerElm);
  }

  protected updatePager(pagingInfo: PagingInfo) {
    if (!this._container || ((this._container as any).jquery && !(this._container as any)[0])) return;
    const state = this.getNavState();

    // remove disabled class on all icons
    this._container.querySelectorAll('.slick-pager-nav span')
      .forEach(pagerIcon => pagerIcon.classList.remove('sgi-state-disabled'));

    // add back disabled class to only necessary icons
    if (!state.canGotoFirst) {
      this._container!.querySelector('.sgi-chevron-start')!.classList.add('sgi-state-disabled');
    }
    if (!state.canGotoLast) {
      this._container!.querySelector('.sgi-chevron-end')!.classList.add('sgi-state-disabled');
    }
    if (!state.canGotoNext) {
      this._container!.querySelector('.sgi-chevron-right')!.classList.add('sgi-state-disabled');
    }
    if (!state.canGotoPrev) {
      this._container!.querySelector('.sgi-chevron-left')!.classList.add('sgi-state-disabled');
    }

    if (pagingInfo.pageSize === 0) {
      this._statusElm.textContent = (this._options.showAllText.replace('{rowCount}', pagingInfo.totalRows + '').replace('{pageCount}', pagingInfo.totalPages + ''));
    } else {
      this._statusElm.textContent = (this._options.showPageText.replace('{pageNum}', pagingInfo.pageNum + 1 + '').replace('{pageCount}', pagingInfo.totalPages + ''));
    }

    if (this._options.showCount && pagingInfo.pageSize !== 0) {
      const pageBegin = pagingInfo.pageNum * pagingInfo.pageSize;
      let currentText = this._statusElm.textContent;

      if (currentText) {
        currentText += ' - ';
      }

      this._statusElm.textContent =
        currentText +
        this._options.showCountText
          .replace('{rowCount}', String(pagingInfo.totalRows))
          .replace('{countBegin}', String(pageBegin + 1))
          .replace('{countEnd}', String(Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows)));
    }
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.Pager = SlickGridPager;
}

