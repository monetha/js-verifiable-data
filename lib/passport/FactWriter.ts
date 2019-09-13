import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { IEthOptions } from 'lib/models/IEthOptions';
import { prepareTxConfig } from 'lib/utils/tx';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { IPrivateDataHashes } from './FactReader';
import { PrivateFactWriter } from './PrivateFactWriter';
import { RandomArrayGenerator } from 'lib/models/RandomArrayGenerator';

/**
 * Class to write facts to passport
 */
export class FactWriter {
  private contract: PassportLogic;
  private options: IEthOptions;
  private web3: Web3;

  public get passportAddress() { return this.contract.address; }

  constructor(web3: Web3, passportAddress: Address, options?: IEthOptions) {
    this.contract = new web3.eth.Contract(passportLogicAbi as AbiItem[], passportAddress);
    this.options = options || {};
    this.web3 = web3;
  }

  /**
   * Writes string type fact to passport
   */
  public async setString(key: string, value: string, factProviderAddress: Address) {
    return this.set('setString', key, value, factProviderAddress);
  }

  /**
   * Writes bytes type fact to passport
   */
  public async setBytes(key: string, value: number[], factProviderAddress: Address) {
    return this.set('setBytes', key, value, factProviderAddress);
  }

  /**
   * Writes address type fact to passport
   */
  public async setAddress(key: string, value: Address, factProviderAddress: Address) {
    return this.set('setAddress', key, value, factProviderAddress);
  }

  /**
   * Writes uint type fact to passport
   */
  public async setUint(key: string, value: number, factProviderAddress: Address) {
    return this.set('setUint', key, value, factProviderAddress);
  }

  /**
   * Writes int type fact to passport
   */
  public async setInt(key: string, value: number, factProviderAddress: Address) {
    return this.set('setInt', key, value, factProviderAddress);
  }

  /**
   * Writes boolean type fact to passport
   */
  public async setBool(key: string, value: boolean, factProviderAddress: Address) {
    return this.set('setBool', key, value, factProviderAddress);
  }

  /**
   * Writes TX data type fact to passport
   */
  public async setTxdata(key: string, value: number[], factProviderAddress: Address) {
    return this.set('setTxDataBlockNumber', key, value, factProviderAddress);
  }

  /**
   * Writes IPFS hash data type fact to passport
   *
   * @param value value to store on IPFS
   * @param ipfs IPFS client
   */
  public async setIPFSData(key: string, value: any, factProviderAddress: Address, ipfs: IIPFSClient) {

    // Get hash
    let result = await ipfs.add(value);
    if (Array.isArray(result)) {
      result = result[0];
    }

    if (!result || !result.Hash) {
      throw createSdkError(ErrorCode.InvalidIPFSObject,
        'Returned result from IPFS file adding is not as expected. Result object should contain property "hash"');
    }

    return this.set('setIPFSHash', key, result.Hash, factProviderAddress);
  }

  /**
   * Writes private data value to IPFS by encrypting it and then storing IPFS hashes of encrypted data to passport fact.
   * Data can be decrypted using passport owner's wallet private key or a secret key which is returned as a result of this call.
   *
   * @param value value to store privately
   * @param ipfs IPFS client
   */
  public async setPrivateData(key: string, value: number[], factProviderAddress: Address, ipfs: IIPFSClient, rand?: RandomArrayGenerator) {
    const privateWriter = new PrivateFactWriter(this.web3, this, this.options);

    return privateWriter.setPrivateData(factProviderAddress, key, value, ipfs, rand);
  }

  /**
   * Writes IPFS hash of encrypted private data and hash of data encryption key
   */
  public async setPrivateDataHashes(key: string, value: IPrivateDataHashes, factProviderAddress: Address) {
    const preparedKey = this.web3.utils.fromAscii(key);

    const txData = this.contract.methods.setPrivateDataHashes(
      preparedKey,
      value.dataIpfsHash,
      value.dataKeyHash);

    return prepareTxConfig(this.web3, factProviderAddress, this.contract.address, txData);
  }

  private async set(method: keyof PassportLogic['methods'], key: string, value: any, factProviderAddress: Address) {
    const preparedKey = this.web3.utils.fromAscii(key);

    const func = this.contract.methods[method] as any;
    const txData = func(preparedKey, value);

    return prepareTxConfig(this.web3, factProviderAddress, this.contract.address, txData);
  }
}
