import { Harmony } from '@harmony-js/core';
import { Address } from 'lib/models/Address';
import { AbiItem } from 'web3-utils';
import factProviderRegistryAbi from '../../config/FactProviderRegistry.json';
import passportAbi from '../../config/Passport.json';
import passportFactoryAbi from '../../config/PassportFactory.json';
import passportLogicAbi from '../../config/PassportLogic.json';
import passportLogicRegistryAbi from '../../config/PassportLogicRegistry.json';

/**
 * Creates PassportFactory contract instance
 */
export function initPassportFactoryContract(harmony: Harmony, factoryAddress: Address) {
  return harmony.contracts.createContract(passportFactoryAbi as AbiItem[], factoryAddress);
}

/**
 * Creates PassportLogic contract instance
 */
export function initPassportLogicContract(harmony: Harmony, passportAddress: Address) {
  return harmony.contracts.createContract(passportLogicAbi as AbiItem[], passportAddress);
}

/**
 * Creates Passport contract instance
 */
export function initPassportContract(harmony: Harmony, passportAddress: Address) {
  return harmony.contracts.createContract(passportAbi as AbiItem[], passportAddress);
}

/**
 * Creates PassportLogicRegistry contract instance
 */
export function initPassportLogicRegistryContract(harmony: Harmony, registryAddress: Address) {
  return harmony.contracts.createContract(passportLogicRegistryAbi as AbiItem[], registryAddress);
}

/**
 * Creates FactProviderRegistry contract instance
 */
export function initFactProviderRegistryContract(harmony: Harmony, registryAddress: Address) {
  return harmony.contracts.createContract(factProviderRegistryAbi as AbiItem[], registryAddress);
}
