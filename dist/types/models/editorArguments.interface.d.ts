import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
import type { Column, ElementPosition, GridOption, PositionMethod } from './index.js';
export interface EditorArguments<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> {
    /** Column Definition */
    column: Column;
    /** Column MetaData */
    columnMetaData: any;
    /** When it's a Composite Editor (that is when it's an Editor created by the Composite Editor Modal window) */
    compositeEditorOptions?: any;
    /** Editor HTML DOM element container */
    container: HTMLDivElement;
    /** Slick DataView */
    dataView?: SlickDataView;
    /** Event that was triggered */
    event: Event;
    /** Slick Grid object */
    grid: SlickGrid<TData, C, O>;
    /** Grid Position */
    gridPosition: ElementPosition;
    /** Item DataContext */
    item: any;
    /** Editor Position  */
    position: PositionMethod | ElementPosition;
    /** Cancel changes callback method that will execute after user cancels an edit */
    cancelChanges: () => void;
    /** Commit changes callback method that will execute after user commits the changes */
    commitChanges: () => void;
}
//# sourceMappingURL=editorArguments.interface.d.ts.map