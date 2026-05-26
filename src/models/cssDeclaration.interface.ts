
export type CSSStyleDeclarationReadonly =
  | 'length'
  | 'parentRule'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty';
export type CSSStyleDeclarationWritable = Omit<CSSStyleDeclaration, CSSStyleDeclarationReadonly>;