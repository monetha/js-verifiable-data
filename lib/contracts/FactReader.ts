import abi from '../../config/abis';
import { Web3Provider } from '../transactionHelpers/Web3Provider';
import { Address } from '../models/Address';
import { fetchEvents } from '../providers/fetchEvents';
import { getTxData } from '../providers/getTxData';

/**
 * Class to read facts from the passport
 */
export class FactReader {
  private contractInstance: any;
  private web3: any;
  private url: string;
  private contractAddress: Address;

  constructor(network: string) {
    this.web3 = new Web3Provider(network).web3;
    this.url = network;
  }

  // TODO: Align with other classes
  public setContract(passportAddress: string) {
    const contract = this.web3.eth.contract(abi.PassportLogic.abi);
    this.contractInstance = contract.at(passportAddress);
    this.contractAddress = passportAddress;
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
    const events = await fetchEvents(blockNumHex, blockNumHex, this.contractAddress, this.url);
    const txBlock = await getTxData(events[0].transactionHash, this.web3);
    const txDataString = txBlock.params[1].value;
    const txData = this.web3.toAscii(txDataString);

    return txData;
  }

  private async get(method: string, factProviderAddress: Address, key: string) {
    const preparedKey = this.web3.fromAscii(key);

    const result = await this.readData(method, [factProviderAddress, preparedKey]);

    // TODO: add comments about these indexes 0 and 1
    if (!result[0]) {
      return null;
    }

    return result[1];
  }

  // TODO: reuse ContractIO
  private async readData(
    contractFunctionName: string,
    contractArguments: any[]) {

    return new Promise((resolve, reject) => {
      const args = contractArguments || [];

      this.contractInstance[contractFunctionName].call(...args, { from: '' }, (err, data) => {
        if (err) {
          const error = 'DID not register';
          reject(error);
          return;
        }

        resolve(data);
      });
    });
  }
}
