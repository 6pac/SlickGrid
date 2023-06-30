"use strict";
(() => {
  // src/slick.formatters.js
  var Utils = Slick.Utils;
  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    return value == null || value === "" ? "-" : value < 50 ? "<span style='color:red;font-weight:bold;'>" + value + "%</span>" : "<span style='color:green'>" + value + "%</span>";
  }
  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "")
      return "";
    var color;
    return value < 30 ? color = "red" : value < 70 ? color = "silver" : color = "green", "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%' title='" + value + "%'></span>";
  }
  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }
  function CheckboxFormatter(row, cell, value, columnDef, dataContext) {
    return `<span class="sgi sgi-checkbox-${value ? "intermediate" : "blank-outline"}"></span>`;
  }
  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? '<span class="sgi sgi-check"></span>' : "";
  }
  var Formatters = {
    PercentComplete: PercentCompleteFormatter,
    PercentCompleteBar: PercentCompleteBarFormatter,
    YesNo: YesNoFormatter,
    Checkmark: CheckmarkFormatter,
    Checkbox: CheckboxFormatter
  };
  window.Slick && Utils.extend(Slick, {
    Formatters
  });
})();
