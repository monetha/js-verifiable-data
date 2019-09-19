import { Address } from '../models/Address';
import Web3 from 'web3';
import { PassportFactory } from '../types/web3-contracts/PassportFactory';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { Passport } from '../types/web3-contracts/Passport';
import { PassportLogicRegistry } from '../types/web3-contracts/PassportLogicRegistry';
/**
 * Creates PassportFactory contract instance
 */
export declare function initPassportFactoryContract(web3: Web3, factoryAddress: Address): PassportFactory;
/**
 * Creates PassportLogic contract instance
 */
export declare function initPassportLogicContract(web3: Web3, passportAddress: Address): PassportLogic;
/**
 * Creates Passport contract instance
 */
export declare function initPassportContract(web3: Web3, passportAddress: Address): Passport;
/**
 * Creates PassportLogicRegistry contract instance
 */
export declare function initPassportLogicRegistryContract(web3: Web3, registryAddress: Address): PassportLogicRegistry;
