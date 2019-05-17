import * as abiDecoder from 'abi-decoder';
import abi from '../../config/abis';
import Web3 from 'web3';

/**
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export const getTxData = async (txHash: string, web3: Web3): Promise<any> => {
  abiDecoder.addABI(abi.PassportLogic.abi);

  const tx = await web3.eth.getTransaction(txHash);

  return abiDecoder.decodeMethod(tx.input);
};
