import { ContractIO } from '../transactionHelpers/ContractIO';
import { Address } from '../models/Address';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';

/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export class Permissions {
  private contract: ContractIO;

  constructor(web3: Web3, passportAddress: Address) {
    this.contract = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
  }

  /**
   * Adds factProvider to whitelist
   */
  public async addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    return this.contract.prepareCallTX('addFactProviderToWhitelist', [factProviderAddress], passportOwnerAddress);
  }

  /**
   * Removes fact provider from whitelist
   */
  public async removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    return this.contract.prepareCallTX('removeFactProviderFromWhitelist', [factProviderAddress], passportOwnerAddress);
  }

  /**
   * Checks if fact provider is whitelisted
   */
  public async isFactProviderInWhitelist(factProviderAddress: Address) {
    return this.contract.readData('isFactProviderInWhitelist', [factProviderAddress]);
  }

  /**
   * Checks if whitelist only permission is set
   */
  public async isWhitelistOnlyPermissionSet() {
    return this.contract.readData('isWhitelistOnlyPermissionSet', []);
  }

  /**
   * Checks if factProvider is allowed
   */
  public async isAllowedFactProvider(factProviderAddress: Address) {
    return this.contract.readData('isAllowedFactProvider', [factProviderAddress]);
  }

  /**
   * Sets permission for passport whether only whitelisted fact providers could write facts to it
   */
  public async setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address) {
    return this.contract.prepareCallTX('setWhitelistOnlyPermission', [onlyWhitelistedProviders], passportOwnerAddress);
  }
}
