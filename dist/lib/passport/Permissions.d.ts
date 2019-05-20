import { Address } from '../models/Address';
import Web3 from 'web3';
/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export declare class Permissions {
    private contract;
    constructor(web3: Web3, passportAddress: Address);
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
    isFactProviderInWhitelist(factProviderAddress: Address): Promise<any>;
    /**
     * Checks if whitelist only permission is set
     */
    isWhitelistOnlyPermissionSet(): Promise<any>;
    /**
     * Checks if factProvider is allowed
     */
    isAllowedFactProvider(factProviderAddress: Address): Promise<any>;
    /**
     * Sets permission for passport whether only whitelisted fact providers could write facts to it
     */
    setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address): Promise<import("../models/IRawTX").IRawTX>;
}
