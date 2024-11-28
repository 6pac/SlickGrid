import type { SlickGrid } from '../slick.grid.js';
export interface DragItem {
    dragSource: HTMLElement | Document | null;
    dragHandle: HTMLElement | null;
    deltaX: number;
    deltaY: number;
    range: DragRange;
    target: HTMLElement;
    startX: number;
    startY: number;
}
export interface DragPosition {
    startX: number;
    startY: number;
    range: DragRange;
}
export interface DragRange {
    start: {
        row?: number;
        cell?: number;
    };
    end: {
        row?: number;
        cell?: number;
    };
}
export interface DragRowMove {
    available: any[];
    canMove: boolean;
    clonedSlickRow: HTMLElement;
    deltaX: number;
    deltaY: number;
    drag: HTMLElement;
    drop: any[];
    grid: SlickGrid;
    guide: HTMLElement;
    insertBefore: number;
    offsetX: number;
    offsetY: number;
    originalX: number;
    originalY: number;
    proxy: HTMLElement;
    selectionProxy: HTMLElement;
    target: HTMLElement;
    selectedRows: number[];
    startX: number;
    startY: number;
    range: DragRange;
}
//# sourceMappingURL=drag.interface.d.ts.map