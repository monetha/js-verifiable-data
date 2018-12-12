import Ethereum from '../transactionHelpers/Ethereum';
import abi from '../../config/abis';


interface IReturnWrite {
  from: string;
  nonce: string;
  gasPrice: string;
  gasLimit: Number;
  to: string;
  value: Number;
  data: string;
}

interface IReturnRead {
  "res": Boolean;
  "err": any;
}
// Class to change and check permissions for factProviders to any specific passport
// constructor(passportAddress, node url)
export class Permissions {
  contract: any;

  constructor(atAddress: string, network: string) {
    this.contract = new Ethereum(abi.PassportLogic.abi, atAddress, network);
  }

  //method to add factProvider to whitelist
  //addFactProviderToWhitelist(factProvider Address, fromUser Address)

  async addFactProviderToWhitelist(factProvider: string, userAddress: string): Promise<IReturnWrite> {
    let rawTransaction: IReturnWrite
    let contractArguments = []
    contractArguments.push(factProvider);
    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("addFactProviderToWhitelist", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }
  }

  //method to check if factProvider is in whitelist
  //isFactProviderInWhitelist(factProvider Address)
  async isFactProviderInWhitelist(factProvider: string): Promise<IReturnRead> {
    let result: any;
    let txResult: IReturnRead = {"res": true, "err": null};
    try {
      result = await this.contract.getDataFromSmartContract("isFactProviderInWhitelist", [factProvider])
    } catch (err) {
      txResult.res = null;
      txResult.err = err;
      return err;
    }
    txResult.res = result;
    return txResult;
  };
  
  //method to check if whitelist permission is set.
  async isWhitelistOnlyPermissionSet(): Promise<IReturnRead> {
    let result: any;
    let txResult: IReturnRead = {"res": true, "err": null};
    try {
      result = await this.contract.getDataFromSmartContract("isWhitelistOnlyPermissionSet", [])
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
  async isAllowedFactProvider(factProvider: string): Promise<IReturnRead> {
    let result: any;
    let txResult: IReturnRead = {"res": true, "err": null};
    try {
      result = await this.contract.getDataFromSmartContract("isAllowedFactProvider", [factProvider])
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

  async removeFactProviderFromWhitelist(factProvider: string, userAddress: string): Promise<IReturnWrite> {
    let rawTransaction: IReturnWrite
    let contractArguments = []
    contractArguments.push(factProvider);
    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("removeFactProviderFromWhitelist", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }
  };
  
  //method to change permission of writing fats to passport
  //changePermission(true/false)

  async changePermission(value: Boolean, userAddress: string): Promise<IReturnWrite> {
    let rawTransaction: IReturnWrite
    let contractArguments = []
    contractArguments.push(value);
    try {
      rawTransaction = await this.contract.generateRawTransactionForSmartContractInteraction("setWhitelistOnlyPermission", contractArguments, userAddress)
      return rawTransaction
    } catch (err) {
      throw new Error(err)
    }
  }
  
}

export default Permissions;