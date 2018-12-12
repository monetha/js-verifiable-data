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
//Class to delete facts for the FactRemover
// FactRemover (passportAddress)
export class FactRemover {
  contract: any;

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to delete string type from passport
  //deleteString(key on which the string is stored)
  async deleteString(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteString", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete Bytes type from passport
  //deleteBytes(key on which the Bytes is stored)
  async deleteBytes(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteBytes", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete Address type from passport
  //deleteAddress(key on which the address is stored)
  async deleteAddress(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteAddress", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete uint type from passport
  //deleteUint(key on which the uint is stored)
  async deleteUint(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteUint", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete int type from passport
  //deleteInt(key on which the int is stored)
  async deleteInt(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteInt", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete bool type from passport
  //deleteBool(key on which the bool is stored)
  async deleteBool(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteBool", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }

  //method to delete big data type from passport
  //deleteTxdata(key on which the bigdata is stored)
  async deleteTxdata(key: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web4.fromAscii(key);
    contractArguments.push(key);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("deleteTxdata", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }


  }
}

export default FactRemover;