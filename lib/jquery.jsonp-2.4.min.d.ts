// Available options and types derived from https://github.com/jaubourg/jquery-jsonp/blob/master/doc/API.md
interface JsonpOptions {
  beforeSend?(xOptions: ExtendedOptions): void | false;
  callback?: string;
  callbackParameter?: string;
  cache?: boolean;
  complete?(
    xOptions: ExtendedOptions,
    textStatus: "success" | "error" | "timeout"
  ): void;
  context?: any;
  data?: object | string;
  dataFilter?(json: any): any;
  error?(
    xOptions: ExtendedOptions,
    textStatus: "success" | "error" | "timeout"
  ): void;
  pageCache?: boolean;
  timeout?: number;
  traditional?: boolean;
  success?(
    json: any,
    textStatus: "success" | "error" | "timeout",
    xOptions: ExtendedOptions
  ): void;
  url?: string;
  [key: string]: any
}

interface JsonpExtendedOptions extends JsonpOptions {
  abort(): void;
}

interface JsonpStatic {
  (options?: JsonpOptions): JsonpExtendedOptions;
}

interface JQueryStatic {
  jsonp: JsonpStatic;
}
