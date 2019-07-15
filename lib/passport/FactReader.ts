import { IEthOptions } from 'lib/models/IEthOptions';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { fetchEvents } from '../utils/fetchEvents';
import { PrivateFactReader } from './PrivateFactReader';
import { getSignedTx, decodeTx } from 'lib/utils/tx';

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
  private contractIO: ContractIO<PassportLogic>;
  private ethNetworkUrl: string;
  private options: IEthOptions;

  public get web3() { return this.contractIO.getWeb3(); }
  public get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3: Web3, ethNetworkUrl: string, passportAddress: Address, options?: IEthOptions) {
    this.ethNetworkUrl = ethNetworkUrl;
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
    this.options = options || {};
  }

  /**
   * Read string type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getString(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getString', factProviderAddress, key);
  }

  /**
   * Read bytes type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBytes(factProviderAddress: Address, key: string): Promise<number[]> {
    const value = await this.get('getBytes', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return this.web3.utils.hexToBytes(value);
  }

  /**
   * Read address type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getAddress(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getAddress', factProviderAddress, key);
  }

  /**
   * Read uint type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getUint(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getUint', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return value.toNumber();
  }

  /**
   * Read int type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getInt(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getInt', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return value.toNumber();
  }

  /**
   * Read boolean type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBool(factProviderAddress: Address, key: string): Promise<boolean> {
    return this.get('getBool', factProviderAddress, key);
  }

  /**
   * Read TX data type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getTxdata(factProviderAddress: Address, key: string): Promise<number[]> {
    const data = await this.get('getTxDataBlockNumber', factProviderAddress, key);

    if (!data) {
      return null;
    }

    const blockNumHex = this.web3.utils.toHex(data);
    const events = await fetchEvents(this.ethNetworkUrl, blockNumHex, blockNumHex, this.passportAddress);
    const signedTx = await getSignedTx(events[0].transactionHash, this.web3, this.options);
    const txInfo = await decodeTx(signedTx, this.web3, this.options);
    const txDataString = txInfo.methodInfo.params[1].value;
    const txData = this.web3.utils.hexToBytes(txDataString);

    return txData;
  }

  /**
   * Read IPFS hash type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
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
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
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
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
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
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getPrivateDataHashes(factProviderAddress: Address, key: string): Promise<IPrivateDataHashes> {
    const preparedKey = this.web3.utils.fromAscii(key);

    const tx = this.contractIO.getContract().methods.getPrivateDataHashes(factProviderAddress, preparedKey);
    const result = await tx.call();

    if (!result.success) {
      return null;
    }

    return {
      dataIpfsHash: result.dataIPFSHash,
      dataKeyHash: result.dataKeyHash,
    };
  }

  private async get(method: string, factProviderAddress: Address, key: string) {
    const preparedKey = this.web3.utils.fromAscii(key);

    // Contract returns result = (bool success, any value) as an array, each parameter is mapped in an array by its' index
    // success - flag which determines if value was written prior reading or this is a default value from Ethereum storage
    // value - data read from Ethereum storage
    const result = await this.contractIO.readData(method, [factProviderAddress, preparedKey]);

    // Return null in case if value was not initialized
    if (!result[0]) {
      return null;
    }

    return result[1];
  }
}
