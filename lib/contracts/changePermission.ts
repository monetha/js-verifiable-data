import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';
import abi from '../../config/abis';


interface IReturn {
  "res": Boolean;
  "err": any;
}

export class Permissions {
  contract: any;

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }
  async addFactProviderToWhitelist(factProvider: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    try {
      trxHash = await performAsync(this.contract.addFactProviderToWhitelist.bind(null, factProvider));
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

  async isFactProviderInWhitelist(factProvider: string): Promise<IReturn> {
    let result: any;
    let txResult: IReturn = {"res": true, "err": null};
    try {
      result = await performAsync(this.contract.isFactProviderInWhitelist.bind(null, factProvider));
    } catch (err) {
      txResult.res = null;
      txResult.err = err;
      return err;
    }
    txResult.res = result;
    return txResult;
  };
  
  async isWhitelistOnlyPermissionSet(): Promise<IReturn> {
    let result: any;
    let txResult: IReturn = {"res": true, "err": null};
    try {
      result = await performAsync(this.contract.isWhitelistOnlyPermissionSet.bind(null));
    } catch (err) {
      txResult.res = null;
      txResult.err = err;
      return err;
    }
    txResult.res = result;
    return txResult;
  };
  
  async isAllowedFactProvider(factProvider: string): Promise<IReturn> {
    let result: any;
    let txResult: IReturn = {"res": true, "err": null};
    try {
      result = await performAsync(this.contract.isAllowedFactProvider.bind(null, factProvider));
    } catch (err) {
      txResult.res = null;
      txResult.err = err;
      return err;
    }
    txResult.res = result;
    return txResult;
  };
  
  async removeFactProviderFromWhitelist(factProvider: string): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    try {
      trxHash = await performAsync(this.contract.removeFactProviderFromWhitelist.bind(null, factProvider));
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
  };
  
  async changePermission(value: Boolean): Promise<IReturn> {
    let trxHash: any;
    let result: IReturn = {"res": true, "err": null};
    try {
      trxHash = await performAsync(this.contract.setWhitelistOnlyPermission.bind(null, value));
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
  
}

export default Permissions;