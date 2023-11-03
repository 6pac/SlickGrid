var grid;
var dataView;
var searchString;
var columns = [
  { id: "title", name: "Title", field: "title" },
  { id: "duration", name: "Duration", field: "duration" },
  { id: "%", name: "% Complete", field: "percentComplete", selectable: false, width: 100 },
  { id: "start", name: "Start", field: "start" },
  { id: "finish", name: "Finish", field: "finish" },
  { id: "effort-driven", name: "Effort Driven", field: "effortDriven", width: 100 }
];

var options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  nonce: 'random-string',
  sanitizer: (html) => DOMPurify.sanitize(html, { RETURN_TRUSTED_TYPE: true })
};

document.addEventListener("DOMContentLoaded", function () {
  let gridElement = document.getElementById("myGrid");
  gridElement.style.width = "600px";
  gridElement.style.height = "500px";

  let linkElement = document.getElementById("link");
  //text-decoration: none; font-size: 22px
  linkElement.style.textDecoration = "none";
  linkElement.style.fontSize = "22px";

  var data = [];
  for (var i = 0; i < 500000; i++) {
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

  data.getItemMetadata = function (row) {
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

  dataView = new Slick.Data.DataView({ inlineFilters: true });
  grid = new Slick.Grid("#myGrid", dataView, columns, options);
  dataView.grid = grid;
  // grid.setSelectionModel(new Slick.CellSelectionModel());
  grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: true}));

  grid.onSort.subscribe(function (e, args) {
    var comparer = function (a, b) {
      if (args.sortCols[0].sortAsc)
        return (a[args.sortCols[0].sortCol.field] > b[args.sortCols[0].sortCol.field]) ? 1 : -1;
      else
        return (a[args.sortCols[0].sortCol.field] < b[args.sortCols[0].sortCol.field]) ? 1 : -1;
    }

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
  dataView.setFilterArgs({ searchString: searchString });
 dataView.setFilter(myFilter);
  dataView.endUpdate();
});
function updateFilter() {
  dataView.setFilterArgs({
    searchString: searchString
  });
  dataView.refresh();
}
function myFilter(item, args) {
  console.log(item, args)
  var searchForString = args.searchString?.toLowerCase();
  //Check if input is empty
  if (searchForString?.length == 0 || !searchForString) {
      return true;
  }
  let keys = columns;// args.context.keys;
  //Check if input value includes searchString value
  for (var i = 0; i < keys.length; i++) {
      if (item[keys[i]?.field] != null) {
          if (item[keys[i]?.field].toString().toLowerCase().includes(searchForString)) {
              return true;
          }
      }
  }

  return false;
}