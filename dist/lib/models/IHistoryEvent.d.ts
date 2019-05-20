import { Address } from './Address';
export declare enum EventType {
    Updated = "Updated",
    Deleted = "Deleted"
}
export declare enum DataType {
    Address = "Address",
    Bool = "Bool",
    Bytes = "Bytes",
    Int = "Int",
    Uint = "Uint",
    String = "String",
    TxData = "TxData",
    IPFSHash = "IPFSHash",
    PrivateData = "PrivateData"
}
export interface IHistoryEvent {
    blockHash: string;
    blockNumber: string;
    transactionHash: string;
    transactionIndex: string;
    eventType: EventType;
    dataType: DataType;
    /**
     * Fact provider which made the change
     */
    factProviderAddress: Address;
    /**
     * Key that was changed
     */
    key: string;
}
