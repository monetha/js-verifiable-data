import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';
import abi from '../../config/abis';

interface IReturn {
  "res": Boolean;
  "err": any;
}
const globalWindow: any = window;

export class FactRemover {
  contract: any;

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }

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