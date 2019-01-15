import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';

/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export class Permissions {
  private contract: ContractIO;

  constructor(passportAddress: Address, network: string) {
    this.contract = new ContractIO(abi.PassportLogic.abi, passportAddress, network);
  }

  /**
   * Adds factProvider to whitelist
   */
  public async addFactProviderToWhitelist(factProvider: Address, userAddress: Address) {
    return this.contract.prepareCallTX('addFactProviderToWhitelist', [factProvider], userAddress);
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
  public async removeFactProviderFromWhitelist(factProvider: Address, userAddress: Address) {
    return this.contract.prepareCallTX('removeFactProviderFromWhitelist', [factProvider], userAddress);
  }

  /**
   * Sets permission for passport whether only whitelisted fact providers could write facts to it
   */
  public async setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, userAddress: Address) {
    return this.contract.prepareCallTX('setWhitelistOnlyPermission', [onlyWhitelistedProviders], userAddress);
  }
}
