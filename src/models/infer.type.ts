export type InferType<T> = T extends infer R ? R : any;

/* eslint-disable @typescript-eslint/indent */
export type InferDOMType<T> =
  T extends CSSStyleDeclaration ? Partial<CSSStyleDeclaration> :
  T extends infer R ? R : any;
/* eslint-enable @typescript-eslint/indent */