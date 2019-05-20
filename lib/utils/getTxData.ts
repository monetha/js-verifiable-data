import * as abiDecoder from 'abi-decoder';
import Web3 from 'web3';
import passportLogicAbi from '../../config/PassportLogic.json';

/**
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export const getTxData = async (txHash: string, web3: Web3): Promise<any> => {
  abiDecoder.addABI(passportLogicAbi);

  const tx = await web3.eth.getTransaction(txHash);

  return abiDecoder.decodeMethod(tx.input);
};
