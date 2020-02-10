import { Harmony } from '@harmony-js/core';
import { TransasctionReceipt } from '@harmony-js/transaction';
import { Address } from '../models/Address';
export declare class PassportGenerator {
    private harmony;
    private passFactoryAddress;
    /**
     * Utility to extract passport address from passport creation transaction receipt
     */
    static getPassportAddressFromReceipt(passportCreationReceipt: TransasctionReceipt): string;
    constructor(harmony: Harmony, passportFactoryAddress: Address);
    private getContract;
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(ownerAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
}
