import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export class Permissions {
  private contract: ContractIO;

  constructor(web3, passportAddress: Address) {
    this.contract = new ContractIO(web3, abi.PassportLogic.abi, passportAddress);
  }

  /**
   * Adds factProvider to whitelist
   */
  public async addFactProviderToWhitelist(factProvider: Address, factProviderAddress: Address) {
    return this.contract.prepareCallTX('addFactProviderToWhitelist', [factProvider], factProviderAddress);
  }

  /**
   * Checks if fact provider is whitelisted
   */
  public async isFactProviderInWhitelist(factProvider: Address) {
    return this.contract.readData('isFactProviderInWhitelist', [factProvider]);
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
  public async isAllowedFactProvider(factProvider: Address) {
    return this.contract.readData('isAllowedFactProvider', [factProvider]);
  }

  /**
   * Removes fact provider from whitelist
   */
  public async removeFactProviderFromWhitelist(factProvider: Address, factProviderAddress: Address) {
    return this.contract.prepareCallTX('removeFactProviderFromWhitelist', [factProvider], factProviderAddress);
  }

  /**
   * Sets permission for passport whether only whitelisted fact providers could write facts to it
   */
  public async setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, factProviderAddress: Address) {
    return this.contract.prepareCallTX('setWhitelistOnlyPermission', [onlyWhitelistedProviders], factProviderAddress);
  }
}
