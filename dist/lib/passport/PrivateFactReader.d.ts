import { curve, ec } from 'elliptic';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { IPrivateDataHashes } from './FactReader';
import { IFactValue } from './FactHistoryReader';
/**
 * Class to read private facts
 */
export declare class PrivateFactReader {
    private ec;
    /**
     * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
     * @param factData fact data written in passport
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfsClient IPFS client
     */
    getPrivateData(factData: IFactValue<IPrivateDataHashes>, passportOwnerPrivateKey: string, ipfsClient: IIPFSClient): Promise<number[]>;
    /**
     * Decrypts decrypts private data using secret key
     * @param dataIpfsHash IPFS hash where encrypted data is stored
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfsClient IPFS client
     */
    getPrivateDataUsingSecretKey(dataIpfsHash: string, secretKey: string, ipfsClient: IIPFSClient): Promise<number[]>;
    /**
     * reads encrypted data and HMAC and decrypts data using provided secret keyring material and elliptic curve.
     * Default elliptic curve is used if it's nil.
     * @param dataIpfsHash IPFS hash where encrypted data is stored
     * @param secretKey secret key in hex, used for data decryption
     * @param ellipticCurve - curve to use in encryption
     * @param ipfsClient IPFS client
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
    decryptSecretKey(passportOwnerPrivateKeyPair: ec.KeyPair, factProviderHashes: IPrivateDataHashes, factProviderAddress: Address, passportAddress: Address, key: string, ipfsClient: IIPFSClient): Promise<number[]>;
}
