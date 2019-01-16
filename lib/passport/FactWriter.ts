import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

/**
 * Class to write facts to passport
 */
export class FactWriter {
  private contractIO: ContractIO;

  private get web3() { return this.contractIO.getWeb3(); }

  constructor(web3, passportAddress: Address) {
    this.contractIO = new ContractIO(web3, abi.PassportLogic.abi, passportAddress);
  }

  /**
   * Writes string type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setString(key: string, value: string, factProviderAddress: Address) {
    return this.set('setString', key, value, factProviderAddress);
  }

  /**
   * Writes bytes type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setBytes(key: string, value: number[], factProviderAddress: Address) {
    return this.set('setBytes', key, value, factProviderAddress);
  }

  /**
   * Writes address type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setAddress(key: string, value: Address, factProviderAddress: Address) {
    return this.set('setAddress', key, value, factProviderAddress);
  }

  /**
   * Writes uint type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setUint(key: string, value: number, factProviderAddress: Address) {
    return this.set('setUint', key, value, factProviderAddress);
  }

  /**
   * Writes int type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setInt(key: string, value: number, factProviderAddress: Address) {
    return this.set('setInt', key, value, factProviderAddress);
  }

  /**
   * Writes boolean type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setBool(key: string, value: boolean, factProviderAddress: Address) {
    return this.set('setBool', key, value, factProviderAddress);
  }

  /**
   * Writes TX data type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setTxdata(key: string, value: number[], factProviderAddress: Address) {
    return this.set('setTxdata', key, value, factProviderAddress);
  }

  /**
   * Writes IPFS hash data type fact to passport
   *
   * @param key fact key
   * @param value value to store
   */
  public async setIPFSHash(key: string, value: string, factProviderAddress: Address) {
    return this.set('setIPFSHash', key, value, factProviderAddress);
  }

  private async set(method: string, key: string, value: any, factProviderAddress: Address) {
    const preparedKey = this.web3.fromAscii(key);

    return this.contractIO.prepareCallTX(method, [preparedKey, value], factProviderAddress);
  }
}
