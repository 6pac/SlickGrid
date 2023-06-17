import { Utils as Utils_ } from './slick.core';

// for (iife) load Slick methods from global Slick object, or use imports for (cjs/esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */

export function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

export function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%' title='" + value + "%'></span>";
  }

export function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

export function CheckboxFormatter(row, cell, value, columnDef, dataContext) {
  return `<span class="sgi sgi-checkbox-${value ? 'intermediate' : 'blank-outline'}"></span>`;
}

export function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
  return value ? `<span class="sgi sgi-check"></span>` : '';
}

export const Formatters = {
  PercentComplete: PercentCompleteFormatter,
  PercentCompleteBar: PercentCompleteBarFormatter,
  YesNo: YesNoFormatter,
  Checkmark: CheckmarkFormatter,
  Checkbox: CheckboxFormatter
};

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Formatters
  });
}

