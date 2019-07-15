import Web3 from 'web3';
import { Address } from '../models/Address';
export declare class PassportGenerator {
    private contract;
    private web3;
    constructor(web3: Web3, passportFactoryAddress: Address);
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(ownerAddress: Address): Promise<import("web3-core").TransactionConfig>;
}
