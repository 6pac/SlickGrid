import type { SlickGrid } from '../slick.grid.js';

export type UsabilityOverrideFn = (row: number, dataContext: any, grid: SlickGrid) => boolean;