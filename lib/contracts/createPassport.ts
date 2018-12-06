import Ethereum from '../transactionHelpers/Ethereum';
import loader from '../providers/loader';
import abi from '../../config/abis';


interface IReturn {
  "res": string;
  "err": any;
}

export class PassportGenerator {
  contract: any;

  constructor(network: string) {
    this.contract = new Ethereum(abi.PassportFactory.abi, abi.PassportFactory.at, network);
  }

  //method to return the create an empty passport and return the passport Address
  async createPassport(privateKey: string): Promise<IReturn> {

    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": null, "err": null};

    try {
      signedRawTransaction = await this.contract.generateSignedRawTransactionForSmartContractInteraction("createPassport", contractArguments, privateKey)
      trxHash = await this.contract.web4.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash, this.contract.web4);
    if(txResult.err) {
      result.err = txResult.err;
    } else {
      result.res = txResult.res.logs[0].topics[1];
      result.res = '0x' + result.res.slice(26);
    }

    return result;    
  }
}

export default PassportGenerator;
