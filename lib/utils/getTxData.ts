import * as abiDecoder from 'abi-decoder';
import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import Web3 from 'web3';
import { RLPEncodedTransaction, Transaction } from 'web3-core';
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
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export const getTxData = async (txHash: string, web3: Web3): Promise<ITxData> => {
  abiDecoder.addABI(passportLogicAbi);

  const tx = await web3.eth.getTransaction(txHash);

  const result = {
    tx,
    methodInfo: abiDecoder.decodeMethod(tx.input),
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
