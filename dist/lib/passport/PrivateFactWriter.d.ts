import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactWriter } from './FactWriter';
import { IEthOptions } from '../models/IEthOptions';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private writer;
    private ownership;
    private ec;
    constructor(factWriter: FactWriter, options?: IEthOptions);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(factProviderAddress: Address, key: string, data: number[], ipfsClient: IIPFSClient): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("../proto").IRawTX;
    }>;
}
