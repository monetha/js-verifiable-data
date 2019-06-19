import { Address } from '../models/Address';
import BN from 'bn.js';
import { TxExecutor } from '../models/TxExecutor';
export declare class PrivateDataExchanger {
    private passportAddress;
    private txExecutor;
    constructor(passportAddress: Address, txExecutor?: TxExecutor);
    propose(factKey: string, factProviderAddress: Address, exchangeStakeWei: BN): Promise<IPropseDataExchangeResult>;
    accept(exchangeIndex: BN): Promise<void>;
    timeout(exchangeIndex: BN): Promise<void>;
    dispute(exchangeIndex: BN): Promise<IDisputeDataExchangeResult>;
    finish(exchangeIndex: BN): Promise<void>;
    getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus>;
    getPrivateData(exchangeIndex: BN, exchangeKey: number[]): Promise<void>;
}
export interface IPropseDataExchangeResult {
    exchangeIndex: BN;
    exchangeKey: number[];
    exchangeKeyHash: number[];
}
export interface IDisputeDataExchangeResult {
    success: boolean;
    cheaterAddress: Address;
}
export declare enum ExchangeState {
    Closed = 0,
    Proposed = 1,
    Accepted = 2
}
export interface IDataExchangeStatus {
    requesterAddress: Address;
    requesterStaked: BN;
    passportOwnerAddress: Address;
    passportOwnerStaked: BN;
    factProviderAddress: Address;
    factKey: string;
    dataIpfsHash: string;
    dataKeyHash: number[];
    encryptedExchangeKey: number[];
    exchangeKeyHash: number[];
    encryptedSecretkey: number[];
    state: ExchangeState;
    stateExpirationTime: Date;
}
