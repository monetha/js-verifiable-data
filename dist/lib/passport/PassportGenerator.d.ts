import { TransactionReceipt } from 'web3-core';
import { Address } from '../models/Address';
import { IWeb3 } from '../models/IWeb3';
export declare class PassportGenerator {
    private contract;
    private web3;
    /**
     * Utility to extract passport address from passport creation transaction receipt
     */
    static getPassportAddressFromReceipt(passportCreationReceipt: TransactionReceipt): string;
    constructor(anyWeb3: IWeb3, passportFactoryAddress: Address);
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(ownerAddress: Address): Promise<import("web3-core").TransactionConfig>;
}
