import Ethereum from '../transactionHelpers/Ethereum';
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

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to add factProvider to whitelist
  //addFactProviderToWhitelist(factProvider Address)

  async addFactProviderToWhitelist(factProvider: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    contractArguments.push(factProvider);
    let result: IReturn = {"res": true, "err": null};
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("addFactProviderToWhitelist", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      result.res = false;
      result.err = err;
      return result;
    }
    const txResult = await loader(trxHash, this.contract.web3);
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

  async removeFactProviderFromWhitelist(factProvider: string, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    contractArguments.push(factProvider);
    let result: IReturn = {"res": true, "err": null};
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("removeFactProviderFromWhitelist", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      result.res = false;
      result.err = err;
      return result;
    }

    const txResult = await loader(trxHash, this.contract.web3);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  };
  
  //method to change permission of writing fats to passport
  //changePermission(true/false)

  async changePermission(value: Boolean, privateKey: string): Promise<IReturn> {
    let trxHash: any;
    let signedRawTransaction
    let contractArguments = []
    contractArguments.push(value);
    let result: IReturn = {"res": true, "err": null};
    try {
      signedRawTransaction = this.contract.generateSignedRawTransactionForSmartContractInteraction("setWhitelistOnlyPermission", contractArguments, privateKey)
      trxHash = await this.contract.web3.eth.sendRawTransaction(signedRawTransaction);
    } catch (err) {
      result.res = false;
      result.err = err;
      return result;
    }

    const txResult = await loader(trxHash, this.contract.web3);
    if(txResult.err) {
      result.res = false;
      result.err = txResult.err;
    } 
    return result;
  }
  
}

export default Permissions;