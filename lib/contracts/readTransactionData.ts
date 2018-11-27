import * as abiDecoder from 'abi-decoder';
import performAsync from '../providers/performAsync';
import abi from '../../config/abis';


const globalWindow: any = window;

//Class to read the data of transactions related to passort contracts
export class TransactionReader {
  abiDecoder: any;

  constructor() {
    this.abiDecoder = abiDecoder.addABI(abi.PassportLogic.abi);
  }

  //method to return the transaction data using the transaction hash
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