import Ethereum from '../transactionHelpers/Ethereum';
import abi from '../../config/abis';


interface IReturnWrite {
  from: string;
  nonce: Number;
  gasPrice: string;
  gasLimit: Number;
  to: string;
  value: Number;
  data: string;
}


export class PassportGenerator {
  contract: any;

  constructor(network: string, passportFactoryAddress: string) {
    this.contract = new Ethereum(abi.PassportFactory.abi, passportFactoryAddress, network);
  }

  //method to return the create an empty passport and return the passport Address
  async createPassport(userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("createPassport", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }
  }
}
  export default PassportGenerator;
