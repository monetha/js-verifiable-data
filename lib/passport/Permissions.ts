import { Contract, formatBytes32String } from '@harmony-js/contract';
import { Address } from '../models/Address';
import { initPassportLogicContract } from './rawContracts';
import { Harmony } from '@harmony-js/core';
import { configureSendMethod, callMethod } from 'lib/utils/tx';

/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export class Permissions {
  private passportAddress: Address;
  private harmony: Harmony;

  constructor(harmony: Harmony, passportAddress: Address) {
    this.harmony = harmony;
    this.passportAddress = passportAddress;
  }

  private getContract(): Contract {
    return initPassportLogicContract(this.harmony, this.passportAddress);
  }

  /**
   * Adds factProvider to whitelist
   */
  public async addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    const method = this.getContract().methods.addFactProviderToWhitelist(factProviderAddress);

    return configureSendMethod(this.harmony, method, passportOwnerAddress);
  }

  /**
   * Removes fact provider from whitelist
   */
  public async removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    const method = this.getContract().methods.removeFactProviderFromWhitelist(factProviderAddress);

    return configureSendMethod(this.harmony, method, passportOwnerAddress);
  }

  /**
   * Checks if fact provider is whitelisted
   */
  public async isFactProviderInWhitelist(factProviderAddress: Address) {

    return callMethod(this.getContract().methods.isFactProviderInWhitelist(factProviderAddress));
  }

  /**
   * Checks if whitelist only permission is set, meaning that only whitelisted fact
   * providers could write to this passport
   */
  public async isWhitelistOnlyPermissionSet() {
    return callMethod(this.getContract().methods.isWhitelistOnlyPermissionSet());
  }

  /**
   * Checks if fact provider is allowed to write facts to this passport
   */
  public async isAllowedFactProvider(factProviderAddress: Address) {
    return callMethod(this.getContract().methods.isAllowedFactProvider(factProviderAddress));
  }

  /**
   * Sets permission for passport whether only whitelisted fact providers could write facts to it
   */
  public async setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address) {
    const method = this.getContract().methods.setWhitelistOnlyPermission(onlyWhitelistedProviders);

    return configureSendMethod(this.harmony, method, passportOwnerAddress);
  }
}
