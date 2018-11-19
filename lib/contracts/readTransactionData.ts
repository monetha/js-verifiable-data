import * as abiDecoder from 'abi-decoder';
import performAsync from '../providers/performAsync';

var globalWindow: any = window;
var readTransactionData = async function (testABI: any, trxHash: string) {

  abiDecoder.addABI(testABI);
  var result: any;
  try {
    result = await performAsync(globalWindow.web3.eth.getTransaction.bind(null, trxHash));
  } catch(err) {
    return err;
  }
  result  = abiDecoder.decodeMethod(result.input);

  return result;
}

export default readTransactionData;