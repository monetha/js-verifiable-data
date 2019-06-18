import { IIPFSClient } from '../models/IIPFSClient';
import { IPrivateDataHashes } from './FactReader';
export interface IFactValue<TValue> {
    factProviderAddress: string;
    key: string;
    value: TValue;
}
/**
 * Class to read historic facts from the passport
 */
export declare class FactHistoryReader {
    private web3;
    constructor(web3: any);
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
     * Read private data hashes fact from transaction
     */
    getPrivateDataHashes(txHash: string): Promise<IFactValue<IPrivateDataHashes>>;
    private validateMethodSignature;
    private bytesToUnpaddedAscii;
}
