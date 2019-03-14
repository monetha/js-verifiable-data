import { Address } from '../models/Address';
export declare class PassportGenerator {
    private contract;
    constructor(web3: any, passportFactoryAddress: Address);
    /**
     * Creates an empty passport and returns its address
     */
    createPassport(factProviderAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
}
