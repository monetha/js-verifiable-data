import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';
import abi from '../../config/abis';


interface IReturn {
  "res": Boolean;
  "err": any;
}

// Class to change and check permissions for factProviders to any specific passport
// constructor(passportAddress)
export class Permissions {
  contract: any;

  constructor(atAddress: string) {
    this.contract = createInstance(abi.PassportLogic.abi, atAddress);
  }

  //method to add factProvider to whitelist
  //addFactProviderToWhitelist(factProvider Address)

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

  //method to check if factProvider is in whitelist
  //isFactProviderInWhitelist(factProvider Address)
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
  
  //method to check if whitelist permission is set.
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
  
  //method to check if factProvider is in whitelist
  //isFactProviderInWhitelist(factProvider Address)
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
  
  //method to remove factProvider to whitelist
  //removeFactProviderFromWhitelist(factProvider Address)

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
  
  //method to change permission of writing fats to passport
  //changePermission(true/false)

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