import { IEthOptions } from '../models/IEthOptions';
import { IWeb3 } from '../models/IWeb3';
import { RandomArrayGenerator } from '../models/RandomArrayGenerator';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactWriter } from './FactWriter';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private writer;
    private ownership;
    private ec;
    constructor(anyWeb3: IWeb3, factWriter: FactWriter, options?: IEthOptions);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(factProviderAddress: Address, key: string, data: number[], ipfsClient: IIPFSClient, rand?: RandomArrayGenerator): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("web3-core").TransactionConfig;
    }>;
}
