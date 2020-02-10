import { Address } from '../models/Address';
import { Harmony } from '@harmony-js/core';
/**
 * Class for fact deletion
 */
export declare class FactRemover {
    private passportAddress;
    private harmony;
    constructor(harmony: Harmony, passportAddress: Address);
    private getContract;
    /**
     * Deletes string type fact from passport
     */
    deleteString(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes byte type fact from passport
     */
    deleteBytes(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes address type fact from passport
     */
    deleteAddress(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes uint type fact from passport
     */
    deleteUint(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes int type fact from passport
     */
    deleteInt(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes bool type fact from passport
     */
    deleteBool(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes txdata type fact from passport
     */
    deleteTxdata(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes IPFS hash type fact from passport
     */
    deleteIPFSHash(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes privateDataHashes type fact from passport
     */
    deletePrivateDataHashes(key: string, factProviderAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    private delete;
}
