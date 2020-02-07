import { RandomArrayGenerator } from '../models/RandomArrayGenerator';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactWriter } from './FactWriter';
import { Harmony } from '@harmony-js/core';
/**
 * Class to write private facts
 */
export declare class PrivateFactWriter {
    private writer;
    private ownership;
    private ec;
    constructor(harmony: Harmony, factWriter: FactWriter);
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    setPrivateData(factProviderAddress: Address, key: string, data: number[], ipfsClient: IIPFSClient, rand?: RandomArrayGenerator): Promise<{
        dataIpfsHash: any;
        dataKey: number[];
        dataKeyHash: number[];
        tx: import("../models/Method").IConfiguredContractMethod;
    }>;
}
