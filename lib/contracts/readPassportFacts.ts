import Ethereum from '../transactionHelpers/Ethereum';
import performAsync from '../providers/performAsync';
import abi from '../../config/abis';

interface IReturnString {
  "res": string;
  "err": any;
}
interface IReturnNumber {
  "res": Number;
  "err": any;
}
interface IReturnBool {
  "res": Boolean;
  "err": any;
}
interface IReturnBytes {
  "res": Array<Number>;
  "err": any;
}
const globalWindow: any = window;

//Class to read facts from the passport for factReader
//FactReader(passportAddress)
export class FactReader {
  contract: any;

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to read string type from passport
  //getString(factProvider address who wrote the fact, key on which the string is stored)
  async getString(factProviderAddress: string, key: string): Promise<IReturnString> {
    let contractArguments = []
    let result: IReturnString = {"res": null, "err": null};
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getString", contractArguments)
    } catch (err) {
      return err;
    }    

    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read bytes type from passport
  //getBytes(factProvider address who wrote the fact, key on which the bytes is stored)
  async getBytes(factProviderAddress: string, key: string): Promise<IReturnBytes> {
    let result: IReturnBytes = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getBytes", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read address type from passport
  //getAddress(factProvider address who wrote the fact, key on which the address is stored)
  async getAddress(factProviderAddress: string, key: string): Promise<IReturnString> {
    let result: IReturnString = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getAddress", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read uint type from passport
  //getUint(factProvider address who wrote the fact, key on which the uint is stored)
  async getUint(factProviderAddress: string, key: string): Promise<IReturnNumber> {
    let result: IReturnNumber = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getUint", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read int type from passport
  //getInt(factProvider address who wrote the fact, key on which the int is stored)
  async getInt(factProviderAddress: string, key: string): Promise<IReturnNumber> {
    let result: IReturnNumber = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getInt", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read bool type from passport
  //getBool(factProvider address who wrote the fact, key on which the bool is stored)
  async getBool(factProviderAddress: string, key: string): Promise<IReturnBool> {
    let result: IReturnBool = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getBool", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }

  //method to read bytes type from passport
  //getTxDataBlockNumber(factProvider address who wrote the fact, key on which the bytes is stored)
  async getTxDataBlockNumber(factProviderAddress: string, key: string): Promise<IReturnBytes> {
    let result: IReturnBytes = {"res": null, "err": null};
    let contractArguments = []
    key = this.contract.web3.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = this.contract.getDataFromSmartContract("getTxDataBlockNumber", contractArguments)
    } catch (err) {
      return err;
    }    
    
    if(txResult[0]) {
      result.res = txResult[1];
    }
    return result;
  }
}

export default FactReader;