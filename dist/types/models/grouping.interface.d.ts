import type { Aggregator } from './aggregator.interface.js';
import type { GroupingComparerItem } from './groupingComparerItem.interface.js';
import type { GroupingFormatterItem } from './groupingFormatterItem.interface.js';
import type { SortDirectionNumber } from './sortDirectionNumber.enum.js';
export type GroupingGetterFunction<T = any> = (value: T) => any;
export interface Grouping<T = any> {
    /** Grouping Aggregators array */
    aggregators?: Aggregator[];
    /** Defaults to false, are we aggregating child grouping? */
    aggregateChildGroups?: boolean;
    /** Defaults to false, are the Aggregator Collapsed when grid is loaded */
    aggregateCollapsed?: boolean;
    /** Defaults to false, are we aggregating empty grouping? */
    aggregateEmpty?: boolean;
    /** Defaults to false, is the Group Collapsed when grid is loaded */
    collapsed?: boolean;
    /** Sort Comparer callback method */
    comparer?: (a: GroupingComparerItem, b: GroupingComparerItem) => SortDirectionNumber;
    /** Defaults to false, do we want to display the row with Group Totals */
    displayTotalsRow?: boolean;
    /** String Formatter of the Grouping Header */
    formatter?: (g: GroupingFormatterItem) => string;
    /** Getter of the Column to be Grouped */
    getter?: string | GroupingGetterFunction<T>;
    /** Defaults to false, lazy load the Group Totals Calculation */
    lazyTotalsCalculation?: boolean;
    /** Set some predefined Grouping values */
    predefinedValues?: any[];
    /** defaults to true, so far only used internally by SlickDraggableGrouping */
    sortAsc?: boolean;
}
//# sourceMappingURL=grouping.interface.d.ts.map