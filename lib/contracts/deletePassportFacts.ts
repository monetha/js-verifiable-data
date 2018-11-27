import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';
import abi from '../../config/abis';

interface IReturn {
  "res": Boolean;
  "err": any;
}
const globalWindow: any = window;

//Class to delete facts for the FactRemover
// FactRemover (passportAddress)
export class FactRemover {
  contract: any;

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }

  //method to delete string type from passport
  //deleteString(key on which the string is stored)
  async deleteString(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteString.bind(null, key));
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

  //method to delete Bytes type from passport
  //deleteBytes(key on which the Bytes is stored)
  async deleteBytes(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteBytes.bind(null, key));
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
  async deleteAddress(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteAddress.bind(null, key));
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
  async deleteUint(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteUint.bind(null, key));
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
  async deleteInt(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteInt.bind(null, key));
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
  async deleteBool(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteBool.bind(null, key));
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
  async deleteTxdata(key: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    key = globalWindow.web3.fromAscii(key);
    try {
      trxHash = await performAsync(this.contract.deleteTxDataBlockNumber.bind(null, key));
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