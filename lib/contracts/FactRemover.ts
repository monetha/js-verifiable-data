import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

/**
 * Class for fact deletion
 */
export class FactRemover {
  private contract: ContractIO;

  constructor(passportAddress: Address, network: string) {
    this.contract = new ContractIO(abi.PassportLogic.abi, passportAddress, network);
  }

  /**
   * Deletes string type fact from passport
   * @param key fact key
   * @param userAddress
   */
  public async deleteString(key: string, userAddress: Address) {
    return this.delete('deleteString', key, userAddress);
  }

  /**
   * Deletes byte type fact from passport
   * @param key fact key
   */
  public async deleteBytes(key: string, userAddress: Address) {
    return this.delete('deleteBytes', key, userAddress);
  }

  /**
   * Deletes address type fact from passport
   * @param key fact key
   */
  public async deleteAddress(key: string, userAddress: Address) {
    return this.delete('deleteAddress', key, userAddress);
  }

  /**
   * Deletes uint type fact from passport
   * @param key fact key
   */
  public async deleteUint(key: string, userAddress: Address) {
    return this.delete('deleteUint', key, userAddress);
  }

  /**
   * Deletes int type fact from passport
   * @param key fact key
   */
  public async deleteInt(key: string, userAddress: Address) {
    return this.delete('deleteInt', key, userAddress);
  }

  /**
   * Deletes bool type fact from passport
   * @param key fact key
   */
  public async deleteBool(key: string, userAddress: Address) {
    return this.delete('deleteBool', key, userAddress);
  }

  /**
   * Deletes txdata type fact from passport
   * @param key fact key
   */
  public async deleteTxdata(key: string, userAddress: Address) {
    return this.delete('deleteTxdata', key, userAddress);
  }

  /**
   * Deletes IPFS hash type fact from passport
   * @param key fact key
   */
  public async deleteIPFSHash(key: string, userAddress: Address) {
    return this.delete('deleteIPFSHash', key, userAddress);
  }

  private async delete(method: string, key: string, userAddress: Address) {
    const preparedKey = this.contract.web3.fromAscii(key);

    return this.contract.prepareCallTX(method, [preparedKey], userAddress);
  }
}
