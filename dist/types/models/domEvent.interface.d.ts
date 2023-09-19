export interface DOMEvent<T extends EventTarget> extends Event {
    currentTarget: T;
    target: T;
    relatedTarget: T;
}
export interface DOMMouseOrTouchEvent<T extends EventTarget> extends MouseEvent, TouchEvent {
    currentTarget: T;
    target: T;
    relatedTarget: T;
}
//# sourceMappingURL=domEvent.interface.d.ts.map