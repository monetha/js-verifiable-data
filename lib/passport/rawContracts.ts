import { Address } from 'lib/models/Address';
import passportAbi from '../../config/Passport.json';
import passportFactoryAbi from '../../config/PassportFactory.json';
import passportLogicAbi from '../../config/PassportLogic.json';
import passportLogicRegistryAbi from '../../config/PassportLogicRegistry.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { PassportFactory } from 'lib/types/web3-contracts/PassportFactory';
import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic';
import { Passport } from 'lib/types/web3-contracts/Passport';
import { PassportLogicRegistry } from 'lib/types/web3-contracts/PassportLogicRegistry';

/**
 * Creates PassportFactory contract instance
 */
export function initPassportFactoryContract(web3: Web3, factoryAddress: Address) {
  return new web3.eth.Contract(passportFactoryAbi as AbiItem[], factoryAddress) as PassportFactory;
}

/**
 * Creates PassportLogic contract instance
 */
export function initPassportLogicContract(web3: Web3, passportAddress: Address) {
  return new web3.eth.Contract(passportLogicAbi as AbiItem[], passportAddress) as PassportLogic;
}

/**
 * Creates Passport contract instance
 */
export function initPassportContract(web3: Web3, passportAddress: Address) {
  return new web3.eth.Contract(passportAbi as AbiItem[], passportAddress) as Passport;
}

/**
 * Creates PassportLogicRegistry contract instance
 */
export function initPassportLogicRegistryContract(web3: Web3, registryAddress: Address) {
  return new web3.eth.Contract(passportLogicRegistryAbi as AbiItem[], registryAddress) as PassportLogicRegistry;
}
