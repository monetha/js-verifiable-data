import { ContractIO } from '../transactionHelpers/ContractIO';
import { Address } from '../models/Address';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';

/**
 * Class for fact deletion
 */
export class FactRemover {
  private contractIO: ContractIO;

  private get web3() { return this.contractIO.getWeb3(); }

  constructor(web3: Web3, passportAddress: Address) {
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
  }

  /**
   * Deletes string type fact from passport
   * @param key fact key
   * @param factProviderAddress
   */
  public async deleteString(key: string, factProviderAddress: Address) {
    return this.delete('deleteString', key, factProviderAddress);
  }

  /**
   * Deletes byte type fact from passport
   * @param key fact key
   */
  public async deleteBytes(key: string, factProviderAddress: Address) {
    return this.delete('deleteBytes', key, factProviderAddress);
  }

  /**
   * Deletes address type fact from passport
   * @param key fact key
   */
  public async deleteAddress(key: string, factProviderAddress: Address) {
    return this.delete('deleteAddress', key, factProviderAddress);
  }

  /**
   * Deletes uint type fact from passport
   * @param key fact key
   */
  public async deleteUint(key: string, factProviderAddress: Address) {
    return this.delete('deleteUint', key, factProviderAddress);
  }

  /**
   * Deletes int type fact from passport
   * @param key fact key
   */
  public async deleteInt(key: string, factProviderAddress: Address) {
    return this.delete('deleteInt', key, factProviderAddress);
  }

  /**
   * Deletes bool type fact from passport
   * @param key fact key
   */
  public async deleteBool(key: string, factProviderAddress: Address) {
    return this.delete('deleteBool', key, factProviderAddress);
  }

  /**
   * Deletes txdata type fact from passport
   * @param key fact key
   */
  public async deleteTxdata(key: string, factProviderAddress: Address) {
    return this.delete('deleteTxdata', key, factProviderAddress);
  }

  /**
   * Deletes IPFS hash type fact from passport
   * @param key fact key
   */
  public async deleteIPFSHash(key: string, factProviderAddress: Address) {
    return this.delete('deleteIPFSHash', key, factProviderAddress);
  }

  private async delete(method: string, key: string, factProviderAddress: Address) {
    const preparedKey = this.web3.utils.fromAscii(key);

    return this.contractIO.prepareCallTX(method, [preparedKey], factProviderAddress);
  }
}
