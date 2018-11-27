import createInstance from '../providers/createInstance';
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

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }

  //method to read string type from passport
  //getString(factProvider address who wrote the fact, key on which the string is stored)
  async getString(factProviderAddress: string, key: string): Promise<IReturnString> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnString = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getString.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read bytes type from passport
  //getBytes(factProvider address who wrote the fact, key on which the bytes is stored)
  async getBytes(factProviderAddress: string, key: string): Promise<IReturnBytes> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnBytes = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getBytes.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read address type from passport
  //getAddress(factProvider address who wrote the fact, key on which the address is stored)
  async getAddress(factProviderAddress: string, key: string): Promise<IReturnString> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnString = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getAddress.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read uint type from passport
  //getUint(factProvider address who wrote the fact, key on which the uint is stored)
  async getUint(factProviderAddress: string, key: string): Promise<IReturnNumber> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnNumber = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getUint.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read int type from passport
  //getInt(factProvider address who wrote the fact, key on which the int is stored)
  async getInt(factProviderAddress: string, key: string): Promise<IReturnNumber> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnNumber = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getInt.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read bool type from passport
  //getBool(factProvider address who wrote the fact, key on which the bool is stored)
  async getBool(factProviderAddress: string, key: string): Promise<IReturnBool> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnBool = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getBool.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }

  //method to read bytes type from passport
  //getTxDataBlockNumber(factProvider address who wrote the fact, key on which the bytes is stored)
  async getTxDataBlockNumber(factProviderAddress: string, key: string): Promise<IReturnBytes> {
    key = globalWindow.web3.fromAscii(key);
    let result: IReturnBytes = {"res": null, "err": null};
    let txResult: any;
    try {
      txResult = await performAsync(this.contract.getTxDataBlockNumber.bind(null, factProviderAddress, key));
    } catch (err) {
      result.err = err;
      return result;
    }
    result.res = txResult[1];
    return result;
  }
}

export default FactReader;