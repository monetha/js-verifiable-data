import Ethereum from '../transactionHelpers/Ethereum';
import abi from '../../config/abis';

interface IReturnWrite {
  from: string;
  nonce: string;
  gasPrice: string;
  gasLimit: Number;
  to: string;
  value: Number;
  data: string;
}


//Class to wirte facts to a particular passport for FactWriter
export class FactWriter {
  contract: any;

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to write string type from passport
  //setString(key on which the string is to be stored, value)
  async setString(key: string, value: string, userAddress: string): Promise<IReturnWrite> {

    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setString", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }

  }

  //method to write bytes type from passport
  //setBytes(key on which the bytes is to be stored, value)
  async setBytes(key: string, value: Array<Number>, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setBytes", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }

  }

  //method to write address type from passport
  //setAddress(key on which the address is to be stored, value)
  async setAddress(key: string, value: string, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setAddress", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }

  }

  //method to write uint type from passport
  //setUint(key on which the uint is to be stored, value)
  async setUint(key: string, value: Number, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setUint", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }

  }

  //method to write int type from passport
  //setInt(key on which the int is to be stored, value)
  async setInt(key: string, value: Number, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setInt", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }

  }

  //method to write bool type from passport
  //setBool(key on which the bool is to be stored, value)
  async setBool(key: string, value: Boolean, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setBool", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }
  }

  //method to write big data type from passport
  //setTxdata(key on which the big data is to be stored, value)
  async setTxdata(key: string, value:  Array<Number>, userAddress: string): Promise<IReturnWrite> {
    let contractArguments = []
    let rawTransaction: IReturnWrite
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);

    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setTxdata", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default FactWriter;