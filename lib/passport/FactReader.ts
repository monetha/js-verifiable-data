import { Contract, formatBytes32String } from '@harmony-js/contract';
import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { toBN } from 'lib/utils/conversion';
import { getDecodedTx, callMethod } from 'lib/utils/tx';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { PrivateFactReader } from './PrivateFactReader';
import { initPassportLogicContract } from './rawContracts';
import { Harmony } from '@harmony-js/core';
import { getPastEvents } from 'lib/utils/logs';
import * as crypto from '@harmony-js/crypto';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IPrivateDataHashes {

  /**
   * IPFS hash where encrypted data with its metadata is stored
   */
  dataIpfsHash: string;

  /**
   * Hash of secret data encryption key in hex (with 0x prefix)
   */
  dataKeyHash: string;
}

// #endregion

/**
 * Class to read latest facts from the passport
 */
export class FactReader {
  private contract: Contract;
  private harmony: Harmony;

  public get passportAddress() { return this.contract.address; }

  constructor(harmony: Harmony, passportAddress: Address) {
    this.harmony = harmony;
    this.contract = initPassportLogicContract(harmony, passportAddress);
  }

  /**
   * Read string type fact from passport
   */
  public async getString(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getString', factProviderAddress, key);
  }

  /**
   * Read bytes type fact from passport
   */
  public async getBytes(factProviderAddress: Address, key: string): Promise<number[]> {
    const value = await this.get('getBytes', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return Array.from(crypto.arrayify(value));
  }

  /**
   * Read address type fact from passport
   */
  public async getAddress(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getAddress', factProviderAddress, key);
  }

  /**
   * Read uint type fact from passport
   */
  public async getUint(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getUint', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return toBN(value).toNumber();
  }

  /**
   * Read int type fact from passport
   */
  public async getInt(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getInt', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return toBN(value).toNumber();
  }

  /**
   * Read boolean type fact from passport
   */
  public async getBool(factProviderAddress: Address, key: string): Promise<boolean> {
    return this.get('getBool', factProviderAddress, key);
  }

  /**
   * Read TX data type fact from passport
   */
  public async getTxdata(factProviderAddress: Address, key: string): Promise<number[]> {
    const data = await this.get('getTxDataBlockNumber', factProviderAddress, key);

    if (!data) {
      return null;
    }

    const preparedKey = formatBytes32String(key);

    // TODO: check if number format for block is OK
    const blockNum = toBN(data).toNumber();

    const events = await getPastEvents(this.harmony, this.contract, 'TxDataUpdated', {
      fromBlock: blockNum,
      toBlock: blockNum,
      filter: {
        factProvider: factProviderAddress,
        key: preparedKey,
      },
    });

    if (!events || events.length === 0) {
      throw createSdkError(ErrorCode.DataNotFoundInBlock,
        `Event "TxDataUpdated", carrying the data, was not found in block ${blockNum} referenced by fact in passport`);
    }

    const txInfo = await getDecodedTx(this.harmony, events[events.length - 1].transactionHash);
    const txDataString = txInfo.methodInfo.params[1].value;
    const txData = Array.from(crypto.arrayify(txDataString));

    return txData;
  }

  /**
   * Read IPFS hash type fact from passport
   *
   * @param ipfs IPFS client
   *
   * @returns data stored in IPFS
   */
  public async getIPFSData(factProviderAddress: Address, key: string, ipfs: IIPFSClient): Promise<any> {
    const hash = await this.get('getIPFSHash', factProviderAddress, key);
    if (!hash) {
      return null;
    }

    // Get hash
    return ipfs.cat(hash);
  }

  /**
   * Read private data fact value using IPFS by decrypting it using passport owner private key.
   *
   * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
   * @param ipfs IPFS client
   */
  public async getPrivateData(factProviderAddress: Address, key: string, passportOwnerPrivateKey: string, ipfs: IIPFSClient): Promise<number[]> {
    const privateReader = new PrivateFactReader();

    const hashes = await this.getPrivateDataHashes(factProviderAddress, key);
    if (!hashes) {
      return null;
    }

    return privateReader.getPrivateData(
      {
        factProviderAddress,
        passportAddress: this.passportAddress,
        key,
        value: hashes,
      },
      passportOwnerPrivateKey,
      ipfs);
  }

  /**
   * Read private data fact value using IPFS by decrypting it using secret key, generated at the time of writing.
   *
   * @param secretKey secret key in hex, used for data decryption
   * @param ipfs IPFS client
   */
  public async getPrivateDataUsingSecretKey(factProviderAddress: Address, key: string, secretKey: string, ipfs: IIPFSClient): Promise<number[]> {
    const privateReader = new PrivateFactReader();

    const hashes = await this.getPrivateDataHashes(factProviderAddress, key);
    if (!hashes) {
      return null;
    }

    return privateReader.getPrivateDataUsingSecretKey(hashes.dataIpfsHash, secretKey, ipfs);
  }

  /**
   * Read private data hashes fact from the passport.
   */
  public async getPrivateDataHashes(factProviderAddress: Address, key: string): Promise<IPrivateDataHashes> {
    const preparedKey = formatBytes32String(key);

    const method = this.contract.methods.getPrivateDataHashes(factProviderAddress, preparedKey);
    const result = await callMethod(method);

    if (!result.success) {
      return null;
    }

    return {
      dataIpfsHash: result.dataIPFSHash,
      dataKeyHash: result.dataKeyHash,
    };
  }

  private async get(method: string, factProviderAddress: Address, key: string) {
    const preparedKey = formatBytes32String(key);

    const func = this.contract.methods[method] as any;
    const result: [boolean, any] = await callMethod(func(factProviderAddress, preparedKey));

    // Return null in case if value was not initialized
    if (!result || !result[0]) {
      return null;
    }

    return result[1];
  }
}
