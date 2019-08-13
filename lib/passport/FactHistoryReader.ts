import { IEthOptions } from 'lib/models/IEthOptions';
import { hexToUnpaddedAscii } from 'lib/utils/conversion';
import Web3 from 'web3';
import { IIPFSClient } from '../models/IIPFSClient';
import { IMethodInfo, getDecodedTx } from '../utils/tx';
import { IPrivateDataHashes } from './FactReader';
import { PrivateFactReader } from './PrivateFactReader';
import { createSdkError } from 'lib/errors/SdkError';
import { ErrorCode } from 'lib/errors/ErrorCode';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IFactValue<TValue> {
  factProviderAddress: string;
  passportAddress: string;
  key: string;
  value: TValue;
}

// #endregion

/**
 * Class to read historic fact changes from the passport
 */
export class FactHistoryReader {

  private web3: Web3;
  private options: IEthOptions;

  constructor(web3, options?: IEthOptions) {
    this.web3 = web3;
    this.options = options || {};
  }

  /**
   * Read string type fact from transaction
   */
  public async getString(txHash: string): Promise<IFactValue<string>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setString');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value,
    };
  }

  /**
   * Read bytes type fact from transaction
   */
  public async getBytes(txHash: string): Promise<IFactValue<number[]>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setBytes');

    let value: number[] = [];
    const hexValue = methodInfo.params[1].value;
    if (hexValue) {
      value = this.web3.utils.hexToBytes(hexValue);
    }

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value,
    };
  }

  /**
   * Read address type fact from transaction
   */
  public async getAddress(txHash: string): Promise<IFactValue<string>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setAddress');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value,
    };
  }

  /**
   * Read uint type fact from transaction
   */
  public async getUint(txHash: string): Promise<IFactValue<number>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setUint');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: parseInt(methodInfo.params[1].value, 10),
    };
  }

  /**
   * Read int type fact from transaction
   */
  public async getInt(txHash: string): Promise<IFactValue<number>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setInt');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: parseInt(methodInfo.params[1].value, 10),
    };
  }

  /**
   * Read boolean type fact from transaction
   */
  public async getBool(txHash: string): Promise<IFactValue<boolean>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setBool');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: methodInfo.params[1].value as any,
    };
  }

  /**
   * Read TX data type fact from transaction
   */
  public async getTxdata(txHash: string): Promise<IFactValue<number[]>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setTxDataBlockNumber');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
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
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setIPFSHash');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: await ipfs.cat(methodInfo.params[1].value),
    };
  }

  /**
   * Read decrypted private data fact from transaction.
   * Fact value is retrieved by IPFS hash from transaction data and decrypted using passport owner private key.
   *
   * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
   * @param ipfs IPFS client
   */
  public async getPrivateData(txHash: string, passportOwnerPrivateKey: string, ipfs: IIPFSClient): Promise<IFactValue<number[]>> {
    const factData = await this.getPrivateDataHashes(txHash);

    const privateReader = new PrivateFactReader();

    const privateData = await privateReader.getPrivateData(
      factData,
      passportOwnerPrivateKey,
      ipfs);

    const decryptedFactData: IFactValue<number[]> = {
      ...factData,
      value: privateData,
    };

    return decryptedFactData;
  }

  /**
   * Read decrypted private data fact from transaction.
   * Fact value is retrieved by IPFS hash from transaction data and decrypted using secret key.
   *
   * @param secretKey secret key in hex, used for data decryption
   * @param ipfs IPFS client
   */
  public async getPrivateDataUsingSecretKey(txHash: string, secretKey: string, ipfs: IIPFSClient): Promise<IFactValue<number[]>> {
    const factData = await this.getPrivateDataHashes(txHash);

    const privateReader = new PrivateFactReader();

    const privateData = await privateReader.getPrivateDataUsingSecretKey(
      factData.value.dataIpfsHash,
      secretKey,
      ipfs);

    const decryptedFactData: IFactValue<number[]> = {
      ...factData,
      value: privateData,
    };

    return decryptedFactData;
  }

  /**
   * Read private data hashes fact from transaction
   */
  public async getPrivateDataHashes(txHash: string): Promise<IFactValue<IPrivateDataHashes>> {
    const txInfo = await getDecodedTx(txHash, this.web3, this.options);
    const { methodInfo } = txInfo;

    this.validateMethodSignature(methodInfo, 'setPrivateDataHashes');

    return {
      factProviderAddress: txInfo.tx.from,
      passportAddress: txInfo.tx.to,
      key: hexToUnpaddedAscii(methodInfo.params[0].value),
      value: {
        dataIpfsHash: methodInfo.params[1].value,
        dataKeyHash: methodInfo.params[2].value,
      },
    };
  }

  private validateMethodSignature(methodInfo: IMethodInfo, expectedName: string) {
    if (methodInfo.name !== expectedName) {
      throw createSdkError(ErrorCode.MethodSignatureInvalid,
        `Input method signature for transaction must be "${expectedName}". Got "${methodInfo.name}"`);
    }
  }
}
