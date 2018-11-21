import * as abiDecoder from 'abi-decoder';
import performAsync from '../providers/performAsync';

const globalWindow: any = window;
const readTransactionData = async function (abi: any, trxHash: string) {

  abiDecoder.addABI(abi);
  let result: any;
  try {
    result = await performAsync(globalWindow.web3.eth.getTransaction.bind(null, trxHash));
  } catch(err) {
    return err;
  }
  result  = abiDecoder.decodeMethod(result.input);

  return result;
}

export default readTransactionData;