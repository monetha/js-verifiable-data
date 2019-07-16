import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactWriter } from './FactWriter';
import { IEthOptions } from '../models/IEthOptions';
import Web3 from 'web3';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private writer;
    private ownership;
    private ec;
    constructor(web3: Web3, factWriter: FactWriter, options?: IEthOptions);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(factProviderAddress: Address, key: string, data: number[], ipfsClient: IIPFSClient): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("web3-core").TransactionConfig;
    }>;
}
