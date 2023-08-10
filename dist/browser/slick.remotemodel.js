"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/slick.remotemodel.js
  var require_slick_remotemodel = __commonJS({
    "src/slick.remotemodel.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickRemoteModel = void 0;
      var SlickRemoteModel = (
        /** @class */
        function() {
          function SlickRemoteModel2() {
            if (this.PAGESIZE = 50, this.data = { length: 0 }, this.searchstr = "", this.sortcol = null, this.sortdir = 1, this.h_request = null, this.req = null, this.onDataLoading = new Slick.Event(), this.onDataLoaded = new Slick.Event(), !window.$ || !window.$.jsonp)
              throw new Error("SlickRemoteModel requires jQuery jsonp library to be loaded.");
            this.init();
          }
          return SlickRemoteModel2.prototype.init = function() {
          }, SlickRemoteModel2.prototype.isDataLoaded = function(from, to) {
            for (var i = from; i <= to; i++)
              if (this.data[i] == null || this.data[i] == null)
                return !1;
            return !0;
          }, SlickRemoteModel2.prototype.clear = function() {
            for (var key in this.data)
              delete this.data[key];
            this.data.length = 0;
          }, SlickRemoteModel2.prototype.ensureData = function(from, to) {
            var _this = this;
            if (this.req) {
              this.req.abort();
              for (var i = this.req.fromPage; i <= this.req.toPage; i++)
                this.data[i * this.PAGESIZE] = void 0;
            }
            from < 0 && (from = 0), this.data.length > 0 && (to = Math.min(to, this.data.length - 1));
            for (var fromPage = Math.floor(from / this.PAGESIZE), toPage = Math.floor(to / this.PAGESIZE); this.data[fromPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
              fromPage++;
            for (; this.data[toPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
              toPage--;
            if (fromPage > toPage || fromPage == toPage && this.data[fromPage * this.PAGESIZE] !== void 0) {
              this.onDataLoaded.notify({ from, to });
              return;
            }
            var url = "http://octopart.com/api/v3/parts/search?apikey=68b25f31&include[]=short_description&show[]=uid&show[]=manufacturer&show[]=mpn&show[]=brand&show[]=octopart_url&show[]=short_description&q=" + this.searchstr + "&start=" + fromPage * this.PAGESIZE + "&limit=" + ((toPage - fromPage) * this.PAGESIZE + this.PAGESIZE);
            this.sortcol != null && (url += "&sortby=" + this.sortcol + (this.sortdir > 0 ? "+asc" : "+desc")), this.h_request != null && clearTimeout(this.h_request), this.h_request = setTimeout(function() {
              for (var i2 = fromPage; i2 <= toPage; i2++)
                _this.data[i2 * _this.PAGESIZE] = null;
              _this.onDataLoading.notify({ from, to }), _this.req = window.$.jsonp({
                url,
                callbackParameter: "callback",
                cache: !0,
                success: _this.onSuccess,
                error: function() {
                  return _this.onError(fromPage, toPage);
                }
              }), _this.req.fromPage = fromPage, _this.req.toPage = toPage;
            }, 50);
          }, SlickRemoteModel2.prototype.onError = function(fromPage, toPage) {
            alert("error loading pages " + fromPage + " to " + toPage);
          }, SlickRemoteModel2.prototype.onSuccess = function(resp) {
            var from = resp.request.start, to = from + resp.results.length;
            this.data.length = Math.min(parseInt(resp.hits), 1e3);
            for (var i = 0; i < resp.results.length; i++) {
              var item = resp.results[i].item;
              this.data[from + i] = item, this.data[from + i].index = from + i;
            }
            this.req = null, this.onDataLoaded.notify({ from, to });
          }, SlickRemoteModel2.prototype.reloadData = function(from, to) {
            for (var i = from; i <= to; i++)
              delete this.data[i];
            this.ensureData(from, to);
          }, SlickRemoteModel2.prototype.setSort = function(column, dir) {
            this.sortcol = column, this.sortdir = dir, this.clear();
          }, SlickRemoteModel2.prototype.setSearch = function(str) {
            this.searchstr = str, this.clear();
          }, SlickRemoteModel2;
        }()
      );
      exports.SlickRemoteModel = SlickRemoteModel;
      window.Slick && (window.Slick.Data = window.Slick.Data || {}, window.Slick.Data.RemoteModel = SlickRemoteModel);
    }
  });
  require_slick_remotemodel();
})();
//# sourceMappingURL=slick.remotemodel.js.map
