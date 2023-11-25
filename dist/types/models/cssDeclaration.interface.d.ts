export type CSSStyleDeclarationReadonly = 'length' | 'parentRule' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty';
export type CSSStyleDeclarationWritable = keyof Omit<CSSStyleDeclaration, CSSStyleDeclarationReadonly>;
//# sourceMappingURL=cssDeclaration.interface.d.ts.map