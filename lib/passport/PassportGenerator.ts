import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

export class PassportGenerator {
  private contract: ContractIO;

  constructor(web3, passportFactoryAddress: Address) {
    this.contract = new ContractIO(web3, abi.PassportFactory.abi, passportFactoryAddress);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(factProviderAddress: Address) {
    return this.contract.prepareCallTX('createPassport', [], factProviderAddress);
  }
}
