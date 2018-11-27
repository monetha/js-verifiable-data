import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';
import abi from '../../config/abis';

interface IReturn {
  "res": Boolean;
  "err": any;
}
const globalWindow: any = window;

//Class to wirte facts to a particular passport for FactWriter
export class FactWriter {
  contract: any;

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }

  //method to write string type from passport
  //setString(key on which the string is to be stored, value)
  async setString(key: string, value: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setString.bind(null, key, value));
    } catch (err) {
      result.res = false;
      result.err = err;
      return result;
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
  async setBytes(key: string, value: Array<Number>): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setBytes.bind(null, key, value));
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
  async setAddress(key: string, value: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setAddress.bind(null, key, value));
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
  async setUint(key: string, value: Number): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setUint.bind(null, key, value));
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
  async setInt(key: string, value: Number): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setInt.bind(null, key, value));
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
  async setBool(key: string, value: Boolean): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setBool.bind(null, key, value));
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
  async setTxdata(key: string, value:  Array<Number>): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.setTxDataBlockNumber.bind(null, key, value));
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