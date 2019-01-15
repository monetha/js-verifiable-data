import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

/**
 * Class to write facts to passport
 */
export class FactWriter {
  private contract: ContractIO;

  constructor(passportAddress: Address, network: string) {
    this.contract = new ContractIO(abi.PassportLogic.abi, passportAddress, network);
  }

  /**
   * Writes string type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setString(key: string, value: string, userAddress: Address) {
    return this.set('setString', key, value, userAddress);
  }

  /**
   * Writes bytes type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setBytes(key: string, value: number[], userAddress: Address) {
    return this.set('setBytes', key, value, userAddress);
  }

  /**
   * Writes address type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setAddress(key: string, value: Address, userAddress: Address) {
    return this.set('setAddress', key, value, userAddress);
  }

  /**
   * Writes uint type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setUint(key: string, value: number, userAddress: Address) {
    return this.set('setUint', key, value, userAddress);
  }

  /**
   * Writes int type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setInt(key: string, value: number, userAddress: Address) {
    return this.set('setInt', key, value, userAddress);
  }

  /**
   * Writes boolean type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setBool(key: string, value: boolean, userAddress: Address) {
    return this.set('setBool', key, value, userAddress);
  }

  /**
   * Writes TX data type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setTxdata(key: string, value: number[], userAddress: Address) {
    return this.set('setTxdata', key, value, userAddress);
  }

  private async set(method: string, key: string, value: any, userAddress: Address) {
    const preparedKey = this.contract.web3.fromAscii(key);

    return this.contract.prepareCallTX(method, [preparedKey, value], userAddress);
  }
}
