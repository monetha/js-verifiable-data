import * as abiDecoder from 'abi-decoder';
import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
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

  const msgHash = ethTx.hash();
  const chainId: number = ethTx.getChainId() as any;

  let v = ethUtil.bufferToInt(ethTx.v);
  if (chainId > 0) {
    v -= chainId * 2 + 8;
  }

  const signature = Buffer.concat([ethUtil.setLengthLeft(ethTx.r, 32) as Uint8Array, ethUtil.setLengthLeft(ethTx.s, 32) as Uint8Array], 64);

  const recovery = v - 27;
  if (recovery !== 0 && recovery !== 1) {
    throw new Error('Invalid signature v value');
  }

  const senderPubKey = secp256k1.recover(msgHash, signature, recovery);
  return secp256k1.publicKeyConvert(senderPubKey, false);
};
