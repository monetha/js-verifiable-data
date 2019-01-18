import abi from '../../config/abis';
import { Address } from '../models/Address';
import { fetchEvents } from '../utils/fetchEvents';
import { getTxData } from '../utils/getTxData';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { IIPFSClient } from '../models/IIPFSClient';

/**
 * Class to read facts from the passport
 */
export class FactReader {
  private contractIO: ContractIO;
  private ethNetworkUrl: string;

  private get web3() { return this.contractIO.getWeb3(); }
  private get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3, ethNetworkUrl: string, passportAddress: Address) {
    this.ethNetworkUrl = ethNetworkUrl;
    this.contractIO = new ContractIO(web3, abi.PassportLogic.abi, passportAddress);
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
    return this.get('getBytes', factProviderAddress, key);
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
    return this.get('getUint', factProviderAddress, key);
  }

  /**
   * Read int type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getInt(factProviderAddress: Address, key: string): Promise<number> {
    return this.get('getInt', factProviderAddress, key);
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
  public async getTxdata(factProviderAddress: Address, key: string): Promise<string> {
    const data = await this.get('getTxDataBlockNumber', factProviderAddress, key);

    if (!data) {
      return null;
    }

    const blockNumHex = this.web3.toHex(data);
    const events = await fetchEvents(this.ethNetworkUrl, blockNumHex, blockNumHex, this.passportAddress);
    const txBlock = await getTxData(events[0].transactionHash, this.web3);
    const txDataString = txBlock.params[1].value;
    const txData = this.web3.toAscii(txDataString);

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

  private async get(method: string, factProviderAddress: Address, key: string) {
    const preparedKey = this.web3.fromAscii(key);

    const result = await this.contractIO.readData(method, [factProviderAddress, preparedKey]);

    // TODO: add comments about these indexes 0 and 1
    if (!result[0]) {
      return null;
    }

    return result[1];
  }
}
