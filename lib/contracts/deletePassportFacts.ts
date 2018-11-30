import Ethereum from '../transactionHelpers/Ethereum';
import loader from '../providers/loader';
import abi from '../../config/abis';

interface IReturn {
  "res": Boolean;
  "err": any;
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
  async deleteString(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteString", contractArguments, privateKey)
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

  //method to delete Bytes type from passport
  //deleteBytes(key on which the Bytes is stored)
  async deleteBytes(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteBytes", contractArguments, privateKey)
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

  //method to delete Address type from passport
  //deleteAddress(key on which the address is stored)
  async deleteAddress(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteAddress", contractArguments, privateKey)
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

  //method to delete uint type from passport
  //deleteUint(key on which the uint is stored)
  async deleteUint(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteUint", contractArguments, privateKey)
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

  //method to delete int type from passport
  //deleteInt(key on which the int is stored)
  async deleteInt(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteInt", contractArguments, privateKey)
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

  //method to delete bool type from passport
  //deleteBool(key on which the bool is stored)
  async deleteBool(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteBool", contractArguments, privateKey)
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

  //method to delete big data type from passport
  //deleteTxdata(key on which the bigdata is stored)
  async deleteTxdata(key: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    let result: IReturn = {"res": true, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(key);
    
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("deleteTxdata", contractArguments, privateKey)
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

export default FactRemover;