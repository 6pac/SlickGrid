var grid;
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
  for (var i = 0; i < 500; i++) {
    data[i] = {
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

  grid = new Slick.Grid("#myGrid", data, columns, options);

  grid.setSelectionModel(new Slick.CellSelectionModel());
});