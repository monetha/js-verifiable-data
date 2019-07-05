import Web3 from 'web3';
import { Address } from '../models/Address';
/**
 * Class to change passport ownership
 */
export declare class PassportOwnership {
    private contract;
    constructor(web3: Web3, passportAddress: Address);
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    claimOwnership(passportOwnerAddress: Address): Promise<import("../proto.js").IRawTX>;
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
