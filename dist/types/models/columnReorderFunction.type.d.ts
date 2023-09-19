import type { SlickEvent, SlickGrid } from '../index';
import type { Column } from './index';
export type ColumnReorderFunction<C extends Column = Column> = (grid: SlickGrid<C>, headers: HTMLElement[], headerColumnWidthDiff: number, setColumns: (cols: C[]) => void, setupColumnResize: () => void, columns: Column[], getColumnIndex: (columnId: string) => number, uid: string, trigger: (slickEvent: SlickEvent, data?: any) => void) => void;
//# sourceMappingURL=columnReorderFunction.type.d.ts.map