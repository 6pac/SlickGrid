import type { Column } from './column.interface';
// import type { SlickGrid } from './slickGrid.interface';

export type GroupTotalsFormatter = (totals: any, columnDef: Column, grid: any) => string;
