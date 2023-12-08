"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/slick.remotemodel-yahoo.ts
  var SlickRemoteModelYahoo = class {
    constructor() {
      // protected
      __publicField(this, "PAGESIZE", 10);
      __publicField(this, "data", { length: 0 });
      __publicField(this, "h_request", null);
      __publicField(this, "req", null);
      // ajax request
      // events
      __publicField(this, "onDataLoading", new Slick.Event("onDataLoading"));
      __publicField(this, "onDataLoaded", new Slick.Event("onDataLoaded"));
      if (!(window.$ || window.jQuery) || !window.$.jsonp)
        throw new Error("SlickRemoteModel requires both jQuery and jQuery jsonp library to be loaded.");
      this.init();
    }
    init() {
    }
    isDataLoaded(from, to) {
      for (let i = from; i <= to; i++)
        if (this.data[i] === void 0 || this.data[i] === null)
          return !1;
      return !0;
    }
    clear() {
      for (let key in this.data)
        delete this.data[key];
      this.data.length = 0;
    }
    ensureData(from, to) {
      if (this.req) {
        this.req.abort();
        for (let i = this.req.fromPage; i <= this.req.toPage; i++)
          this.data[i * this.PAGESIZE] = void 0;
      }
      from < 0 && (from = 0), this.data.length > 0 && (to = Math.min(to, this.data.length - 1));
      let fromPage = Math.floor(from / this.PAGESIZE), toPage = Math.floor(to / this.PAGESIZE);
      for (; this.data[fromPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
        fromPage++;
      for (; this.data[toPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
        toPage--;
      if (fromPage > toPage || fromPage === toPage && this.data[fromPage * this.PAGESIZE] !== void 0) {
        this.onDataLoaded.notify({ from, to });
        return;
      }
      let recStart = fromPage * this.PAGESIZE, recCount = (toPage - fromPage) * this.PAGESIZE + this.PAGESIZE, url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(" + recStart + "%2C" + recCount + ")%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json";
      this.h_request !== null && clearTimeout(this.h_request), this.h_request = setTimeout(() => {
        for (let i = fromPage; i <= toPage; i++)
          this.data[i * this.PAGESIZE] = null;
        this.onDataLoading.notify({ from, to }), this.req = window.$.jsonp({
          url,
          callbackParameter: "callback",
          cache: !0,
          success: (json) => {
            this.onSuccess(json, recStart);
          },
          error: () => {
            this.onError(fromPage, toPage);
          }
        }), this.req.fromPage = fromPage, this.req.toPage = toPage;
      }, 50);
    }
    onError(fromPage, toPage) {
      alert("error loading pages " + fromPage + " to " + toPage);
    }
    // SAMPLE DATA
    //    {
    //      "query": {
    //        "count": 40,
    //        "created": "2015-03-03T00:34:00Z",
    //        "lang": "en-US",
    //        "results": {
    //          "item": [
    //            {
    //              "title": "Netanyahu assails Iran deal, touts US-Israel ties",
    //              "description": "<p><a href=\"http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html\"><img src=\"http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg\" width=\"130\" height=\"86\" alt=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" align=\"left\" title=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" border=\"0\" /></a>WASHINGTON (AP) — Seeking to lower tensions, Benjamin Netanyahu and U.S. officials cast their dispute over Iran as a family squabble on Monday, even as the Israeli leader claimed President Barack Obama did not — and could not — fully understand his nation&#039;s vital security concerns.</p><br clear=\"all\"/>",
    //              "link": "http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html",
    //              "pubDate": "Mon, 02 Mar 2015 19:17:36 -0500",
    //              "source": {
    //                "url": "http://www.ap.org/",
    //                "content": "Associated Press"
    //              },
    //              "guid": {
    //                "isPermaLink": "false",
    //                "content": "netanyahu-us-officials-face-off-iran-133539021--politics"
    //              },
    //              "content": {
    //                "height": "86",
    //                "type": "image/jpeg",
    //                "url": "http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg",
    //                "width": "130"
    //              },
    //              "text": {
    //                "type": "html",
    //                "content": "<p><a href=\"http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html\"><img src=\"http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg\" width=\"130\" height=\"86\" alt=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" align=\"left\" title=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" border=\"0\" /></a>WASHINGTON (AP) — Seeking to lower tensions, Benjamin Netanyahu and U.S. officials cast their dispute over Iran as a family squabble on Monday, even as the Israeli leader claimed President Barack Obama did not — and could not — fully understand his nation&#039;s vital security concerns.</p><br clear=\"all\"/>"
    //              },
    //              "credit": {
    //                "role": "publishing company"
    //              }
    //            },
    //            {... },
    //            {... },
    //          ]
    //        }
    //      }
    //    }
    onSuccess(json, recStart) {
      let recEnd = recStart;
      if (json.query.count > 0) {
        let results = json.query.results.item;
        recEnd = recStart + results.length, this.data.length = 100;
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          item.pubDate = new Date(item.pubDate), this.data[recStart + i] = { index: recStart + i }, this.data[recStart + i].pubDate = item.pubDate, this.data[recStart + i].title = item.title, this.data[recStart + i].url = item.link, this.data[recStart + i].text = item.description;
        }
      }
      this.req = null, this.onDataLoaded.notify({ from: recStart, to: recEnd });
    }
    reloadData(from, to) {
      for (let i = from; i <= to; i++)
        delete this.data[i];
      this.ensureData(from, to);
    }
    // return {
    //   // properties
    //   "data": data,
    //   // methods
    //   "clear": clear,
    //   "isDataLoaded": isDataLoaded,
    //   "ensureData": ensureData,
    //   "reloadData": reloadData,
    //   // events
    //   "onDataLoading": onDataLoading,
    //   "onDataLoaded": onDataLoaded
    // };
  };
  window.Slick && (window.Slick.Data = window.Slick.Data || {}, window.Slick.Data.RemoteModelYahoo = SlickRemoteModelYahoo);
})();
//# sourceMappingURL=slick.remotemodel-yahoo.js.map
