import { Column, ElementPosition, PositionMethod } from './index';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';
export interface EditorArguments {
    /** Column Definition */
    column: Column;
    /** Column MetaData */
    columnMetaData: any;
    /** When it's a Composite Editor (that is when it's an Editor created by the Composite Editor Modal window) */
    compositeEditorOptions?: any;
    /** Editor HTML DOM element container */
    container: HTMLDivElement;
    /** Slick DataView */
    dataView: SlickDataView;
    /** Event that was triggered */
    event: Event;
    /** Slick Grid object */
    grid: SlickGrid;
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