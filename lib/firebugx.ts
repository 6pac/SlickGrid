var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
      "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"] as const;

type Names = typeof names[number]

if (typeof console === "undefined" || typeof console.log === "undefined") {
  window.console = {} as Console;
  for (var i = 0; i < names.length; ++i) {
    (window as any).console[names[i]] = function() {}
  }
}
