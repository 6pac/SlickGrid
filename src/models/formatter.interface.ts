import { SlickGrid } from '../slick.grid';
import type { Column } from './column.interface';
import type { FormatterResultObject } from './formatterResultObject.interface';
// import type { SlickGrid } from './slickGrid.interface';

export declare type Formatter<T = any> = (row: number, cell: number, value: any, columnDef: Column<T>, dataContext: T, grid: SlickGrid) => string | FormatterResultObject;
