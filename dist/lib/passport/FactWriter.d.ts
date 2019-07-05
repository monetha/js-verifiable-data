import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import Web3 from 'web3';
import { IPrivateDataHashes } from './FactReader';
/**
 * Class to write facts to passport
 */
export declare class FactWriter {
    private contractIO;
    readonly web3: Web3;
    readonly passportAddress: string;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Writes string type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setString(key: string, value: string, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes bytes type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setBytes(key: string, value: number[], factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes address type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setAddress(key: string, value: Address, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes uint type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setUint(key: string, value: number, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes int type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setInt(key: string, value: number, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes boolean type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setBool(key: string, value: boolean, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes TX data type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    setTxdata(key: string, value: number[], factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    /**
     * Writes IPFS hash data type fact to passport
     *
     * @param key fact key
     * @param value value to store on IPFS
     * @param ipfs IPFS client
     */
    setIPFSData(key: string, value: any, factProviderAddress: Address, ipfs: IIPFSClient): Promise<import("../proto").IRawTX>;
    /**
     * Writes private data value to IPFS by encrypting it and then storing IPFS hashes of encrypted data to passport fact.
     * Data can be decrypted using passport owner's wallet private key or a secret key which is returned as a result of this call.
     * @param key fact key
     * @param value value to store privately
     * @param ipfs IPFS client
     */
    setPrivateData(key: string, value: number[], factProviderAddress: Address, ipfs: IIPFSClient): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("../proto").IRawTX;
    }>;
    /**
     * Writes IPFS hash of encrypted private data and hash of data encryption key
     * @param key fact key
     * @param value value to store
     */
    setPrivateDataHashes(key: string, value: IPrivateDataHashes, factProviderAddress: Address): Promise<import("../proto").IRawTX>;
    private set;
}
