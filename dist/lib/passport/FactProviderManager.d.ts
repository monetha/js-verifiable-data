import { Harmony } from '@harmony-js/core';
import { Address } from '../proto';
export interface IFactProviderInfo {
    /**
     * Fact provider's display name
     */
    name: string;
    /**
     * Fact provider's website
     */
    website?: string;
    /**
     * Fact provider's passport
     */
    passport?: Address;
}
/**
 * Class to access and manage fact provider registry.
 * Allows managing info about fact providers.
 */
export declare class FactProviderManager {
    private factProviderRegistryAddress;
    private harmony;
    constructor(harmony: Harmony, factProviderRegistryAddress: Address);
    private getContract;
    /**
     * Sets information about fact provider
     *
     * @param factProviderAddress - fact provider's address
     * @param info - information about fact provider
     * @param registryOwner - address of fact provider registry owner
     */
    setInfo(factProviderAddress: Address, info: IFactProviderInfo, registryOwner: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Deletes information about fact provider
     *
     * @param factProviderAddress - fact provider's address
     * @param registryOwner - address of fact provider registry owner
     */
    deleteInfo(factProviderAddress: Address, registryOwner: Address): Promise<import("../models/Method").IConfiguredContractMethod>;
    /**
     * Gets information about fact provider.
     * Returns null promise if no information was entered or it was deleted
     *
     * @param factProviderAddress - fact provider's address
     */
    getInfo(factProviderAddress: Address): Promise<IFactProviderInfo>;
}
