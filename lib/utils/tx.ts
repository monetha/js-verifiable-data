import { ContractMethod } from '@harmony-js/contract/dist/methods/method';
import { Harmony } from '@harmony-js/core';
import * as crypto from '@harmony-js/crypto';
import * as abiDecoder from 'abi-decoder';
import BN from 'bn.js';
import elliptic from 'elliptic';
import { createSdkError } from 'lib/errors/SdkError';
import { IConfiguredContractMethod, ITxConfig } from 'lib/models/Method';
import { ErrorCode } from 'lib/proto';
import passportLogicAbi from '../../config/PassportLogic.json';

const secp256k1 = elliptic.ec('secp256k1');

export interface IMethodInfo {
  name: string;
  params: IMethodParam[];
}

export interface IMethodParam {
  name: string;
  type: string;
  value: string;
}

/**
 * Gets transaction by hash and recovers its sender public key
 */
export const getDecodedTx = async (harmony: Harmony, txHash: string) => {

  const tx = (await harmony.blockchain.getTransactionByHash({ txnHash: txHash })).result;
  if (!tx) {
    throw createSdkError(ErrorCode.TxNotFound, 'Transaction was not found');
  }

  const senderPublicKey = getSenderPublicKey(harmony, tx);

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
export const getSenderPublicKey = (harmony: Harmony, tx) => {

  const signature = {
    r: tx.r,
    v: tx.v,
    s: tx.s,
  };

  const hmyTx = harmony.transactions.newTx({
    from: tx.from,
    nonce: tx.nonce,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gas,
    shardID: tx.shardID,
    to: tx.to,
    value: tx.value,
    data: tx.input,
    signature,
  });

  const txSignature = hmyTx.txParams.signature;
  const chainId = hmyTx.txParams.chainId;

  const [_, unsignedArr] = hmyTx.getRLPUnsigned();

  // Strip r, s, v
  const rawTxNoSig = unsignedArr.slice(0, 8);

  let recoveryParam = txSignature.v - 27;

  if (chainId !== 0) {
    rawTxNoSig.push(crypto.hexlify(chainId));
    rawTxNoSig.push('0x');
    rawTxNoSig.push('0x');
    recoveryParam -= chainId * 2 + 8;
  }

  const digest = crypto.keccak256(crypto.encode(rawTxNoSig));

  const splittedSig = crypto.splitSignature({
    r: signature.r,
    s: signature.s,
    recoveryParam,
  });
  const rs = { r: crypto.arrayify(splittedSig.r), s: crypto.arrayify(splittedSig.s) };
  const recovered = secp256k1.recoverPubKey(crypto.arrayify(digest), rs, splittedSig.recoveryParam);

  const key = recovered.encode('hex', false);
  const ecKey = secp256k1.keyFromPublic(key, 'hex');
  const publicKey = ecKey.getPublic(false, 'hex');

  return Buffer.from(publicKey, 'hex');
};

/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export const configureSendMethod = async (
  harmony: Harmony,
  method: ContractMethod,
  from: string,
  params?: ITxConfig,
): Promise<IConfiguredContractMethod> => {
  const txConfig: ITxConfig = { ...(params || {}) };

  txConfig.from = from;

  // TODO: Handle nonce internally (maybe it is already handled by contract object?)
  // if (!txConfig.nonce) {
  //   txConfig.nonce = (await harmony.blockchain.getTransactionCount({ address: from })).result;
  // }

  if (!txConfig.gasPrice) {
    txConfig.gasPrice = new BN('100000000000'); // (await harmony.blockchain.gasPrice()).result; <-- Always returns 0x1 so just hardcode it
  }

  if (!txConfig.gasLimit) {
    txConfig.gasLimit = new BN('5100000'); // (await method.estimateGas()).result;  <-- NOT IMPLEMENTED IN HARMONY
  }

  return {
    method,
    txConfig,
  };
};

/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export const callMethod = async (method: ContractMethod) => {
  return method.call({
    gasPrice: new BN('100000000000'),
    gasLimit: new BN('5100000'),
  });
};
