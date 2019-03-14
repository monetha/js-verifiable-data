import { Address } from '../models/Address';
/**
 * Class for fact deletion
 */
export declare class FactRemover {
    private contractIO;
    private readonly web3;
    constructor(web3: any, passportAddress: Address);
    /**
     * Deletes string type fact from passport
     * @param key fact key
     * @param factProviderAddress
     */
    deleteString(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes byte type fact from passport
     * @param key fact key
     */
    deleteBytes(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes address type fact from passport
     * @param key fact key
     */
    deleteAddress(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes uint type fact from passport
     * @param key fact key
     */
    deleteUint(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes int type fact from passport
     * @param key fact key
     */
    deleteInt(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes bool type fact from passport
     * @param key fact key
     */
    deleteBool(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes txdata type fact from passport
     * @param key fact key
     */
    deleteTxdata(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Deletes IPFS hash type fact from passport
     * @param key fact key
     */
    deleteIPFSHash(key: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    private delete;
}
