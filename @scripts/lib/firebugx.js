"use strict";
var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
if (typeof console === "undefined" || typeof console.log === "undefined") {
    window.console = {};
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function () { };
    }
}
