import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';


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
  "res": ByteLengthChunk;
  "err": any;
}
const globalWindow: any = window;

export class readPassportFacts {
  contract: any;

  constructor(abi: any, atAddress?: string) {
    this.contract = createInstance(abi, atAddress);
  }

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

export default readPassportFacts;