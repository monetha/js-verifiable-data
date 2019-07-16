import Web3 from 'web3';
import { Address } from '../models/Address';
import { TransactionReceipt } from 'web3-core';
export declare class PassportGenerator {
    private contract;
    private web3;
    /**
     * Utility to extract passport address from passport creation transaction receipt
     */
    static getPassportAddressFromReceipt(passportCreationReceipt: TransactionReceipt): string;
    constructor(web3: Web3, passportFactoryAddress: Address);
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(ownerAddress: Address): Promise<import("web3-core").TransactionConfig>;
}
