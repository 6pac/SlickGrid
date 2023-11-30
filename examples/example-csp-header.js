let grid;
let dataView;
let searchString;
let columns = [
  { id: "title", name: "Title", field: "title" },
  { id: "duration", name: "Duration", field: "duration" },
  { id: "%", name: "% Complete", field: "percentComplete", selectable: false, width: 100 },
  { id: "start", name: "Start", field: "start" },
  { id: "finish", name: "Finish", field: "finish" },
  { id: "effort-driven", name: "Effort Driven", field: "effortDriven", width: 100 }
];

let options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  nonce: 'random-string',
  // autoHeight: true,
  sanitizer: (html) => DOMPurify.sanitize(html, { RETURN_TRUSTED_TYPE: true }) // this sanitizer fixes CSP:: require-trusted-types-for 'script'
};

document.addEventListener("DOMContentLoaded", function () {
  let gridElement = document.getElementById("myGrid");
  gridElement.style.width = "600px";
  gridElement.style.height = "500px";
  let search = document.getElementById("search");
  let searchLabel= document.getElementById("search-label");
  searchLabel.style.width = "200px";
  searchLabel.style.float = "left";
  search.style.width = "100px";
  search.addEventListener("input", function (e) {
    searchString = e.target.value;
    updateFilter();
  });

  let linkElement = document.getElementById("link");
  //text-decoration: none; font-size: 22px
  linkElement.style.textDecoration = "none";
  linkElement.style.fontSize = "22px";

  let data = [];
  for (let i = 0; i < 500; i++) {
    data[i] = {
      id: i,
      title: "Task " + i,
      duration: "5 days",
      percentComplete: Math.round(Math.random() * 100),
      start: "01/01/2009",
      finish: "01/05/2009",
      effortDriven: (i % 5 === 0)
    };
  }

  dataView = new Slick.Data.DataView({ inlineFilters: true, useCSPSafeFilter: true });
  dataView.getItemMetadata = function (row) {
    if (row % 2 === 1) {
      return {
        "columns": {
          "duration": {
            "colspan": 3
          }
        }
      };
    } else {
      return {
        "columns": {
          0: {
            "colspan": "*"
          }
        }
      };
    }
  };

  grid = new Slick.Grid("#myGrid", dataView, columns, options);
  dataView.grid = grid;
  grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: true}));

  grid.onSort.subscribe(function (e, args) {
    const comparer = function (a, b) {
      if (args.sortCols[0].sortAsc) {
        return (a[args.sortCols[0].sortCol.field] > b[args.sortCols[0].sortCol.field]) ? 1 : -1;
      } else {
        return (a[args.sortCols[0].sortCol.field] < b[args.sortCols[0].sortCol.field]) ? 1 : -1;
      }
    };
    this.getData().sort(comparer, args.sortAsc);
  });

  dataView.onRowCountChanged.subscribe(function (e, args) {
    args.dataView.grid.updateRowCount();
    args.dataView.grid.render();
  });

  dataView.onRowsChanged.subscribe(function (e, args) {
    args.dataView.grid.invalidateRows(args.rows);
    args.dataView.grid.render();
  });

  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilterArgs({ searchString });
  dataView.setFilter(myFilter);
  dataView.endUpdate();
});

function updateFilter() {
  dataView.setFilterArgs({
    searchString
  });
  dataView.refresh();
}

function myFilter(item, args) {
  let searchForString = args.searchString?.toLowerCase();
  //Check if input is empty
  if (searchForString?.length === 0 || !searchForString) {
      return true;
  }
  // Check if input value includes searchString value
  for (let i = 0; i < columns.length; i++) {
    if (item[columns[i]?.field] !== null && item[columns[i]?.field].toString().toLowerCase().includes(searchForString)) {
      return true;
    }
  }

  return false;
}