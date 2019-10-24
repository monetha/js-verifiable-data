import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic';
import { prepareTxConfig } from 'lib/utils/tx';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { initPassportLogicContract } from './rawContracts';
import { IWeb3 } from 'lib/models/IWeb3';

/**
 * Class to change and check permissions for fact providers to any specific passport
 */
export class Permissions {
  private contract: PassportLogic;
  private web3: Web3;

  constructor(anyWeb3: IWeb3, passportAddress: Address) {
    this.web3 = new Web3(anyWeb3.eth.currentProvider);
    this.contract = initPassportLogicContract(anyWeb3, passportAddress);
  }

  /**
   * Adds factProvider to whitelist
   */
  public async addFactProviderToWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    const txData = this.contract.methods.addFactProviderToWhitelist(factProviderAddress);

    return prepareTxConfig(this.web3, passportOwnerAddress, this.contract.address, txData);
  }

  /**
   * Removes fact provider from whitelist
   */
  public async removeFactProviderFromWhitelist(factProviderAddress: Address, passportOwnerAddress: Address) {
    const txData = this.contract.methods.removeFactProviderFromWhitelist(factProviderAddress);

    return prepareTxConfig(this.web3, passportOwnerAddress, this.contract.address, txData);
  }

  /**
   * Checks if fact provider is whitelisted
   */
  public async isFactProviderInWhitelist(factProviderAddress: Address) {
    return this.contract.methods.isFactProviderInWhitelist(factProviderAddress).call();
  }

  /**
   * Checks if whitelist only permission is set, meaning that only whitelisted fact
   * providers could write to this passport
   */
  public async isWhitelistOnlyPermissionSet() {
    return this.contract.methods.isWhitelistOnlyPermissionSet().call();
  }

  /**
   * Checks if fact provider is allowed to write facts to this passport
   */
  public async isAllowedFactProvider(factProviderAddress: Address) {
    return this.contract.methods.isAllowedFactProvider(factProviderAddress).call();
  }

  /**
   * Sets permission for passport whether only whitelisted fact providers could write facts to it
   */
  public async setWhitelistOnlyPermission(onlyWhitelistedProviders: boolean, passportOwnerAddress: Address) {
    const txData = this.contract.methods.setWhitelistOnlyPermission(onlyWhitelistedProviders);

    return prepareTxConfig(this.web3, passportOwnerAddress, this.contract.address, txData);
  }
}
