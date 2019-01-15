import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

export class PassportGenerator {
  private contract: ContractIO;

  constructor(network: string, passportFactoryAddress: Address) {
    this.contract = new ContractIO(abi.PassportFactory.abi, passportFactoryAddress, network);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(userAddress: Address) {
    return this.contract.prepareCallTX('createPassport', [], userAddress);
  }
}
