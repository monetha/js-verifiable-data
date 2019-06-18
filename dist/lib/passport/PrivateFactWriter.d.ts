import Web3 from 'web3';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private contractIO;
    private writer;
    private ownership;
    private ec;
    private readonly passportAddress;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(factProviderAddress: Address, key: string, data: number[], ipfsClient: IIPFSClient): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("../models/IRawTX.js").IRawTX;
    }>;
}
