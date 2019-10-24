import { Address } from '../models/Address';
import { PassportFactory } from '../types/web3-contracts/PassportFactory';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { Passport } from '../types/web3-contracts/Passport';
import { PassportLogicRegistry } from '../types/web3-contracts/PassportLogicRegistry';
import { FactProviderRegistry } from '../types/web3-contracts/FactProviderRegistry';
import { IWeb3 } from '../models/IWeb3';
/**
 * Creates PassportFactory contract instance
 */
export declare function initPassportFactoryContract(anyWeb3: IWeb3, factoryAddress: Address): PassportFactory;
/**
 * Creates PassportLogic contract instance
 */
export declare function initPassportLogicContract(anyWeb3: IWeb3, passportAddress: Address): PassportLogic;
/**
 * Creates Passport contract instance
 */
export declare function initPassportContract(anyWeb3: IWeb3, passportAddress: Address): Passport;
/**
 * Creates PassportLogicRegistry contract instance
 */
export declare function initPassportLogicRegistryContract(anyWeb3: IWeb3, registryAddress: Address): PassportLogicRegistry;
/**
 * Creates FactProviderRegistry contract instance
 */
export declare function initFactProviderRegistryContract(anyWeb3: IWeb3, registryAddress: Address): FactProviderRegistry;
