import Ethereum from '../transactionHelpers/Ethereum';
import loader from '../providers/loader';
import abi from '../../config/abis';

interface IReturn {
  "res": Boolean;
  "err": any;
}

//Class to wirte facts to a particular passport for FactWriter
export class FactWriter {
  contract: any;

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to write string type from passport
  //setString(key on which the string is to be stored, value)
  async setString(key: string, value: string, privateKey: string): Promise<IReturn> {

    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setString", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write bytes type from passport
  //setBytes(key on which the bytes is to be stored, value)
  async setBytes(key: string, value: Array<Number>, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setBytes", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write address type from passport
  //setAddress(key on which the address is to be stored, value)
  async setAddress(key: string, value: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setAddress", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write uint type from passport
  //setUint(key on which the uint is to be stored, value)
  async setUint(key: string, value: Number, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setUint", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write int type from passport
  //setInt(key on which the int is to be stored, value)
  async setInt(key: string, value: Number, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setInt", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write bool type from passport
  //setBool(key on which the bool is to be stored, value)
  async setBool(key: string, value: Boolean, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setBool", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }

  //method to write big data type from passport
  //setTxdata(key on which the big data is to be stored, value)
  async setTxdata(key: string, value:  Array<Number>, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    contractArguments.push(value);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setTxdata", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      return err;
    }

    const txResult = await loader(trxHash);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }
}

export default FactWriter;