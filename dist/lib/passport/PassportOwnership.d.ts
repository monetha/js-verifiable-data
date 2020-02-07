import { Harmony } from '@harmony-js/core';
import { Address } from '../models/Address';
/**
 * Class to manage passport ownership
 */
export declare class PassportOwnership {
    private contract;
    private harmony;
    constructor(harmony: Harmony, passportAddress: Address);
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    claimOwnership(passportOwnerAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Returns passport owner address
     */
    getOwnerAddress(): Promise<string>;
    /**
     * Returns passport pending owner address
     */
    getPendingOwnerAddress(): Promise<string>;
    /**
     * Returns passport owner public key. Owner must claim ownership of the passport,
     * before this method can be invoked.
     */
    getOwnerPublicKey(): Promise<number[]>;
    private getFirstOwnershipTransferredEvent;
}
