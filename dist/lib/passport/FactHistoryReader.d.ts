import { IEthOptions } from '../models/IEthOptions';
import { IIPFSClient } from '../models/IIPFSClient';
import { IPrivateDataHashes } from './FactReader';
import { IWeb3 } from '../models/IWeb3';
export interface IFactValue<TValue> {
    factProviderAddress: string;
    passportAddress: string;
    key: string;
    value: TValue;
}
/**
 * Class to read historic fact changes from the passport
 */
export declare class FactHistoryReader {
    private web3;
    private options;
    constructor(anyWeb3: IWeb3, options?: IEthOptions);
    /**
     * Read string type fact from transaction
     */
    getString(txHash: string): Promise<IFactValue<string>>;
    /**
     * Read bytes type fact from transaction
     */
    getBytes(txHash: string): Promise<IFactValue<number[]>>;
    /**
     * Read address type fact from transaction
     */
    getAddress(txHash: string): Promise<IFactValue<string>>;
    /**
     * Read uint type fact from transaction
     */
    getUint(txHash: string): Promise<IFactValue<number>>;
    /**
     * Read int type fact from transaction
     */
    getInt(txHash: string): Promise<IFactValue<number>>;
    /**
     * Read boolean type fact from transaction
     */
    getBool(txHash: string): Promise<IFactValue<boolean>>;
    /**
     * Read TX data type fact from transaction
     */
    getTxdata(txHash: string): Promise<IFactValue<number[]>>;
    /**
     * Read IPFS hash type fact from transaction
     * @param ipfs IPFS client
     *
     * @returns data stored in IPFS
     */
    getIPFSData(txHash: string, ipfs: IIPFSClient): Promise<IFactValue<any>>;
    /**
     * Read decrypted private data fact from transaction.
     * Fact value is retrieved by IPFS hash from transaction data and decrypted using passport owner private key.
     *
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateData(txHash: string, passportOwnerPrivateKey: string, ipfs: IIPFSClient): Promise<IFactValue<number[]>>;
    /**
     * Read decrypted private data fact from transaction.
     * Fact value is retrieved by IPFS hash from transaction data and decrypted using secret key.
     *
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    getPrivateDataUsingSecretKey(txHash: string, secretKey: string, ipfs: IIPFSClient): Promise<IFactValue<number[]>>;
    /**
     * Read private data hashes fact from transaction
     */
    getPrivateDataHashes(txHash: string): Promise<IFactValue<IPrivateDataHashes>>;
    private validateMethodSignature;
}
