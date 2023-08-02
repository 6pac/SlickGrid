export type InferType<T> = T extends infer R ? R : any;

/* eslint-disable @typescript-eslint/indent */
export type InferDOMType<T> =
  T extends CSSStyleDeclaration ? Partial<CSSStyleDeclaration> :
  T extends infer R ? R : any;
/* eslint-enable @typescript-eslint/indent */

export type MergeTypes<A, B> = {
  [key in keyof A]: key extends keyof B ? B[key] : A[key];
} & B;