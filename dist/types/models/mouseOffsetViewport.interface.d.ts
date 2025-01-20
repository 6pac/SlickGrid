import type { DragPosition } from './drag.interface.js';
export interface MouseOffsetViewport {
    e: any;
    dd: DragPosition;
    viewport: {
        left: number;
        top: number;
        right: number;
        bottom: number;
        offset: {
            left: number;
            top: number;
            right: number;
            bottom: number;
        };
    };
    offset: {
        x: number;
        y: number;
    };
    isOutsideViewport?: boolean;
}
//# sourceMappingURL=mouseOffsetViewport.interface.d.ts.map