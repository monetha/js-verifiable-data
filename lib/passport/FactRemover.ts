import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic';
import { prepareTxConfig } from 'lib/utils/tx';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';

/**
 * Class for fact deletion
 */
export class FactRemover {
  private contract: PassportLogic;
  private web3: Web3;

  constructor(web3: Web3, passportAddress: Address) {
    this.contract = new web3.eth.Contract(passportLogicAbi as AbiItem[], passportAddress);
    this.web3 = web3;
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

  private async delete(method: keyof PassportLogic['methods'], key: string, factProviderAddress: Address) {
    const preparedKey = this.web3.utils.fromAscii(key);

    const func = this.contract.methods[method] as any;
    const txData = func(preparedKey);

    return prepareTxConfig(this.web3, factProviderAddress, this.contract.address, txData);
  }
}
