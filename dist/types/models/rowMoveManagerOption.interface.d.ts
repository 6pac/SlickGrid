import type { SlickCellRangeSelector } from '../plugins/slick.cellrangeselector.js';
import type { UsabilityOverrideFn } from './usabilityOverrideFn.type.js';
import type { SlickGrid } from '../slick.grid.js';
export interface RowMoveManagerOption {
    /**
     * Defaults to True, do we want to disable auto-scroll feature (which comes from CellRangeSelector).
     * NOTE: this flag has no effect when a `cellRangeSelector` is provided, you could however turn `autoScroll: false` inside the `cellRangeSelector`
     */
    autoScrollWhenDrag?: boolean;
    /** Defaults to false, option to cancel editing while dragging a row */
    cancelEditOnDrag?: boolean;
    /**
     * Optional Cell Range Selector.
     * NOTE: for an even simpler approach, we could use `enableCellRangeSelector` which the lib will take care of creating the instance by itself.
     */
    cellRangeSelector?: SlickCellRangeSelector;
    /** A CSS class to be added to the div of the cell formatter. */
    cssClass?: string;
    /** A CSS class to be added to the cell container. */
    containerCssClass?: string;
    /**  Column definition id(defaults to "_move") */
    columnId?: string;
    /**
   * Defaults to 0, the column index position in the grid by default it will show as the first column (index 0).
   * Also note that the index position might vary if you use other extensions, after each extension is created,
   * it will add an offset to take into consideration (1.CheckboxSelector, 2.RowDetail, 3.RowMove)
   */
    columnIndexPosition?: number;
    /** Defaults to False, do we want to disable the row selection? */
    disableRowSelection?: boolean;
    /** Defaults to False, should we select when dragging? */
    dragToSelect?: boolean;
    /** Defaults to True, do we want to hide the row move shadow of what we're dragging? */
    hideRowMoveShadow?: boolean;
    /** Defaults to false, makes the column reorderable to another position in the grid. */
    reorderable?: boolean;
    /** Defaults to 0, optional left margin of the row move shadown element when enabled */
    rowMoveShadowMarginLeft?: number | string;
    /** Defaults to 0, optional top margin of the row move shadown element when enabled */
    rowMoveShadowMarginTop?: number | string;
    /** Defaults to 0.9, opacity of row move shadow element (requires shadow to be shown via option: `hideRowMoveShadow: false`) */
    rowMoveShadowOpacity?: number | string;
    /** Defaults to 0.75, scale size of row move shadow element (requires shadow to be shown via option: `hideRowMoveShadow: false`) */
    rowMoveShadowScale?: number | string;
    /**  Defaults to False, do we want a single row move? Setting this to false means that 1 or more rows can be selected to move together.  */
    singleRowMove?: boolean;
    /**  Width of the column in pixels (must be a number) */
    width?: number;
    /** Override the logic for showing (or not) the move icon (use case example: only every 2nd row is moveable) */
    usabilityOverride?: UsabilityOverrideFn;
}
export interface CrossGridRowMoveManagerOption extends RowMoveManagerOption {
    toGrid: SlickGrid;
}
//# sourceMappingURL=rowMoveManagerOption.interface.d.ts.map