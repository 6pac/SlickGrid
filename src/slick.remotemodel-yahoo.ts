/***
 * A sample AJAX data store implementation.
 * Right now, it's hooked up to load Hackernews stories, but can
 * easily be extended to support any JSONP-compatible backend that accepts paging parameters.
 */
export class SlickRemoteModelYahoo {
  // protected
  protected PAGESIZE = 10;
  protected data: any = { length: 0 };
  protected h_request: any = null;
  protected req: any = null; // ajax request

  // events
  protected onDataLoading = new Slick.Event();
  protected onDataLoaded = new Slick.Event();

  constructor() {
    if (!(window.$ || window.jQuery) || !window.$.jsonp) {
      throw new Error('SlickRemoteModel requires both jQuery and jQuery jsonp library to be loaded.');
    }
    this.init();
  }

  init() { }

  isDataLoaded(from: number, to: number) {
    for (let i = from; i <= to; i++) {
      if (this.data[i] == undefined || this.data[i] == null) {
        return false;
      }
    }

    return true;
  }

  clear() {
    for (const key in this.data) {
      delete this.data[key];
    }
    this.data.length = 0;
  }

  ensureData(from: number, to: number) {
    if (this.req) {
      this.req.abort();
      for (let i = this.req.fromPage; i <= this.req.toPage; i++) {
        this.data[i * this.PAGESIZE] = undefined;
      }
    }

    if (from < 0) {
      from = 0;
    }

    if (this.data.length > 0) {
      to = Math.min(to, this.data.length - 1);
    }

    let fromPage = Math.floor(from / this.PAGESIZE);
    let toPage = Math.floor(to / this.PAGESIZE);

    while (this.data[fromPage * this.PAGESIZE] !== undefined && fromPage < toPage)
      fromPage++;

    while (this.data[toPage * this.PAGESIZE] !== undefined && fromPage < toPage)
      toPage--;

    if (fromPage > toPage || ((fromPage == toPage) && this.data[fromPage * this.PAGESIZE] !== undefined)) {
      // TODO:  look-ahead
      this.onDataLoaded.notify({ from, to });
      return;
    }

    const recStart = (fromPage * this.PAGESIZE);
    const recCount = (((toPage - fromPage) * this.PAGESIZE) + this.PAGESIZE);

    const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss"
      + "(" + recStart + "%2C" + recCount + ")"
      + "%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22"
      + "&format=json";

    if (this.h_request != null) {
      clearTimeout(this.h_request);
    }

    this.h_request = setTimeout(() => {
      for (let i = fromPage; i <= toPage; i++)
        this.data[i * this.PAGESIZE] = null; // null indicates a 'requested but not available yet'

      this.onDataLoading.notify({ from: from, to: to });

      this.req = window.$.jsonp({
        url,
        callbackParameter: "callback",
        cache: true,
        success: (json: any) => {
          this.onSuccess(json, recStart);
        },
        error: () => {
          this.onError(fromPage, toPage);
        }
      });

      this.req.fromPage = fromPage;
      this.req.toPage = toPage;
    }, 50);
  }


  onError(fromPage: number, toPage: number) {
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

  onSuccess(json: any, recStart: number) {
    let recEnd = recStart;
    if (json.query.count > 0) {
      const results = json.query.results.item;
      recEnd = recStart + results.length;
      this.data.length = 100;// Math.min(parseInt(results.length),1000); // limitation of the API

      for (let i = 0; i < results.length; i++) {
        const item = results[i];

        item.pubDate = new Date(item.pubDate);

        this.data[recStart + i] = { index: recStart + i };
        this.data[recStart + i].pubDate = item.pubDate;
        this.data[recStart + i].title = item.title;
        this.data[recStart + i].url = item.link;
        this.data[recStart + i].text = item.description;
      }
    }
    this.req = null;

    this.onDataLoaded.notify({ from: recStart, to: recEnd });
  }


  reloadData(from: number, to: number) {
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
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Data = window.Slick.Data || {};
  window.Slick.Data.RemoteModelYahoo = SlickRemoteModelYahoo;
}