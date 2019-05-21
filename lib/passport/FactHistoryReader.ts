import { IIPFSClient } from '../models/IIPFSClient';
import { getTxData, IMethodInfo } from '../utils/getTxData';
import Web3 from 'web3';

export interface IFactValue<TValue> {
  factProviderAddress: string;
  key: string;
  value: TValue;
}

/**
 * Class to read historic facts from the passport
 */
export class FactHistoryReader {

  private web3: Web3;

  constructor(web3) {
    this.web3 = web3;
  }

  /**
   * Read string type fact from transaction
   */
  public async getString(txHash: string): Promise<IFactValue<string>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setString');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value,
    };
  }

  /**
   * Read bytes type fact from transaction
   */
  public async getBytes(txHash: string): Promise<IFactValue<number[]>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setBytes');

    let value: number[] = [];
    const hexValue = methodInfo.params[1].value;
    if (hexValue) {
      value = this.web3.utils.hexToBytes(hexValue);
    }

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value,
    };
  }

  /**
   * Read address type fact from transaction
   */
  public async getAddress(txHash: string): Promise<IFactValue<string>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setAddress');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value,
    };
  }

  /**
   * Read uint type fact from transaction
   */
  public async getUint(txHash: string): Promise<IFactValue<number>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setUint');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: parseInt(methodInfo.params[1].value, 10),
    };
  }

  /**
   * Read int type fact from transaction
   */
  public async getInt(txHash: string): Promise<IFactValue<number>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setInt');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: parseInt(methodInfo.params[1].value, 10),
    };
  }

  /**
   * Read boolean type fact from transaction
   */
  public async getBool(txHash: string): Promise<IFactValue<boolean>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setBool');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value as any,
    };
  }

  /**
   * Read TX data type fact from transaction
   */
  public async getTxdata(txHash: string): Promise<IFactValue<number[]>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setTxDataBlockNumber');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: this.web3.utils.hexToBytes(methodInfo.params[1].value),
    };
  }

  /**
   * Read IPFS hash type fact from transaction
   * @param ipfs IPFS client
   *
   * @returns data stored in IPFS
   */
  public async getIPFSData(txHash: string, ipfs: IIPFSClient): Promise<IFactValue<any>> {
    const txInfo = await getTxData(txHash, this.web3);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setIPFSHash');

    return {
      factProviderAddress: txInfo.tx.from,
      key: this.bytesToUnpaddedAscii(methodInfo.params[0].value),
      value: await ipfs.cat(methodInfo.params[1].value),
    };
  }

  private validateMethodSignature(methodInfo: IMethodInfo, expectedName: string) {
    if (methodInfo.name !== expectedName) {
      throw new Error(`Input method signature for transaction must be "${expectedName}". Got "${methodInfo.name}"`);
    }
  }

  private bytesToUnpaddedAscii(bytes: string) {
    return this.web3.utils.toAscii(bytes).replace(/\u0000/g, '');
  }
}
