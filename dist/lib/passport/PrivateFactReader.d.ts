import Web3 from 'web3';
import { Address } from '../models/Address';
import { IPrivateDataHashes } from './FactReader';
import { IIPFSClient } from '../models/IIPFSClient';
import { ec } from 'elliptic';
/**
 * Class to read private facts
 */
export declare class PrivateFactReader {
    private contractIO;
    private reader;
    private ec;
    private readonly web3;
    private readonly passportAddress;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
     * @param passportOwnerPrivateKey
     * @param factProviderAddress
     * @param key
     * @param ipfsClient
     */
    getPrivateData(passportOwnerPrivateKey: string, factProviderAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<any>;
    /**
     * Gets ephemeral public key from IPFS and derives secret key using passport owner private key.
     * @param passportOwnerPrivateKeyPair
     * @param factProviderHashes
     * @param factProviderAddress
     * @param key
     * @param ipfsClient
     */
    decryptSecretKey(passportOwnerPrivateKeyPair: ec.KeyPair, factProviderHashes: IPrivateDataHashes, factProviderAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<any>;
}
