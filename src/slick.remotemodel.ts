import type { ColumnSort } from './models/index';

/***
 * A sample AJAX data store implementation.
 * Right now, it's hooked up to load search results from Octopart, but can
 * easily be extended to support any JSONP-compatible backend that accepts paging parameters.
 */
export class SlickRemoteModel {
  // private
  protected PAGESIZE = 50;
  protected data: any = { length: 0 };
  protected searchstr = '';
  protected sortcol: ColumnSort | null = null;
  protected sortdir = 1;
  protected h_request: any = null;
  protected req: any = null; // ajax request

  // events
  onDataLoading = new Slick.Event();
  onDataLoaded = new Slick.Event();

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
      for (let i = this.req.fromPage; i <= this.req.toPage; i++)
        this.data[i * this.PAGESIZE] = undefined;
    }

    if (from < 0) {
      from = 0;
    }

    if (this.data.length > 0) {
      to = Math.min(to, this.data.length - 1);
    }

    let fromPage = Math.floor(from / this.PAGESIZE);
    let toPage = Math.floor(to / this.PAGESIZE);

    while (this.data[fromPage * this.PAGESIZE] !== undefined && fromPage < toPage) {
      fromPage++;
    }

    while (this.data[toPage * this.PAGESIZE] !== undefined && fromPage < toPage) {
      toPage--;
    }

    if (fromPage > toPage || ((fromPage == toPage) && this.data[fromPage * this.PAGESIZE] !== undefined)) {
      // TODO:  look-ahead
      this.onDataLoaded.notify({ from: from, to: to });
      return;
    }

    let url = "http://octopart.com/api/v3/parts/search?apikey=68b25f31&include[]=short_description&show[]=uid&show[]=manufacturer&show[]=mpn&show[]=brand&show[]=octopart_url&show[]=short_description&q=" + this.searchstr + "&start=" + (fromPage * this.PAGESIZE) + "&limit=" + (((toPage - fromPage) * this.PAGESIZE) + this.PAGESIZE);

    if (this.sortcol != null) {
      url += ("&sortby=" + this.sortcol + ((this.sortdir > 0) ? "+asc" : "+desc"));
    }

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
        success: this.onSuccess,
        error: () => this.onError(fromPage, toPage)
      });
      this.req.fromPage = fromPage;
      this.req.toPage = toPage;
    }, 50);
  }

  protected onError(fromPage: number | string, toPage: number | string) {
    alert("error loading pages " + fromPage + " to " + toPage);
  }

  protected onSuccess(resp: any) {
    const from = resp.request.start, to = from + resp.results.length;
    this.data.length = Math.min(parseInt(resp.hits), 1000); // limitation of the API

    for (let i = 0; i < resp.results.length; i++) {
      const item = resp.results[i].item;
      this.data[from + i] = item;
      this.data[from + i].index = from + i;
    }

    this.req = null;
    this.onDataLoaded.notify({ from: from, to: to });
  }

  reloadData(from: number, to: number) {
    for (let i = from; i <= to; i++)
      delete this.data[i];

    this.ensureData(from, to);
  }


  setSort(column: ColumnSort, dir: number) {
    this.sortcol = column;
    this.sortdir = dir;
    this.clear();
  }

  setSearch(str: string) {
    this.searchstr = str;
    this.clear();
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Data = window.Slick.Data || {};
  window.Slick.Data.RemoteModel = SlickRemoteModel;
}