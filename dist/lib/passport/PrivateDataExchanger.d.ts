import { Address } from '../models/Address';
import BN from 'bn.js';
import { TxExecutor } from '../models/TxExecutor';
import Web3 from 'web3';
import { IIPFSClient } from '../models/IIPFSClient';
export declare class PrivateDataExchanger {
    private passportAddress;
    private web3;
    private passportLogic;
    private ec;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Creates private data exchange proposition
     * @param factKey - fact key name to request data for
     * @param factProviderAddress - fact provider address
     * @param exchangeStakeWei - amount in WEI to stake
     * @param requesterAddress - data requester address (the one who will submit the transaction)
     * @param txExecutor - transaction executor function
     */
    propose(factKey: string, factProviderAddress: Address, exchangeStakeWei: BN, requesterAddress: Address, txExecutor: TxExecutor): Promise<IProposeDataExchangeResult>;
    /**
     * Accepts private data exchange proposition (should be called only by the passport owner)
     * @param exchangeIndex - data exchange index
     * @param txExecutor - transaction executor function
     */
    accept(exchangeIndex: BN, passportOwnerPrivateKey: string, ipfsClient: IIPFSClient, txExecutor: TxExecutor): Promise<void>;
    timeout(exchangeIndex: BN, requesterAddress: Address, txExecutor: TxExecutor): Promise<void>;
    dispute(exchangeIndex: BN, requesterOrPassOwnerAddress: Address, txExecutor: TxExecutor): Promise<IDisputeDataExchangeResult>;
    finish(exchangeIndex: BN, requesterOrOtherAddress: Address, txExecutor: TxExecutor): Promise<void>;
    getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus>;
    getPrivateData(exchangeIndex: BN, exchangeKey: number[], ipfsClient: IIPFSClient): Promise<number[]>;
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
    encryptedExchangeKey: number[];
    exchangeKeyHash: number[];
    encryptedDataKey: number[];
    dataKeyHash: number[];
    state: ExchangeState;
    stateExpirationTime: Date;
}
