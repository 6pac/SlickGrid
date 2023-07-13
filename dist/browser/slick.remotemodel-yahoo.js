"use strict";
(() => {
  // src/slick.remotemodel-yahoo.js
  (function($) {
    function RemoteModel() {
      var PAGESIZE = 10, data = { length: 0 }, h_request = null, req = null, onDataLoading = new Slick.Event(), onDataLoaded = new Slick.Event();
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
        var recStart = fromPage * PAGESIZE, recCount = (toPage - fromPage) * PAGESIZE + PAGESIZE, url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(" + recStart + "%2C" + recCount + ")%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json";
        h_request != null && clearTimeout(h_request), h_request = setTimeout(function() {
          for (var i2 = fromPage; i2 <= toPage; i2++)
            data[i2 * PAGESIZE] = null;
          onDataLoading.notify({ from, to }), req = $.jsonp({
            url,
            callbackParameter: "callback",
            cache: !0,
            success: function(json, textStatus, xOptions) {
              onSuccess(json, recStart);
            },
            error: function() {
              onError(fromPage, toPage);
            }
          }), req.fromPage = fromPage, req.toPage = toPage;
        }, 50);
      }
      function onError(fromPage, toPage) {
        alert("error loading pages " + fromPage + " to " + toPage);
      }
      function onSuccess(json, recStart) {
        var recEnd = recStart;
        if (json.query.count > 0) {
          var results = json.query.results.item;
          recEnd = recStart + results.length, data.length = 100;
          for (var i = 0; i < results.length; i++) {
            var item = results[i];
            item.pubDate = new Date(item.pubDate), data[recStart + i] = { index: recStart + i }, data[recStart + i].pubDate = item.pubDate, data[recStart + i].title = item.title, data[recStart + i].url = item.link, data[recStart + i].text = item.description;
          }
        }
        req = null, onDataLoaded.notify({ from: recStart, to: recEnd });
      }
      function reloadData(from, to) {
        for (var i = from; i <= to; i++)
          delete data[i];
        ensureData(from, to);
      }
      return {
        // properties
        data,
        // methods
        clear,
        isDataLoaded,
        ensureData,
        reloadData,
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
