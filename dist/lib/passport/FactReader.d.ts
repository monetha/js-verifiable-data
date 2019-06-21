import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import Web3 from 'web3';
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
    private contractIO;
    private ethNetworkUrl;
    readonly web3: Web3;
    readonly passportAddress: string;
    constructor(web3: Web3, ethNetworkUrl: string, passportAddress: Address);
    /**
     * Read string type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getString(factProviderAddress: Address, key: string): Promise<string>;
    /**
     * Read bytes type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getBytes(factProviderAddress: Address, key: string): Promise<number[]>;
    /**
     * Read address type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getAddress(factProviderAddress: Address, key: string): Promise<string>;
    /**
     * Read uint type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getUint(factProviderAddress: Address, key: string): Promise<number>;
    /**
     * Read int type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getInt(factProviderAddress: Address, key: string): Promise<number>;
    /**
     * Read boolean type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getBool(factProviderAddress: Address, key: string): Promise<boolean>;
    /**
     * Read TX data type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getTxdata(factProviderAddress: Address, key: string): Promise<number[]>;
    /**
     * Read IPFS hash type fact from passport
     *
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     * @param ipfs IPFS client
     *
     * @returns data stored in IPFS
     */
    getIPFSData(factProviderAddress: Address, key: string, ipfs: IIPFSClient): Promise<any>;
    /**
     * Read private data fact value using IPFS by decrypting it using passport owner private key.
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateData(factProviderAddress: Address, key: string, passportOwnerPrivateKey: string, ipfs: IIPFSClient): Promise<number[]>;
    /**
     * Read private data fact value using IPFS by decrypting it using secret key, generated at the time of writing.
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateDataUsingSecretKey(factProviderAddress: Address, key: string, secretKey: string, ipfs: IIPFSClient): Promise<number[]>;
    /**
     * Read private data hashes fact from the passport.
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     */
    getPrivateDataHashes(factProviderAddress: Address, key: string): Promise<IPrivateDataHashes>;
    private get;
}
