import { Harmony } from '@harmony-js/core';
import { TransasctionReceipt } from '@harmony-js/transaction';
import { configureSendMethod } from 'lib/utils/tx';
import { Address } from '../models/Address';
import { initPassportFactoryContract } from './rawContracts';

export class PassportGenerator {
  private harmony: Harmony;
  private passFactoryAddress: Address;

  /**
   * Utility to extract passport address from passport creation transaction receipt
   */
  public static getPassportAddressFromReceipt(passportCreationReceipt: TransasctionReceipt) {
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

  constructor(harmony: Harmony, passportFactoryAddress: Address) {
    this.harmony = harmony;
    this.passFactoryAddress = passportFactoryAddress;
  }

  private getContract() {
    return initPassportFactoryContract(this.harmony, this.passFactoryAddress);
  }

  /**
   * Creates an empty passport and returns its address
   */
  public async createPassport(ownerAddress: Address) {
    const method = this.getContract().methods.createPassport();

    return configureSendMethod(this.harmony, method, ownerAddress);
  }
}
