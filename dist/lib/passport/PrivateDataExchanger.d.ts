import BN from 'bn.js';
import { IEthOptions } from '../models/IEthOptions';
import { IIPFSClient } from '../models/IIPFSClient';
import { RandomArrayGenerator } from '../models/RandomArrayGenerator';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { TxExecutor } from '../models/TxExecutor';
import { TransactionReceipt } from 'web3-core';
export declare class PrivateDataExchanger {
    private passportAddress;
    private web3;
    private contract;
    private ec;
    private getCurrentTime;
    private options;
    constructor(web3: Web3, passportAddress: Address, currentTimeGetter?: CurrentTimeGetter, options?: IEthOptions);
    /**
     * Creates private data exchange proposition
     * @param factKey - fact key name to request data for
     * @param factProviderAddress - fact provider address
     * @param exchangeStakeWei - amount in WEI to stake
     * @param requesterAddress - data requester address (the one who will submit the transaction)
     * @param txExecutor - transaction executor function
     */
    propose(factKey: string, factProviderAddress: Address, exchangeStakeWei: BN, requesterAddress: Address, txExecutor: TxExecutor, rand?: RandomArrayGenerator): Promise<IProposeDataExchangeResult>;
    /**
     * Accepts private data exchange proposition (should be called only by the passport owner)
     * @param exchangeIndex - data exchange index
     * @param txExecutor - transaction executor function
     */
    accept(exchangeIndex: BN, passportOwnerPrivateKey: string, ipfsClient: IIPFSClient, txExecutor: TxExecutor): Promise<void>;
    /**
     * Closes private data exchange after proposition has expired.
     * This can be called only by data exchange requester.
     * @param exchangeIndex - data exchange index
     * @param txExecutor - transaction executor function
     */
    timeout(exchangeIndex: BN, txExecutor: TxExecutor): Promise<void>;
    /**
     * Closes private data exchange after acceptance by dispute.
     * Can be called only by data exhange requester.
     * @param exchangeIndex - data exchange index
     * @param exchangeKey - exchange key, generated by requester when requesting proposal
     * @param txExecutor - transaction executor function
     */
    dispute(exchangeIndex: BN, exchangeKey: number[], txExecutor: TxExecutor): Promise<IDisputeDataExchangeResult>;
    /**
     * Closes private data exchange after acceptance. It's supposed to be called by the data requester,
     * but passport owner can also call it after data exchange is expired.
     * @param exchangeIndex - data exchange index
     * @param requesterOrPassOwnerAddress - address of requester or passport owner (the one who will execute the transaction)
     * @param txExecutor - transaction executor function
     */
    finish(exchangeIndex: BN, requesterOrPassOwnerAddress: Address, txExecutor: TxExecutor): Promise<void>;
    /**
     * Returns the status of private data exchange
     * @param exchangeIndex - data exchange index
     */
    getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus>;
    /**
     * Gets decrypted private data from IPFS by using exchange key.
     * Encrypted secret data encryption key is retrieved from private data exchange and then is decrypted using provided exchangeKey.
     * Then this decrypted secret key is used to decrypt private data, stored in IPFS.
     * @param exchangeIndex - data exchange index
     * @param exchangeKey - exchange key, which is generated and known by data requester
     * @param ipfsClient - IPFS client for private data retrieval
     */
    getPrivateData(exchangeIndex: BN, exchangeKey: number[], ipfsClient: IIPFSClient): Promise<number[]>;
}
export declare type CurrentTimeGetter = () => Date;
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
/**
 * Extracts data exchange index from proposal receipt.
 * Returns null in case exchangeIdx was not found in receipt logs
 */
export declare function getExchangeIndexFromReceipt(receipt: TransactionReceipt): string;
