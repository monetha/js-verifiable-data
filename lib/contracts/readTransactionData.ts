import * as abiDecoder from 'abi-decoder';
import performAsync from '../providers/performAsync';
import abi from '../../config/abis';


const globalWindow: any = window;

export class TransactionReader {
  abiDecoder: any;

  constructor() {
    this.abiDecoder = abiDecoder.addABI(abi.PassportLogic.abi);
  }

  async getTrxData(trxHash: string): Promise<any> {
    let result: any;
    try {
      result = await performAsync(globalWindow.web3.eth.getTransaction.bind(null, trxHash));
    } catch(err) {
      return err;
    }
    result = abiDecoder.decodeMethod(result.input);
    return result;
  } 
}

export default TransactionReader;