import * as abiDecoder from 'abi-decoder';
import Web3 from 'web3';
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
  txReceipt: any;
  methodInfo: IMethodInfo;
}

/**
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export const getTxData = async (txHash: string, web3: any): Promise<ITxData> => {
  abiDecoder.addABI(passportLogicAbi);

  const txReceipt = await web3.eth.getTransaction(txHash);

  return {
    txReceipt,
    methodInfo: abiDecoder.decodeMethod(txReceipt.input),
  };
};
