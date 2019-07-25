import { prepareTxConfig } from 'lib/utils/tx';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportFactoryAbi from '../../config/PassportFactory.json';
import { Address } from '../models/Address';
import { PassportFactory } from '../types/web3-contracts/PassportFactory';
import { TransactionReceipt } from 'web3-core';

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

  constructor(web3: Web3, passportFactoryAddress: Address) {
    this.contract = new web3.eth.Contract(passportFactoryAbi as AbiItem[], passportFactoryAddress);
    this.web3 = web3;
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(ownerAddress: Address) {
    const txData = this.contract.methods.createPassport();

    return prepareTxConfig(this.web3, ownerAddress, this.contract.address, txData);
  }
}
