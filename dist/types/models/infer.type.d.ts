export type InferType<T> = T extends infer R ? R : any;
export type InferDOMType<T> = T extends CSSStyleDeclaration ? Partial<CSSStyleDeclaration> : T extends infer R ? R : any;
export type MergeTypes<A, B> = {
    [key in keyof A]: key extends keyof B ? B[key] : A[key];
} & B;
//# sourceMappingURL=infer.type.d.ts.map