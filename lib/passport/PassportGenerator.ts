import { ContractIO } from '../transactionHelpers/ContractIO';
import { Address } from '../models/Address';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import passportFactoryAbi from '../../config/PassportFactory.json';
import { PassportFactory } from '../types/web3-contracts/PassportFactory';

export class PassportGenerator {
  private contract: ContractIO<PassportFactory>;

  constructor(web3: Web3, passportFactoryAddress: Address) {
    this.contract = new ContractIO(web3, passportFactoryAbi as AbiItem[], passportFactoryAddress);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(ownerAddress: Address) {
    const contract = this.contract.getContract();

    const tx = contract.methods.createPassport();

    return this.contract.prepareRawTX(ownerAddress, contract.address, 0, tx);
  }
}
