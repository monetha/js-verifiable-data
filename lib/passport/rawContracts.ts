import { Address } from 'lib/models/Address';
import passportAbi from '../../config/Passport.json';
import passportFactoryAbi from '../../config/PassportFactory.json';
import passportLogicAbi from '../../config/PassportLogic.json';
import passportLogicRegistryAbi from '../../config/PassportLogicRegistry.json';
import factProviderRegistryAbi from '../../config/FactProviderRegistry.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { PassportFactory } from 'lib/types/web3-contracts/PassportFactory';
import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic';
import { Passport } from 'lib/types/web3-contracts/Passport';
import { PassportLogicRegistry } from 'lib/types/web3-contracts/PassportLogicRegistry';
import { FactProviderRegistry } from 'lib/types/web3-contracts/FactProviderRegistry';
import { IWeb3 } from 'lib/models/IWeb3';

/**
 * Creates PassportFactory contract instance
 */
export function initPassportFactoryContract(anyWeb3: IWeb3, factoryAddress: Address) {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  return new web3.eth.Contract(passportFactoryAbi as AbiItem[], factoryAddress) as PassportFactory;
}

/**
 * Creates PassportLogic contract instance
 */
export function initPassportLogicContract(anyWeb3: IWeb3, passportAddress: Address) {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  return new web3.eth.Contract(passportLogicAbi as AbiItem[], passportAddress) as PassportLogic;
}

/**
 * Creates Passport contract instance
 */
export function initPassportContract(anyWeb3: IWeb3, passportAddress: Address) {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  return new web3.eth.Contract(passportAbi as AbiItem[], passportAddress) as Passport;
}

/**
 * Creates PassportLogicRegistry contract instance
 */
export function initPassportLogicRegistryContract(anyWeb3: IWeb3, registryAddress: Address) {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  return new web3.eth.Contract(passportLogicRegistryAbi as AbiItem[], registryAddress) as PassportLogicRegistry;
}

/**
 * Creates FactProviderRegistry contract instance
 */
export function initFactProviderRegistryContract(anyWeb3: IWeb3, registryAddress: Address) {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  return new web3.eth.Contract(factProviderRegistryAbi as AbiItem[], registryAddress) as FactProviderRegistry;
}
