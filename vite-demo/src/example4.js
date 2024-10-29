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

import Example4 from './example4.html?raw';
import './example4.scss'

/** render Example HTML code */
export function render() {
  return Example4;
}

/** initialize Example JS code */
export function init() {
  let dataView;
  let grid;
  let data = [];
  let columns = [
    { id: "sel", name: "#", field: "num", behavior: "select", cssClass: "cell-selection", width: 45, cannotTriggerInsert: true, resizable: false, selectable: false, excludeFromColumnPicker: true },
    { id: "title", name: "Title", field: "title", width: 110, minWidth: 100, cssClass: "cell-title", editor: Editors.LongText, validator: requiredFieldValidator, sortable: true },
    { id: "duration", name: "Duration", field: "duration", editor: Editors.Text, sortable: true },
    { id: "%", defaultSortAsc: false, name: "% Complete", field: "percentComplete", width: 95, formatter: Formatters.PercentCompleteBar, editor: Editors.PercentComplete, sortable: true },
    { id: "start", name: "Start", field: "start", minWidth: 60, editor: Editors.Flatpickr, sortable: true },
    { id: "finish", name: "Finish", field: "finish", minWidth: 60, editor: Editors.Flatpickr, sortable: true },
    { id: "effort-driven", name: "Effort Driven", width: 120, minWidth: 20, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Formatters.Checkbox, editor: Editors.Checkbox, cannotTriggerInsert: true, sortable: true }
  ];

  let options = {
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

  let sortcol = "title";
  let sortdir = 1;
  let percentCompleteThreshold = 0;
  let searchString = "";

  function toggleTheme(theme) {
    const gridElm = document.querySelector('#myGrid');

    if (theme === 'alpine') {
      changeCSS('../dist/styles/css/slick.grid.css', '../dist/styles/css/slick-alpine-theme.css');
      changeCSS('examples.css', '../dist/styles/css/example-demo.css');
      changeCSS('examples-unicode-icons.css', '../dist/styles/css/slick-icons.css');
      gridElm.classList.add('alpine-theme');
      gridElm.classList.remove('classic-theme');
    } else {
      changeCSS('../dist/styles/css/slick-alpine-theme.css', '../dist/styles/css/slick.grid.css');
      changeCSS('../dist/styles/css/example-demo.css', 'examples.css');
      changeCSS('../dist/styles/css/slick-icons.css', 'examples-unicode-icons.css');
      gridElm.classList.add('classic-theme');
      gridElm.classList.remove('alpine-theme');
    }
  }

  function changeCSS(prevFilePath, newFilePath) {
    let headerIndex = 0;
    let previousCssElm = document.getElementsByTagName("head")[0].querySelector(`link[href="${prevFilePath}"]`);
    if (previousCssElm) {
      previousCssElm.setAttribute('href', newFilePath);
    }
  }

  function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return { valid: false, msg: 'This is a required field' };
    } else if (!/^(task\s\d+)*$/i.test(value)) {
      return { valid: false, msg: 'Your title is invalid, it must start with "Task" followed by a number.' };
    }
    else {
      return { valid: true, msg: null };
    }
  }

  function percentCompleteSort(a, b) {
    return a["percentComplete"] - b["percentComplete"];
  }

  function comparer(a, b) {
    let x = a[sortcol], y = b[sortcol];
    return (x == y ? 0 : (x > y ? 1 : -1));
  }

  function toggleFilterRow() {
    grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
  }

  // prepare the data
  for (let i = 0; i < 50000; i++) {
    let d = (data[i] = {});

    d["id"] = "id_" + i;
    d["num"] = i;
    d["title"] = "Task " + i;
    d["duration"] = "5 days";
    d["percentComplete"] = Math.round(Math.random() * 100);
    d["start"] = "01/01/2009";
    d["finish"] = "01/05/2009";
    d["effortDriven"] = (i % 5 == 0);
  }

  // instantiate SlickGrid and SlickDataView
  dataView = new SlickDataView({ inlineFilters: true });
  grid = new SlickGrid("#myGrid", dataView, columns, options);
  grid.setSelectionModel(new SlickRowSelectionModel());

  let pager = new SlickGridPager(dataView, grid, "#pager");
  let columnpicker = new SlickColumnPicker(columns, grid, options);
  let gridMenu = new SlickGridMenu(columns, grid, options);

  // move the filter panel defined in a hidden div into grid top panel
  let topPanel = grid.getTopPanel();
  const topPanelLeftElm = document.querySelector("#inlineFilterPanel");
  topPanel.appendChild(topPanelLeftElm);
  topPanelLeftElm.style.display = 'block';

  grid.onCellChange.subscribe((e, args) => {
    dataView.updateItem(args.item.id, args.item);
  });

  grid.onAddNewRow.subscribe((e, args) => {
    let item = { "num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false };
    Utils.extend(item, args.item);
    dataView.addItem(item);
  });

  grid.onKeyDown.subscribe(function (e) {
    // select all rows on ctrl-a
    if (e.which != 65 || !e.ctrlKey) {
      return false;
    }

    let rows = [];
    for (let i = 0; i < dataView.getLength(); i++) {
      rows.push(i);
    }

    grid.setSelectedRows(rows);
    e.preventDefault();
  });

  grid.onSort.subscribe((e, args) => {
    sortdir = args.sortAsc ? 1 : -1;
    sortcol = args.sortCol.field;

    // using native sort with comparer
    dataView.sort(comparer, args.sortAsc);
  });

  grid.onBeforeEditCell.subscribe((e, args) => {
    if (args.item.title === 'Task 18') {
      return false;
    }
  });

  // wire up model events to drive the grid
  // !! both dataView.onRowCountChanged and dataView.onRowsChanged MUST be wired to correctly update the grid
  // see Issue#91
  dataView.onRowCountChanged.subscribe((e, args) => {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe((e, args) => {
    grid.invalidateRows(args.rows);
    grid.render();
  });

  dataView.onPagingInfoChanged.subscribe((e, pagingInfo) => {
    grid.updatePagingStatusFromView(pagingInfo);
    // show the pagingInfo but remove the dataView from the object, just for the Cypress E2E test
    delete pagingInfo.dataView;
    console.log('on After Paging Info Changed - New Paging:: ', pagingInfo);
  });

  dataView.onBeforePagingInfoChanged.subscribe((e, previousPagingInfo) => {
    // show the previous pagingInfo but remove the dataView from the object, just for the Cypress E2E test
    delete previousPagingInfo.dataView;
    console.log('on Before Paging Info Changed - Previous Paging:: ', previousPagingInfo);
  });

  let h_runfilters = null;

  // wire up the slider to apply the filter to the model
  let slider = document.getElementById("pcSlider");
  let slider2 = document.getElementById("pcSlider2");
  let sliderCallback = function () {
    SlickGlobalEditorLock.cancelCurrentEdit();

    if (percentCompleteThreshold != this.value) {
      window.clearTimeout(h_runfilters);
      h_runfilters = window.setTimeout(updateFilter, 10);
      percentCompleteThreshold = this.value;
    }
  }

  slider.oninput = sliderCallback;
  slider2.oninput = sliderCallback;

  // wire up the search textbox to apply the filter to the model
  document.querySelectorAll("#txtSearch,#txtSearch2").forEach(elm => elm.addEventListener('keyup', (e) => {
    SlickGlobalEditorLock.cancelCurrentEdit();

    // clear on Esc
    if (e.which == 27) e.target.value = '';

    searchString = (e.target.value || '').trim();
    updateFilter();
    dataView.refresh();
  }));

  function updateFilter() {
    dataView.setFilterArgs({
      percentCompleteThreshold,
      searchString
    });
    dataView.refresh();
  }

  document.querySelector("#btnSelectRows").addEventListener('click', () => {
    if (!SlickGlobalEditorLock.commitCurrentEdit()) {
      return;
    }
    let rows = [];

    for (let i = 0; i < 10 && i < dataView.getLength(); i++) {
      rows.push(i);
    }
    grid.setSelectedRows(rows);
  });

  // initialize the model after all the events have been hooked up
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilterArgs({
    percentCompleteThreshold,
    searchString
  });
  // `inlineFilters` can be a regular function or an ES6 arrow function like below
  // dataView.setFilter((item, args) => item['percentComplete'] > args.percentCompleteThreshold);
  dataView.setFilter((item, args) => {
    if (item['percentComplete'] < args.percentCompleteThreshold) {
      return false;
    }

    const searchString = args.searchString.toLowerCase();
    if (args.searchString != '' && !item['title'].toLowerCase().includes(searchString)) {
      return false;
    }

    return true;
  });
  dataView.endUpdate();

  // if you don't want the items that are not visible (due to being filtered out
  // or being on a different page) to stay selected, pass 'false' to the second arg
  dataView.syncGridSelection(grid, true);

  document.querySelector('.sgi-search').addEventListener('click', toggleFilterRow);
}
