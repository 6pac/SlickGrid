import type { DragPosition } from './drag.interface.js';

export interface MouseOffsetViewport {
  e: any,
  dd: DragPosition,
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
    }
  },
  // Consider the viewport as the origin, the `offset` is based on the coordinate system:
  // the cursor is on the viewport's left/bottom when it is less than 0, and on the right/top when greater than 0.
  offset: {
    x: number;
    y: number;
  },
  isOutsideViewport?: boolean;
}