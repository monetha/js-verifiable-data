import { Address } from '../models/Address';
import Web3 from 'web3';
/**
 * Class to change passport ownership
 */
export declare class PassportOwnership {
    private contract;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    claimOwnership(passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Returns passport owner address
     */
    getOwnerAddress(): Promise<string>;
    /**
     * Returns passport owner public key. Owner must claim ownership of the passport,
     * before this method can be invoked.
     */
    getOwnerPublicKey(): Promise<number[]>;
    private getFirstOwnershipTransferredEvent;
}
