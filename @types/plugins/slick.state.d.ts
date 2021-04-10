/// <reference types="jquery" />
/// <reference types="cypress" />
declare type StorageWrapper = {
    get: (key: string) => JQuery.Deferred<any, any, any>;
    set: (key: string, obj: any) => void;
};
declare type SlickStateOptions = {
    key_prefix: string;
    storage: StorageWrapper;
    cid: string;
    defaultColumns: any[];
};
declare type SlickStateFunction = (options: SlickStateOptions) => void;
