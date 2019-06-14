import { curve, ec } from 'elliptic';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { IPrivateDataHashes } from './FactReader';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private contractIO;
    private reader;
    private ec;
    private readonly web3;
    private readonly passportAddress;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(key: string, data: number[], ipfsClient: IIPFSClient): Promise<void>;
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
