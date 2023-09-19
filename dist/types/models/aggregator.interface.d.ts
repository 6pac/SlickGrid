export interface Aggregator {
    /** Column definition field Id of the associated Aggregator */
    field: number | string;
    /** Type of Aggregator (sum, avg, ...) */
    type: string;
    /** Aggregator initialize method */
    init: () => void;
    /** Method to accumulate the result which will be different for each Aggregator type */
    accumulate?: (item: any) => void;
    /** Method to store the result into the given group total object provided as argument */
    storeResult: (groupTotals: any | undefined) => void;
}
//# sourceMappingURL=aggregator.interface.d.ts.map