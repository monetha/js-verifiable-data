import { Address } from '../models/Address';
import BN from 'bn.js';
import { TxExecutor } from '../models/TxExecutor';
import Web3 from 'web3';
export declare class PrivateDataExchanger {
    private passportAddress;
    private web3;
    private passportLogic;
    private ec;
    constructor(web3: Web3, passportAddress: Address);
    propose(factKey: string, factProviderAddress: Address, exchangeStakeWei: BN, requesterAddress: Address, txExecutor: TxExecutor): Promise<IProposeDataExchangeResult>;
    accept(exchangeIndex: BN, passOwnerAddress: Address, txExecutor: TxExecutor): Promise<void>;
    timeout(exchangeIndex: BN, requesterAddress: Address, txExecutor: TxExecutor): Promise<void>;
    dispute(exchangeIndex: BN, requesterOrPassOwnerAddress: Address, txExecutor: TxExecutor): Promise<IDisputeDataExchangeResult>;
    finish(exchangeIndex: BN, requesterOrOtherAddress: Address, txExecutor: TxExecutor): Promise<void>;
    getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus>;
    getPrivateData(exchangeIndex: BN, exchangeKey: number[]): Promise<void>;
}
export interface IProposeDataExchangeResult {
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
