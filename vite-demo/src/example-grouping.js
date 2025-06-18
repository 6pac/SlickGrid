import {
  Aggregators,
  Editors,
  Formatters,
  SlickGlobalEditorLock,
  SlickCellSelectionModel,
  SlickColumnPicker,
  SlickDataView,
  SlickGrid,
  SlickGridMenu,
  SlickGroup,
  SlickGroupItemMetadataProvider,
  SlickRowSelectionModel,
  Utils,
} from 'slickgrid';

import exampleGroupingHtml from './example-grouping.html?raw';
import './example-grouping.scss'

export class ExampleGrouping {
  dataView;
  grid;
  data;
  columns;
  options;
  sortcol = "title";
  sortdir = 1;
  percentCompleteThreshold = 0;
  prevPercentCompleteThreshold = 0;

  /** render Example HTML code */
  render() {
    return exampleGroupingHtml;
  }

  destroy() {
    document.querySelector('[data-test="add-500-rows-btn"]').removeEventListener('click', () => this.loadData(500));
    document.querySelector('[data-test="add-50k-rows-btn"]').removeEventListener('click', () => this.loadData(50000));
    document.querySelector('[data-test="add-500k-rows-btn"]').removeEventListener('click', () => this.loadData(500000));

    document.querySelector('[data-test="clear-grouping-btn"]').removeEventListener('click', () => this.dataView.setGrouping([]));
    document.querySelector('[data-test="group-duration-sort-value-btn"]').removeEventListener('click', () => this.groupByDuration());
    document.querySelector('[data-test="group-duration-sort-count-btn"]').removeEventListener('click', () => this.groupByDurationOrderByCount(false));
    document.querySelector('[data-test="group-duration-sort-count-aggregate-collapsed-btn"]').removeEventListener('click', () => this.groupByDurationOrderByCount(true));
    document.querySelector('[data-test="group-duration-effort-btn"]').removeEventListener('click', () => this.groupByDurationEffortDriven());
    document.querySelector('[data-test="group-duration-effort-percent-btn"]').removeEventListener('click', () => this.groupByDurationEffortDrivenPercent());
    document.querySelector('[data-test="collapse-all-btn"]').removeEventListener('click', () => this.toggleGrouping(false));
    document.querySelector('[data-test="expand-all-btn"]').removeEventListener('click', () => this.toggleGrouping(true));
  }

  /** initialize Example JS code */
  init() {
    this.dataView;
    this.grid;
    this.data = [];
    this.columns = [
      { id: "sel", name: "#", field: "num", cssClass: "cell-selection", width: 40, resizable: false, selectable: false, focusable: false },
      { id: "title", name: "Title", field: "title", width: 70, minWidth: 50, cssClass: "cell-title", sortable: true, editor: Editors.Text },
      { id: "duration", name: "Duration", field: "duration", width: 75, sortable: true, groupTotalsFormatter: this.sumTotalsFormatter },
      { id: "%", name: "% Complete", field: "percentComplete", width: 95, formatter: Formatters.PercentCompleteBar, sortable: true, groupTotalsFormatter: this.avgTotalsFormatter },
      { id: "start", name: "Start", field: "start", minWidth: 60, sortable: true },
      { id: "finish", name: "Finish", field: "finish", minWidth: 60, sortable: true },
      { id: "cost", name: "Cost", field: "cost", width: 90, sortable: true, groupTotalsFormatter: this.sumTotalsFormatter },
      { id: "effort-driven", name: "Effort-Driven", width: 100, minWidth: 20, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Formatters.Checkmark, sortable: true }
    ];

    this.options = {
      enableCellNavigation: true,
      editable: true,
      gridMenu: {
        iconCssClass: "sgi sgi-menu sgi-17px",
        columnTitle: "Columns",
      },
      rowHeight: 28,
      // forceSyncScrolling: true,
      rowTopOffsetRenderType: 'transform', // defaults: 'top'
    };

    // instantiate SlickGrid and SlickDataView
    let groupItemMetadataProvider = new SlickGroupItemMetadataProvider();
    this.dataView = new SlickDataView({ inlineFilters: true, groupItemMetadataProvider });
    this.grid = new SlickGrid("#myGrid", this.dataView, this.columns, this.options);

    // instantiate a few Controls
    new SlickColumnPicker(this.columns, this.grid, this.options);
    new SlickGridMenu(this.columns, this.grid, this.options);

    // register the group item metadata provider to add expand/collapse group handlers
    this.grid.registerPlugin(groupItemMetadataProvider);
    this.grid.setSelectionModel(new SlickCellSelectionModel());

    this.grid.onSort.subscribe((e, args) => {
      sortdir = args.sortAsc ? 1 : -1;
      sortcol = args.sortCol.field;

      // using native sort with comparer
      // preferred method but can be very slow in IE with huge datasets
      this.dataView.sort(comparer, args.sortAsc);
    });

    // wire up model events to drive the grid
    this.dataView.onRowCountChanged.subscribe((e, args) => {
      this.grid.updateRowCount();
      this.grid.render();
    });

    this.dataView.onRowsChanged.subscribe((e, args) => {
      this.grid.invalidateRows(args.rows);
      this.grid.render();
    });

    let h_runfilters = null;

    // wire up the slider to apply the filter to the model
    let slider = document.getElementById("pcSlider");
    let sliderCallback = (e) => {
      const value = e.target.value;
      SlickGlobalEditorLock.cancelCurrentEdit();

      if (this.percentCompleteThreshold != value) {
        window.clearTimeout(h_runfilters);
        h_runfilters = window.setTimeout(this.updateFilter.bind(this), 10);
        this.percentCompleteThreshold = value;
      }
    }

    slider.oninput = sliderCallback.bind(this);

    // wire up the search textbox to apply the filter to the model
    document.querySelectorAll("#txtSearch,#txtSearch2").forEach(elm => elm.addEventListener('keyup', (e) => {
      SlickGlobalEditorLock.cancelCurrentEdit();

      // clear on Esc
      if (e.which == 27) e.target.value = '';

      this.searchString = (e.target.value || '').trim();
      this.updateFilter();
      this.dataView.refresh();
    }));

    // initialize the model after all the events have been hooked up
    this.dataView.beginUpdate();
    this.dataView.setItems(this.data);
    this.dataView.setFilter(this.myFilter);
    this.dataView.setFilterArgs({
      percentComplete: this.percentCompleteThreshold,
    });
    this.loadData(500);
    this.dataView.endUpdate();

    // if you don't want the items that are not visible (due to being filtered out
    // or being on a different page) to stay selected, pass 'false' to the second arg
    this.dataView.syncGridSelection(this.grid, true);

    // add onClick listeners to all buttons
    document.querySelector('[data-test="add-500-rows-btn"]').addEventListener('click', () => this.loadData(500));
    document.querySelector('[data-test="add-50k-rows-btn"]').addEventListener('click', () => this.loadData(50000));
    document.querySelector('[data-test="add-500k-rows-btn"]').addEventListener('click', () => this.loadData(500000));

    document.querySelector('[data-test="clear-grouping-btn"]').addEventListener('click', () => this.dataView.setGrouping([]));
    document.querySelector('[data-test="group-duration-sort-value-btn"]').addEventListener('click', () => this.groupByDuration());
    document.querySelector('[data-test="group-duration-sort-count-btn"]').addEventListener('click', () => this.groupByDurationOrderByCount(false));
    document.querySelector('[data-test="group-duration-sort-count-aggregate-collapsed-btn"]').addEventListener('click', () => this.groupByDurationOrderByCount(true));
    document.querySelector('[data-test="group-duration-effort-btn"]').addEventListener('click', () => this.groupByDurationEffortDriven());
    document.querySelector('[data-test="group-duration-effort-percent-btn"]').addEventListener('click', () => this.groupByDurationEffortDrivenPercent());
    document.querySelector('[data-test="collapse-all-btn"]').addEventListener('click', () => this.toggleGrouping(false));
    document.querySelector('[data-test="expand-all-btn"]').addEventListener('click', () => this.toggleGrouping(true));
  }

  loadData(count) {
    let someDates = ["01/01/2009", "02/02/2009", "03/03/2009"];
    this.data = [];
    // prepare the data
    for (let i = 0; i < count; i++) {
      let d = (this.data[i] = {});

      d["id"] = "id_" + i;
      d["num"] = i;
      d["title"] = "Task " + i;
      d["duration"] = Math.round(Math.random() * 30);
      d["percentComplete"] = Math.round(Math.random() * 100);
      d["start"] = someDates[Math.floor((Math.random() * 2))];
      d["finish"] = someDates[Math.floor((Math.random() * 2))];
      d["cost"] = Math.round(Math.random() * 10000) / 100;
      d["effortDriven"] = (i % 5 == 0);
    }
    this.dataView.setItems(this.data);
  }

  avgTotalsFormatter(totals, columnDef, grid) {
    let val = totals.avg && totals.avg[columnDef.field];
    if (val != null) {
      return "avg: " + Math.round(val) + "%";
    }
    return "";
  }

  sumTotalsFormatter(totals, columnDef, grid) {
    let val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return "total: " + ((Math.round(parseFloat(val) * 100) / 100));
    }
    return "";
  }

  filterAndUpdate() {
    let isNarrowing = this.percentCompleteThreshold > this.prevPercentCompleteThreshold;
    let isExpanding = this.percentCompleteThreshold < this.prevPercentCompleteThreshold;
    let renderedRange = this.grid.getRenderedRange();

    this.dataView.setFilterArgs({
      percentComplete: this.percentCompleteThreshold
    });
    this.dataView.setRefreshHints({
      ignoreDiffsBefore: renderedRange.top,
      ignoreDiffsAfter: renderedRange.bottom + 1,
      isFilterNarrowing: isNarrowing,
      isFilterExpanding: isExpanding
    });
    this.dataView.refresh();

    this.prevPercentCompleteThreshold = this.percentCompleteThreshold;
  }

  myFilter(item, args) {
    if (item["percentComplete"] < args.percentCompleteThreshold) {
      return false;
    }

    return true;
  }

  percentCompleteSort(a, b) {
    return a["percentComplete"] - b["percentComplete"];
  }

  comparer(a, b) {
    let x = a[sortcol], y = b[sortcol];
    return (x == y ? 0 : (x > y ? 1 : -1));
  }

  groupByDuration() {
    this.grid.setSortColumns([]);
    this.dataView.setGrouping({
      getter: "duration",
      formatter: (g) => {
        return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
      },
      aggregators: [
        new Aggregators.Avg("percentComplete"),
        new Aggregators.Sum("cost")
      ],
      aggregateCollapsed: false,
      lazyTotalsCalculation: true
    });
    this.grid.invalidate();
  }

  groupByDurationOrderByCount(aggregateCollapsed) {
    this.grid.setSortColumns([]);
    this.dataView.setGrouping({
      getter: "duration",
      formatter: (g) => {
        return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
      },
      comparer: (a, b) => {
        return a.count - b.count;
      },
      aggregators: [
        new Aggregators.Avg("percentComplete"),
        new Aggregators.Sum("cost")
      ],
      aggregateCollapsed: aggregateCollapsed,
      lazyTotalsCalculation: true
    });
    this.grid.invalidate();
  }

  groupByDurationEffortDriven() {
    this.grid.setSortColumns([]);
    this.dataView.setGrouping([
      {
        getter: "duration",
        formatter: (g) => {
          return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
          new Aggregators.Sum("duration"),
          new Aggregators.Sum("cost")
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
      },
      {
        getter: "effortDriven",
        formatter: (g) => {
          return "Effort-Driven:  " + (g.value ? "True" : "False") + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
          new Aggregators.Avg("percentComplete"),
          new Aggregators.Sum("cost")
        ],
        collapsed: true,
        lazyTotalsCalculation: true
      }
    ]);
    this.grid.invalidate();
  }

  groupByDurationEffortDrivenPercent() {
    this.grid.setSortColumns([]);
    this.dataView.setGrouping([
      {
        getter: "duration",
        formatter: (g) => {
          return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
          new Aggregators.Sum("duration"),
          new Aggregators.Sum("cost")
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
      },
      {
        getter: "effortDriven",
        formatter: (g) => {
          return "Effort-Driven:  " + (g.value ? "True" : "False") + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
          new Aggregators.Sum("duration"),
          new Aggregators.Sum("cost")
        ],
        lazyTotalsCalculation: true
      },
      {
        getter: "percentComplete",
        formatter: (g) => {
          return "% Complete:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
          new Aggregators.Avg("percentComplete")
        ],
        aggregateCollapsed: true,
        collapsed: true,
        lazyTotalsCalculation: true
      }
    ]);
    this.grid.invalidate();
  }

  toggleGrouping(expand) {
    const groupToggleAllElm = document.querySelector(".slick-group-toggle-all");
    if (expand) {
      this.dataView.expandAllGroups();
      if (groupToggleAllElm) {
        groupToggleAllElm.classList.remove('collapsed');
        groupToggleAllElm.classList.addClass('expanded');
      }
    } else {
      this.dataView.collapseAllGroups();
      if (groupToggleAllElm) {
        groupToggleAllElm.classList.remove('expanded');
        groupToggleAllElm.classList.addClass('collapsed');
      }
    }
  }

  updateFilter() {
    this.dataView.setFilterArgs({
      percentCompleteThreshold: this.percentCompleteThreshold,
    });
    this.dataView.refresh();
  }
}
