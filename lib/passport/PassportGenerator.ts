import { prepareTxConfig } from 'lib/utils/tx';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Address } from '../models/Address';
import { PassportFactory } from '../types/web3-contracts/PassportFactory';
import { initPassportFactoryContract } from './rawContracts';
import { IWeb3 } from 'lib/models/IWeb3';

export class PassportGenerator {
  private contract: PassportFactory;
  private web3: Web3;

  /**
   * Utility to extract passport address from passport creation transaction receipt
   */
  public static getPassportAddressFromReceipt(passportCreationReceipt: TransactionReceipt) {
    if (!passportCreationReceipt) {
      return null;
    }

    const { logs } = passportCreationReceipt;
    if (!logs || logs.length === 0) {
      return null;
    }

    const { topics } = logs[0];
    if (!topics || topics.length < 2) {
      return null;
    }

    return `0x${topics[1].slice(26)}`;
  }

  constructor(anyWeb3: IWeb3, passportFactoryAddress: Address) {
    this.web3 = new Web3(anyWeb3.eth.currentProvider);
    this.contract = initPassportFactoryContract(anyWeb3, passportFactoryAddress);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(ownerAddress: Address) {
    const txData = this.contract.methods.createPassport();

    return prepareTxConfig(this.web3, ownerAddress, this.contract.address, txData);
  }
}
