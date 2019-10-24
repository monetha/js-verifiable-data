import { IEthOptions } from '../models/IEthOptions';
import { Address } from '../models/Address';
import { IWeb3 } from '../models/IWeb3';
/**
 * Class to manage passport ownership
 */
export declare class PassportOwnership {
    private contract;
    private web3;
    private options;
    constructor(anyWeb3: IWeb3, passportAddress: Address, options?: IEthOptions);
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    claimOwnership(passportOwnerAddress: Address): Promise<import("web3-core").TransactionConfig>;
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
