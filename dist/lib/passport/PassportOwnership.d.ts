import { Address } from '../models/Address';
/**
 * Class to change passport ownership
 */
export declare class PassportOwnership {
    private contract;
    constructor(web3: any, passportAddress: Address);
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    claimOwnership(passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Returns passport owner address
     */
    getOwnerAddress(): Promise<{}>;
}
