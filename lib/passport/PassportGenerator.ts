import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

export class PassportGenerator {
  private contract: ContractIO;

  constructor(web3: Web3, passportFactoryAddress: Address) {
    this.contract = new ContractIO(web3, abi.PassportFactory.abi as AbiItem[], passportFactoryAddress);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(factProviderAddress: Address) {
    return this.contract.prepareCallTX('createPassport', [], factProviderAddress);
  }
}
