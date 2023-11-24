import type { Column, FormatterResultWithHtml, FormatterResultWithText } from './index';
import type { SlickGrid } from '../slick.grid';
export declare type Formatter<T = any> = (row: number, cell: number, value: any, columnDef: Column<T>, dataContext: T, grid: SlickGrid) => string | HTMLElement | DocumentFragment | FormatterResultWithHtml | FormatterResultWithText;
//# sourceMappingURL=formatter.interface.d.ts.map