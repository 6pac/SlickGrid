"use strict";
(() => {
  // src/slick.remotemodel.js
  (function($) {
    function RemoteModel() {
      var PAGESIZE = 50, data = { length: 0 }, searchstr = "", sortcol = null, sortdir = 1, h_request = null, req = null, onDataLoading = new Slick.Event(), onDataLoaded = new Slick.Event();
      function init() {
      }
      function isDataLoaded(from, to) {
        for (var i = from; i <= to; i++)
          if (data[i] == null || data[i] == null)
            return !1;
        return !0;
      }
      function clear() {
        for (var key in data)
          delete data[key];
        data.length = 0;
      }
      function ensureData(from, to) {
        if (req) {
          req.abort();
          for (var i = req.fromPage; i <= req.toPage; i++)
            data[i * PAGESIZE] = void 0;
        }
        from < 0 && (from = 0), data.length > 0 && (to = Math.min(to, data.length - 1));
        for (var fromPage = Math.floor(from / PAGESIZE), toPage = Math.floor(to / PAGESIZE); data[fromPage * PAGESIZE] !== void 0 && fromPage < toPage; )
          fromPage++;
        for (; data[toPage * PAGESIZE] !== void 0 && fromPage < toPage; )
          toPage--;
        if (fromPage > toPage || fromPage == toPage && data[fromPage * PAGESIZE] !== void 0) {
          onDataLoaded.notify({ from, to });
          return;
        }
        var url = "http://octopart.com/api/v3/parts/search?apikey=68b25f31&include[]=short_description&show[]=uid&show[]=manufacturer&show[]=mpn&show[]=brand&show[]=octopart_url&show[]=short_description&q=" + searchstr + "&start=" + fromPage * PAGESIZE + "&limit=" + ((toPage - fromPage) * PAGESIZE + PAGESIZE);
        sortcol != null && (url += "&sortby=" + sortcol + (sortdir > 0 ? "+asc" : "+desc")), h_request != null && clearTimeout(h_request), h_request = setTimeout(function() {
          for (var i2 = fromPage; i2 <= toPage; i2++)
            data[i2 * PAGESIZE] = null;
          onDataLoading.notify({ from, to }), req = $.jsonp({
            url,
            callbackParameter: "callback",
            cache: !0,
            success: onSuccess,
            error: function() {
              onError(fromPage, toPage);
            }
          }), req.fromPage = fromPage, req.toPage = toPage;
        }, 50);
      }
      function onError(fromPage, toPage) {
        alert("error loading pages " + fromPage + " to " + toPage);
      }
      function onSuccess(resp) {
        var from = resp.request.start, to = from + resp.results.length;
        data.length = Math.min(parseInt(resp.hits), 1e3);
        for (var i = 0; i < resp.results.length; i++) {
          var item = resp.results[i].item;
          data[from + i] = item, data[from + i].index = from + i;
        }
        req = null, onDataLoaded.notify({ from, to });
      }
      function reloadData(from, to) {
        for (var i = from; i <= to; i++)
          delete data[i];
        ensureData(from, to);
      }
      function setSort(column, dir) {
        sortcol = column, sortdir = dir, clear();
      }
      function setSearch(str) {
        searchstr = str, clear();
      }
      return {
        // properties
        data,
        // methods
        clear,
        isDataLoaded,
        ensureData,
        reloadData,
        setSort,
        setSearch,
        // events
        onDataLoading,
        onDataLoaded
      };
    }
    $.extend(!0, window, {
      Slick: {
        Data: {
          RemoteModel
        }
      }
    });
  })(jQuery);
})();
