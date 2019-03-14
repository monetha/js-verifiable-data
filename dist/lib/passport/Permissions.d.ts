import { Address } from '../models/Address';
/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export declare class Permissions {
    private contract;
    constructor(web3: any, passportAddress: Address);
    /**
     * Adds factProvider to whitelist
     */
    addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Removes fact provider from whitelist
     */
    removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
    /**
     * Checks if fact provider is whitelisted
     */
    isFactProviderInWhitelist(factProviderAddress: Address): Promise<{}>;
    /**
     * Checks if whitelist only permission is set
     */
    isWhitelistOnlyPermissionSet(): Promise<{}>;
    /**
     * Checks if factProvider is allowed
     */
    isAllowedFactProvider(factProviderAddress: Address): Promise<{}>;
    /**
     * Sets permission for passport whether only whitelisted fact providers could write facts to it
     */
    setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
}
