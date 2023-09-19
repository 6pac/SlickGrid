import type { Column, FormatterResultObject } from './index';
import type { SlickGrid } from '../slick.grid';

export declare type Formatter<T = any> = (row: number, cell: number, value: any, columnDef: Column<T>, dataContext: T, grid: SlickGrid) => string | FormatterResultObject;
