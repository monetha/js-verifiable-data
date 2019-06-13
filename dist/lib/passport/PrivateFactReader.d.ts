import { curve, ec } from 'elliptic';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { IPrivateDataHashes } from './FactReader';
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
     * reads encrypted data and HMAC and decrypts data using provided secret keyring material and elliptic curve.
     * Default elliptic curve is used if it's nil.
     * @param dataIpfsHash
     * @param secretKey
     */
    decryptPrivateData(dataIpfsHash: string, secretKey: number[], ellipticCurve: curve.base, ipfsClient: IIPFSClient): Promise<any>;
    /**
     * Gets ephemeral public key from IPFS and derives secret key using passport owner private key.
     * @param passportOwnerPrivateKeyPair
     * @param factProviderHashes
     * @param factProviderAddress
     * @param key
     * @param ipfsClient
     */
    decryptSecretKey(passportOwnerPrivateKeyPair: ec.KeyPair, factProviderHashes: IPrivateDataHashes, factProviderAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<number[]>;
}
