import { Address } from '../models/Address';
import { Harmony } from '@harmony-js/core';
/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export declare class Permissions {
    private contract;
    private harmony;
    constructor(harmony: Harmony, passportAddress: Address);
    /**
     * Adds factProvider to whitelist
     */
    addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Removes fact provider from whitelist
     */
    removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Checks if fact provider is whitelisted
     */
    isFactProviderInWhitelist(factProviderAddress: Address): Promise<any>;
    /**
     * Checks if whitelist only permission is set, meaning that only whitelisted fact
     * providers could write to this passport
     */
    isWhitelistOnlyPermissionSet(): Promise<any>;
    /**
     * Checks if fact provider is allowed to write facts to this passport
     */
    isAllowedFactProvider(factProviderAddress: Address): Promise<any>;
    /**
     * Sets permission for passport whether only whitelisted fact providers could write facts to it
     */
    setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
}
