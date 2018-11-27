import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

interface IReturn {
  "res": Boolean;
  "err": any;
}
const globalWindow: any = window;

export class writePassportFacts {
  contract: any;

  constructor(abi: any, atAddress?: string) {
    this.contract = createInstance(abi, atAddress);
  }

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

  async setBytes(key: string, value: ByteLengthChunk): Promise<IReturn> {
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

  async setTxdata(key: string, value: ByteLengthChunk): Promise<IReturn> {
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

export default writePassportFacts;