import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

export class PassportGenerator {
  private contract: ContractIO;

  constructor(web3, passportFactoryAddress: Address) {
    this.contract = new web3.eth.Contract(abi.PassportFactory.abi, passportFactoryAddress) as ContractIO;
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(factProviderAddress: Address) {
    return this.contract.prepareCallTX('createPassport', [], factProviderAddress);
  }
}
