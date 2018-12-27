import * as abiDecoder from 'abi-decoder';
import abi from '../../config/abis';

//method to return the transaction data using the transaction hash
const getTrxData = async function (trxHash: string, web4: any): Promise<any> {
  abiDecoder.addABI(abi.PassportLogic.abi)
  let result: any;
  try {
    result = await web4.eth.getTransaction(trxHash);
  } catch (err) {
    return err;
  }
  result = abiDecoder.decodeMethod(result.input);
  return result;
}

export default getTrxData;
