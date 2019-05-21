import * as abiDecoder from 'abi-decoder';
import Web3 from 'web3';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Transaction } from 'web3-core';

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
