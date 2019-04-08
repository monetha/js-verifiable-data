export interface IPassportHistoryFilter {
    factProviderAddress?: string;
    /**
     * Fact key
     */
    key?: string;
    /**
     * Block nr to scan from
     */
    startBlock?: string;
    /**
     * Block nr to scan to
     */
    endBlock?: string;
}
