import Web3 from 'web3';
import { Address } from '../models/Address';
/**
 * Class for fact deletion
 */
export declare class FactRemover {
    private contract;
    private web3;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Deletes string type fact from passport
     */
    deleteString(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes byte type fact from passport
     */
    deleteBytes(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes address type fact from passport
     */
    deleteAddress(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes uint type fact from passport
     */
    deleteUint(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes int type fact from passport
     */
    deleteInt(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes bool type fact from passport
     */
    deleteBool(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes txdata type fact from passport
     */
    deleteTxdata(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes IPFS hash type fact from passport
     */
    deleteIPFSHash(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Deletes privateDataHashes type fact from passport
     */
    deletePrivateDataHashes(key: string, factProviderAddress: Address): Promise<import("web3-core").TransactionConfig>;
    private delete;
}
