import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { getTxData, IMethodInfo } from '../utils/getTxData';

export interface IFactValue<TValue> {
  factProviderAddress: string;
  key: string;
  value: TValue;
}

/**
 * Class to read historic facts from the passport
 */
export class FactHistoryReader {

  private web3;

  constructor(web3) {
    this.web3 = web3;
  }

  /**
   * Read string type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   */
  public async getString(txHash: string): Promise<IFactValue<string>> {

    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setString');

    return {
      factProviderAddress: txInfo.txReceipt.from,
      key: methodInfo.params[0].value,
      value: methodInfo.params[1].value,
    };
  }

  /**
   * Read bytes type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBytes(factProviderAddress: Address, key: string): Promise<number[]> {
    return null;
  }

  /**
   * Read address type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getAddress(factProviderAddress: Address, key: string): Promise<string> {
    return null;
  }

  /**
   * Read uint type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getUint(factProviderAddress: Address, key: string): Promise<number> {
    return null;
  }

  /**
   * Read int type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getInt(factProviderAddress: Address, key: string): Promise<number> {
    return null;
  }

  /**
   * Read boolean type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBool(factProviderAddress: Address, key: string): Promise<boolean> {
    return null;
  }

  /**
   * Read TX data type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getTxdata(factProviderAddress: Address, key: string): Promise<string> {
    return null;


    // const blockNumHex = this.web3.toHex(data);
    // const events = await fetchEvents(this.ethNetworkUrl, blockNumHex, blockNumHex, this.passportAddress);
    // const txBlock = await getTxData(events[0].transactionHash, this.web3);
    // const txDataString = txBlock.params[1].value;
    // const txData = this.web3.toAscii(txDataString);

    // return txData;
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


    // Get hash
    //return ipfs.cat(hash);
  }

  private async get(method: string, factProviderAddress: Address, key: string) {
    // const preparedKey = this.web3.fromAscii(key);

    // const result = await this.contractIO.readData(method, [factProviderAddress, preparedKey]);

    // // TODO: add comments about these indexes 0 and 1
    // if (!result[0]) {
    //   return null;
    // }

    // return result[1];
  }

  private validateMethodSignature(methodInfo: IMethodInfo, expectedName: string) {
    if (methodInfo.name !== expectedName) {
      throw new Error(`Input method signature for transaction must be "${expectedName}". Got "${methodInfo.name}"`);
    }
  }
}
