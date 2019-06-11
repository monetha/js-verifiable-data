import Web3 from 'web3';
import { Address } from '../models/Address';
/**
 * Class to read private facts
 */
export declare class PrivateFactReader {
    private contractIO;
    private readonly web3;
    private readonly passportAddress;
    constructor(web3: Web3, passportAddress: Address);
    getPrivateData(passportOwnerPrivateKey: any, factProviderAddress: Address, key: string): Promise<void>;
    private getPrivateDataHashes;
}
