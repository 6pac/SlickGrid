export interface CancellablePromiseWrapper<T = any> {
  promise: Promise<T>;
  cancel: () => boolean;
}