import {
  Editors,
  Formatters,
  SlickGlobalEditorLock,
  SlickRowSelectionModel,
  SlickColumnPicker,
  SlickDataView,
  SlickGridMenu,
  SlickGridPager,
  SlickGrid,
  Utils,
} from 'slickgrid';

import example4Html from './example4.html?raw';
import './example4.scss'

export class Example4 {
  dataView;
  grid;
  data;
  columns;
  options;
  sortcol = 'title';
  sortdir = 1;
  percentCompleteThreshold = 0;
  searchString = '';

  /** render Example HTML code */
  render() {
    return example4Html;
  }

  destroy() {
    document.querySelector('.sgi-search').removeEventListener('click', this.toggleFilterRow.bind(this));
    document.querySelector('[data-test="add-50k-rows-btn"]').removeEventListener('click', () => this.setData(this.getData(50000)));
    document.querySelector('[data-test="add-500k-rows-btn"]').removeEventListener('click', () => this.setData(this.getData(500000)));
    document.querySelector('[data-test="add-1M-rows-btn"]').removeEventListener('click', () => this.setData(this.getData(1000000)));
  }

  /** initialize Example JS code */
  init() {
    this.dataView;
    this.grid;
    this.data = [];
    this.columns = [
      { id: "sel", name: "#", field: "num", behavior: "select", cssClass: "cell-selection", width: 45, cannotTriggerInsert: true, resizable: false, selectable: false, excludeFromColumnPicker: true },
      { id: "title", name: "Title", field: "title", width: 110, minWidth: 100, cssClass: "cell-title", editor: Editors.LongText, validator: this.requiredFieldValidator, sortable: true },
      { id: "duration", name: "Duration", field: "duration", editor: Editors.Text, sortable: true },
      { id: "%", defaultSortAsc: false, name: "% Complete", field: "percentComplete", width: 95, formatter: Formatters.PercentCompleteBar, editor: Editors.PercentComplete, sortable: true },
      { id: "start", name: "Start", field: "start", minWidth: 60, editor: Editors.Flatpickr, sortable: true },
      { id: "finish", name: "Finish", field: "finish", minWidth: 60, editor: Editors.Flatpickr, sortable: true },
      { id: "effort-driven", name: "Effort Driven", width: 120, minWidth: 20, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Formatters.Checkbox, editor: Editors.Checkbox, cannotTriggerInsert: true, sortable: true }
    ];

    this.options = {
      columnPicker: {
        columnTitle: "Columns",
        hideForceFitButton: false,
        hideSyncResizeButton: false,
        forceFitTitle: "Force fit columns",
        syncResizeTitle: "Synchronous resize",
      },
      gridMenu: {
        iconCssClass: "sgi sgi-menu sgi-17px",
        columnTitle: "Columns",
        hideForceFitButton: false,
        hideSyncResizeButton: false,
        forceFitTitle: "Force fit columns",
        syncResizeTitle: "Synchronous resize",
      },
      editable: true,
      enableAddRow: true,
      enableCellNavigation: true,
      asyncEditorLoading: true,
      forceFitColumns: false,
      topPanelHeight: 35,
      rowHeight: 28
    };

    // get some mocked data
    this.data = this.getData(50000);

    // instantiate SlickGrid and SlickDataView
    this.dataView = new SlickDataView({ inlineFilters: true });
    this.grid = new SlickGrid("#myGrid", this.dataView, this.columns, this.options);
    this.grid.setSelectionModel(new SlickRowSelectionModel());

    // instantiate a few Controls
    new SlickGridPager(this.dataView, this.grid, "#pager");
    new SlickColumnPicker(this.columns, this.grid, this.options);
    new SlickGridMenu(this.columns, this.grid, this.options);

    // move the filter panel defined in a hidden div into grid top panel
    let topPanel = this.grid.getTopPanel();
    const topPanelLeftElm = document.querySelector("#inlineFilterPanel");
    topPanel.appendChild(topPanelLeftElm);
    topPanelLeftElm.style.display = 'block';

    this.grid.onCellChange.subscribe((e, args) => {
      this.dataView.updateItem(args.item.id, args.item);
    });

    this.grid.onAddNewRow.subscribe((e, args) => {
      let item = { "num": this.data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false };
      Utils.extend(item, args.item);
      this.dataView.addItem(item);
    });

    this.grid.onKeyDown.subscribe(function (e) {
      // select all rows on ctrl-a
      if (e.which != 65 || !e.ctrlKey) {
        return false;
      }

      let rows = [];
      for (let i = 0; i < this.dataView.getLength(); i++) {
        rows.push(i);
      }

      this.grid.setSelectedRows(rows);
      e.preventDefault();
    });

    this.grid.onSort.subscribe((e, args) => {
      this.sortdir = args.sortAsc ? 1 : -1;
      this.sortcol = args.sortCol.field;

      // using native sort with comparer
      this.dataView.sort(this.comparer.bind(this), args.sortAsc);
    });

    this.grid.onBeforeEditCell.subscribe((e, args) => {
      if (args.item.title === 'Task 18') {
        return false;
      }
    });

    // wire up model events to drive the grid
    // !! both this.dataView.onRowCountChanged and this.dataView.onRowsChanged MUST be wired to correctly update the grid
    // see Issue#91
    this.dataView.onRowCountChanged.subscribe((e, args) => {
      this.grid.updateRowCount();
      this.grid.render();
    });

    this.dataView.onRowsChanged.subscribe((e, args) => {
      this.grid.invalidateRows(args.rows);
      this.grid.render();
    });

    this.dataView.onPagingInfoChanged.subscribe((e, pagingInfo) => {
      this.grid.updatePagingStatusFromView(pagingInfo);
      // show the pagingInfo but remove the dataView from the object, just for the Cypress E2E test
      delete pagingInfo.dataView;
      console.log('on After Paging Info Changed - New Paging:: ', pagingInfo);
    });

    this.dataView.onBeforePagingInfoChanged.subscribe((e, previousPagingInfo) => {
      // show the previous pagingInfo but remove the dataView from the object, just for the Cypress E2E test
      delete previousPagingInfo.dataView;
      console.log('on Before Paging Info Changed - Previous Paging:: ', previousPagingInfo);
    });

    let h_runfilters = null;

    // wire up the slider to apply the filter to the model
    let slider = document.getElementById("pcSlider");
    let slider2 = document.getElementById("pcSlider2");
    let sliderCallback = (e) => {
      const value = e.target.value;
      SlickGlobalEditorLock.cancelCurrentEdit();
      if (this.percentCompleteThreshold != value) {
        window.clearTimeout(h_runfilters);
        h_runfilters = window.setTimeout(this.updateFilter(), 10);
        this.percentCompleteThreshold = value;
      }
    }

    slider.oninput = sliderCallback.bind(this);
    slider2.oninput = sliderCallback.bind(this);

    // wire up the search textbox to apply the filter to the model
    document.querySelectorAll("#txtSearch,#txtSearch2").forEach(elm => elm.addEventListener('keyup', (e) => {
      SlickGlobalEditorLock.cancelCurrentEdit();

      // clear on Esc
      if (e.which == 27) e.target.value = '';

      this.searchString = (e.target.value || '').trim();
      this.updateFilter();
      this.dataView.refresh();
    }));

    document.querySelector("#btnSelectRows").addEventListener('click', () => {
      if (!SlickGlobalEditorLock.commitCurrentEdit()) {
        return;
      }
      let rows = [];

      for (let i = 0; i < 10 && i < this.dataView.getLength(); i++) {
        rows.push(i);
      }
      this.grid.setSelectedRows(rows);
    });

    // initialize the model after all the events have been hooked up
    this.dataView.beginUpdate();
    this.dataView.setItems(this.data);
    this.dataView.setFilterArgs({
      percentCompleteThreshold: this.percentCompleteThreshold,
      searchString: this.searchString
    });
    // `inlineFilters` can be a regular function or an ES6 arrow function like below
    // this.dataView.setFilter((item, args) => item['percentComplete'] > args.percentCompleteThreshold);
    this.dataView.setFilter((item, args) => {
      if (item['percentComplete'] < args.percentCompleteThreshold) {
        return false;
      }

      const searchString = args.searchString.toLowerCase();
      if (args.searchString != '' && !item['title'].toLowerCase().includes(searchString)) {
        return false;
      }

      return true;
    });
    this.dataView.endUpdate();

    // if you don't want the items that are not visible (due to being filtered out
    // or being on a different page) to stay selected, pass 'false' to the second arg
    this.dataView.syncGridSelection(this.grid, true);

    document.querySelector('.sgi-search').addEventListener('click', this.toggleFilterRow.bind(this));
    document.querySelector('[data-test="add-50k-rows-btn"]').addEventListener('click', () => this.setData(this.getData(50000)));
    document.querySelector('[data-test="add-500k-rows-btn"]').addEventListener('click', () => this.setData(this.getData(500000)));
    document.querySelector('[data-test="add-1M-rows-btn"]').addEventListener('click', () => this.setData(this.getData(1000000)));
  }

  comparer(a, b) {
    let x = a[this.sortcol], y = b[this.sortcol];
    return (x == y ? 0 : (x > y ? 1 : -1));
  }

  setData(data) {
    this.dataView.setItems(data);
  }

  getData(count) {
    // prepare the data
    let tmpData = [];
    for (let i = 0; i < count; i++) {
      let d = (tmpData[i] = {});

      d["id"] = "id_" + i;
      d["num"] = i;
      d["title"] = "Task " + i;
      d["duration"] = "5 days";
      d["percentComplete"] = Math.round(Math.random() * 100);
      d["start"] = "01/01/2009";
      d["finish"] = "01/05/2009";
      d["effortDriven"] = (i % 5 == 0);
    }
    return tmpData;
  }

  percentCompleteSort(a, b) {
    return a["percentComplete"] - b["percentComplete"];
  }

  requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return { valid: false, msg: 'This is a required field' };
    } else if (!/^(task\s\d+)*$/i.test(value)) {
      return { valid: false, msg: 'Your title is invalid, it must start with "Task" followed by a number.' };
    }
    else {
      return { valid: true, msg: null };
    }
  }

  toggleFilterRow() {
    this.grid.setTopPanelVisibility(!this.grid.getOptions().showTopPanel);
  }

  updateFilter() {
    this.dataView.setFilterArgs({
      percentCompleteThreshold: this.percentCompleteThreshold,
      searchString: this.searchString
    });
    this.dataView.refresh();
  }
}
