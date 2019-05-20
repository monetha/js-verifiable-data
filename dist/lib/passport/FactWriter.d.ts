import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import Web3 from 'web3';
/**
 * Class to write facts to passport
 */
export declare class FactWriter {
    private contractIO;
    private readonly web3;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Writes string type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setString(key: string, value: string, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes bytes type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setBytes(key: string, value: number[], factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes address type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setAddress(key: string, value: Address, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes uint type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setUint(key: string, value: number, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes int type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setInt(key: string, value: number, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes boolean type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setBool(key: string, value: boolean, factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes TX data type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setTxdata(key: string, value: number[], factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Writes IPFS hash data type fact to passport
     *
     * @param key fact key
     * @param value value to store on IPFS
     * @param ipfs IPFS client
     */
    setIPFSData(key: string, value: any, factProviderAddress: Address, ipfs: IIPFSClient): Promise<import("../models/IRawTX").IRawTX>;
    private set;
}
