import abi from '../../config/abis';
import Web4 from '../transactionHelpers/Web4';
import fetchEvents from '../providers/fetchEvents';
import getTxData from '../providers/getTrxData';


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

//Class to read facts from the passport for factReader
//FactReader(passportAddress)
export class FactReader {
  contractInstance: any;
  web4: any;
  url: string;
  contractAddress: string;

  constructor(network: string) {
    this.web4 = new Web4(network).web4;
    this.url = network;
  }

  setContract(atAddress: string) {
    const contract = this.web4.eth.contract(abi.PassportLogic.abi)
    this.contractInstance = contract.at(atAddress)
    this.contractAddress = atAddress
  }
  //method to read string type from passport
  //getString(factProvider address who wrote the fact, key on which the string is stored)
  async getString(factProviderAddress: string, key: string): Promise<IReturnString> {
    let contractArguments = []
    let result: IReturnString = {"res": null, "err": null};
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getString", contractArguments)
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
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getBytes", contractArguments)
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
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getAddress", contractArguments)
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
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getUint", contractArguments)
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
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getInt", contractArguments)
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
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getBool", contractArguments)
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
  async getTxDataBlockNumber(factProviderAddress: string, key: string): Promise<IReturnString> {
    let result: IReturnString = {"res": null, "err": null};
    let contractArguments = []
    key = this.web4.fromAscii(key);
    contractArguments.push(factProviderAddress);
    contractArguments.push(key);
    let txResult: any;
    
    try {
      txResult = await this.getDataFromSmartContract("getTxDataBlockNumber", contractArguments)
    } catch (err) {
      throw new Error(err);
    }    
    
    if(txResult[0]) {
      const blockNumHex = this.web4.toHex(txResult[1]);
      const events = await fetchEvents(blockNumHex, blockNumHex, this.contractAddress, this.url);
      const txBlock = await getTxData(events[0].transactionHash, this.web4);
      const txDataString = txBlock.params[1].value;
      const txData= this.web4.toAscii(txDataString);
      result.res = txData;
    }
    return result;
  }

  async getDataFromSmartContract(
    contractFunctionName,
    contractArguments) {
    return new Promise((resolve, reject) => {
      contractArguments = contractArguments || []
      this.contractInstance[contractFunctionName].call(...contractArguments, { from: "" }, function (err, data) {
        if (err) {
          const error = 'DID not registered'
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}

export default FactReader;