import { type SlickEventData } from '../slick.core.js';
export type Handler<ArgType = any> = (e: SlickEventData<ArgType>, args: ArgType) => void;
export interface ElementEventListener {
    element: Element | Window;
    eventName: string;
    listener: EventListenerOrEventListenerObject;
    groupName?: string;
}
export interface EditController {
    /** Commit Current Editor command */
    commitCurrentEdit: () => boolean;
    /** Cancel Current Editor command */
    cancelCurrentEdit: () => boolean;
}
//# sourceMappingURL=core.interface.d.ts.map