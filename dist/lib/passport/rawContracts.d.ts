import { Harmony } from '@harmony-js/core';
import { Address } from '../models/Address';
/**
 * Creates PassportFactory contract instance
 */
export declare function initPassportFactoryContract(harmony: Harmony, factoryAddress: Address): import("@harmony-js/contract").Contract;
/**
 * Creates PassportLogic contract instance
 */
export declare function initPassportLogicContract(harmony: Harmony, passportAddress: Address): import("@harmony-js/contract").Contract;
/**
 * Creates Passport contract instance
 */
export declare function initPassportContract(harmony: Harmony, passportAddress: Address): import("@harmony-js/contract").Contract;
/**
 * Creates PassportLogicRegistry contract instance
 */
export declare function initPassportLogicRegistryContract(harmony: Harmony, registryAddress: Address): import("@harmony-js/contract").Contract;
/**
 * Creates FactProviderRegistry contract instance
 */
export declare function initFactProviderRegistryContract(harmony: Harmony, registryAddress: Address): import("@harmony-js/contract").Contract;
