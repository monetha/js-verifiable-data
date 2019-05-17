import { Address } from '../models/Address';
import Web3 from 'web3';
export declare class PassportGenerator {
    private contract;
    constructor(web3: Web3, passportFactoryAddress: Address);
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
}
