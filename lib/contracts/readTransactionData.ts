import * as abiDecoder from 'abi-decoder';
import abi from '../../config/abis';
import Ethereum from '../transactionHelpers/Ethereum';


//Class to read the data of transactions related to passort contracts
export class FetchEvents {
  abiDecoder: any;
  contract: any

  constructor(network: string) {
    // this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
    // this.abiDecoder = abiDecoder.addABI(abi.PassportLogic.abi);
  }

  //method to return the transaction data using the transaction hash
  async getTrxData(trxHash: string): Promise<any> {
  //   let result: any;
  //   try {
  //     result = await this.contract.web3.eth.getTransaction.bind(null, trxHash);
  //   } catch(err) {
  //     return err;
  //   }
  //   result = this.abiDecoder.decodeMethod(result.input);
  //   return result;
  } 
}

export default FetchEvents;