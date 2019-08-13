import * as abiDecoder from 'abi-decoder';
import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import { createSdkError } from 'lib/errors/SdkError';
import { Address } from 'lib/models/Address';
import { IEthOptions } from 'lib/models/IEthOptions';
import { ErrorCode } from 'lib/proto';
import { TransactionObject } from 'lib/types/web3-contracts/types';
import Web3 from 'web3';
import { RLPEncodedTransaction, Transaction, TransactionConfig } from 'web3-core';
import passportLogicAbi from '../../config/PassportLogic.json';

export interface IMethodInfo {
  name: string;
  params: IMethodParam[];
}

export interface IMethodParam {
  name: string;
  type: string;
  value: string;
}

export interface ITxData {
  tx: Transaction;
  methodInfo: IMethodInfo;
}

/**
 * Gets transaction by hash and recovers its sender public key
 */
export const getDecodedTx = async (txHash: string, web3: Web3, options?: IEthOptions) => {
  let tx: Transaction;
  let senderPublicKey: Buffer;

  if (options && options.txRetriever) {
    const retrievedTx = await options.txRetriever(txHash, web3);

    if (retrievedTx) {
      if (!retrievedTx.senderPublicKey) {
        throw createSdkError(ErrorCode.MissingSenderPublicKey, 'Specified txRetriever did not return required senderPublicKey property');
      }

      senderPublicKey = retrievedTx.senderPublicKey;
      tx = retrievedTx.tx;
    }
  } else {
    tx = await web3.eth.getTransaction(txHash);

    if (tx) {
      senderPublicKey = getSenderPublicKey(tx as any);
    }
  }

  if (!tx) {
    throw createSdkError(ErrorCode.TxNotFound, 'Transaction was not found');
  }

  abiDecoder.addABI(passportLogicAbi);

  const result = {
    tx,
    methodInfo: abiDecoder.decodeMethod(tx.input),
    senderPublicKey,
  };

  return result;
};

/**
 * Gets sender's elliptic curve public key (prefixed with byte 4)
 */
export const getSenderPublicKey = (tx: RLPEncodedTransaction['tx']) => {

  const ethTx = new EthTx({
    nonce: tx.nonce,
    gasPrice: ethUtil.bufferToHex(new BN(tx.gasPrice).toBuffer()),
    gasLimit: tx.gas,
    to: tx.to,
    value: ethUtil.bufferToHex(new BN(tx.value).toBuffer()),
    data: tx.input,
    r: (tx as any).r,
    s: (tx as any).s,
    v: (tx as any).v,
  });

  // To be a valid EC public key - it must be prefixed with byte 4
  return Buffer.concat([Buffer.from([4]), ethTx.getSenderPublicKey()]);
};

/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export const prepareTxConfig = async <TData>(
  web3: Web3,
  from: Address,
  to: Address,
  data: TransactionObject<TData>,
  value: number | BN = 0,
  gasLimit?: number,
): Promise<TransactionConfig> => {
  const nonce = await web3.eth.getTransactionCount(from);
  const gasPrice = await web3.eth.getGasPrice();
  const actualGasLimit = (gasLimit > 0 || gasLimit === 0) ?
    gasLimit :
    await web3.eth.estimateGas({
      data: data.encodeABI(),
      from,
      to,
      value,
    });

  return {
    from,
    to,
    nonce,
    gasPrice,
    gas: actualGasLimit,
    value,
    data: data.encodeABI(),
  };
};
