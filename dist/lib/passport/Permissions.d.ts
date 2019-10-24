import { Address } from '../models/Address';
import { IWeb3 } from '../models/IWeb3';
/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export declare class Permissions {
    private contract;
    private web3;
    constructor(anyWeb3: IWeb3, passportAddress: Address);
    /**
     * Adds factProvider to whitelist
     */
    addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Removes fact provider from whitelist
     */
    removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("web3-core").TransactionConfig>;
    /**
     * Checks if fact provider is whitelisted
     */
    isFactProviderInWhitelist(factProviderAddress: Address): Promise<boolean>;
    /**
     * Checks if whitelist only permission is set, meaning that only whitelisted fact
     * providers could write to this passport
     */
    isWhitelistOnlyPermissionSet(): Promise<boolean>;
    /**
     * Checks if fact provider is allowed to write facts to this passport
     */
    isAllowedFactProvider(factProviderAddress: Address): Promise<boolean>;
    /**
     * Sets permission for passport whether only whitelisted fact providers could write facts to it
     */
    setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address): Promise<import("web3-core").TransactionConfig>;
}
