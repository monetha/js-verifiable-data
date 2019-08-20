import { Address } from './Address';
import { EventData } from 'web3-eth-contract';
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
    PrivateData = "PrivateDataHashes"
}
export interface IHistoryEvent extends EventData {
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
