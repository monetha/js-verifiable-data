import { curve, ec } from 'elliptic';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactReader, IPrivateDataHashes } from './FactReader';
/**
 * Class to read private facts
 */
export declare class PrivateFactReader {
    private reader;
    private ec;
    constructor(factReader: FactReader);
    /**
     * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     * @param ipfs IPFS client
     */
    getPrivateData(passportOwnerPrivateKey: string, factProviderAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<number[]>;
    /**
     * Decrypts decrypts private data using secret key
     * @param secretKey secret key in hex, used for data decryption
     * @param factProviderAddress fact provider to read fact for
     * @param key fact key
     * @param ipfs IPFS client
     */
    getPrivateDataUsingSecretKey(secretKey: string, factProviderAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<number[]>;
    /**
     * reads encrypted data and HMAC and decrypts data using provided secret keyring material and elliptic curve.
     * Default elliptic curve is used if it's nil.
     * @param dataIpfsHash
     * @param secretKey
     */
    decryptPrivateData(dataIpfsHash: string, secretKey: number[], ellipticCurve: curve.base, ipfsClient: IIPFSClient): Promise<number[]>;
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
