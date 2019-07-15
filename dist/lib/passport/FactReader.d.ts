import { IEthOptions } from '../models/IEthOptions';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
export interface IPrivateDataHashes {
    /**
     * IPFS hash where encrypted data with its metadata is stored
     */
    dataIpfsHash: string;
    /**
     * Hash of secret data encryption key in hex (with 0x prefix)
     */
    dataKeyHash: string;
}
/**
 * Class to read latest facts from the passport
 */
export declare class FactReader {
    private contract;
    private ethNetworkUrl;
    private options;
    private web3;
    readonly passportAddress: string;
    constructor(web3: Web3, ethNetworkUrl: string, passportAddress: Address, options?: IEthOptions);
    /**
     * Read string type fact from passport
     */
    getString(factProviderAddress: Address, key: string): Promise<string>;
    /**
     * Read bytes type fact from passport
     */
    getBytes(factProviderAddress: Address, key: string): Promise<number[]>;
    /**
     * Read address type fact from passport
     */
    getAddress(factProviderAddress: Address, key: string): Promise<string>;
    /**
     * Read uint type fact from passport
     */
    getUint(factProviderAddress: Address, key: string): Promise<number>;
    /**
     * Read int type fact from passport
     */
    getInt(factProviderAddress: Address, key: string): Promise<number>;
    /**
     * Read boolean type fact from passport
     */
    getBool(factProviderAddress: Address, key: string): Promise<boolean>;
    /**
     * Read TX data type fact from passport
     */
    getTxdata(factProviderAddress: Address, key: string): Promise<number[]>;
    /**
     * Read IPFS hash type fact from passport
     *
     * @param ipfs IPFS client
     *
     * @returns data stored in IPFS
     */
    getIPFSData(factProviderAddress: Address, key: string, ipfs: IIPFSClient): Promise<any>;
    /**
     * Read private data fact value using IPFS by decrypting it using passport owner private key.
     *
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateData(factProviderAddress: Address, key: string, passportOwnerPrivateKey: string, ipfs: IIPFSClient): Promise<number[]>;
    /**
     * Read private data fact value using IPFS by decrypting it using secret key, generated at the time of writing.
     *
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateDataUsingSecretKey(factProviderAddress: Address, key: string, secretKey: string, ipfs: IIPFSClient): Promise<number[]>;
    /**
     * Read private data hashes fact from the passport.
     */
    getPrivateDataHashes(factProviderAddress: Address, key: string): Promise<IPrivateDataHashes>;
    private get;
}
