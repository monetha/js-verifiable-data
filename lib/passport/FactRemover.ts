import { Contract, formatBytes32String } from '@harmony-js/contract';
import { Address } from '../models/Address';
import { initPassportLogicContract } from './rawContracts';
import { Harmony } from '@harmony-js/core';
import { configureSendMethod } from 'lib/utils/tx';

/**
 * Class for fact deletion
 */
export class FactRemover {
  private passportAddress: Address;
  private harmony: Harmony;

  constructor(harmony: Harmony, passportAddress: Address) {
    this.harmony = harmony;
    this.passportAddress = passportAddress;
  }

  private getContract(): Contract {
    return initPassportLogicContract(this.harmony, this.passportAddress);
  }

  /**
   * Deletes string type fact from passport
   */
  public async deleteString(key: string, factProviderAddress: Address) {
    return this.delete('deleteString', key, factProviderAddress);
  }

  /**
   * Deletes byte type fact from passport
   */
  public async deleteBytes(key: string, factProviderAddress: Address) {
    return this.delete('deleteBytes', key, factProviderAddress);
  }

  /**
   * Deletes address type fact from passport
   */
  public async deleteAddress(key: string, factProviderAddress: Address) {
    return this.delete('deleteAddress', key, factProviderAddress);
  }

  /**
   * Deletes uint type fact from passport
   */
  public async deleteUint(key: string, factProviderAddress: Address) {
    return this.delete('deleteUint', key, factProviderAddress);
  }

  /**
   * Deletes int type fact from passport
   */
  public async deleteInt(key: string, factProviderAddress: Address) {
    return this.delete('deleteInt', key, factProviderAddress);
  }

  /**
   * Deletes bool type fact from passport
   */
  public async deleteBool(key: string, factProviderAddress: Address) {
    return this.delete('deleteBool', key, factProviderAddress);
  }

  /**
   * Deletes txdata type fact from passport
   */
  public async deleteTxdata(key: string, factProviderAddress: Address) {
    return this.delete('deleteTxDataBlockNumber', key, factProviderAddress);
  }

  /**
   * Deletes IPFS hash type fact from passport
   */
  public async deleteIPFSHash(key: string, factProviderAddress: Address) {
    return this.delete('deleteIPFSHash', key, factProviderAddress);
  }

  /**
   * Deletes privateDataHashes type fact from passport
   */
  public async deletePrivateDataHashes(key: string, factProviderAddress: Address) {
    return this.delete('deletePrivateDataHashes', key, factProviderAddress);
  }

  private async delete(methodName: string, key: string, factProviderAddress: Address) {
    const preparedKey = formatBytes32String(key);

    const func = this.getContract().methods[methodName] as any;
    const method = func(preparedKey);

    return configureSendMethod(this.harmony, method, factProviderAddress);
  }
}
