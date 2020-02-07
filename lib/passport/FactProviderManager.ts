import { Address } from 'lib/models/Address';
import { FactProviderRegistry } from 'lib/types/web3-contracts/FactProviderRegistry';
import { prepareMethod } from 'lib/utils/tx';
import Web3 from 'web3';
import { initFactProviderRegistryContract } from './rawContracts';
import { IWeb3 } from 'lib/models/IWeb3';

// #region -------------- Interface -------------------------------------------------------------------

export interface IFactProviderInfo {

  /**
   * Fact provider's display name
   */
  name: string;

  /**
   * Fact provider's website
   */
  website?: string;

  /**
   * Fact provider's passport
   */
  passport?: Address;
}

// #endregion

// #region -------------- Constants -------------------------------------------------------------------

const emptyAddress = '0x0000000000000000000000000000000000000000';

// #endregion

/**
 * Class to access and manage fact provider registry.
 * Allows managing info about fact providers.
 */
export class FactProviderManager {
  private contract: FactProviderRegistry;
  private web3: Web3;

  constructor(anyWeb3: IWeb3, factProviderRegistryAddress: Address) {
    this.web3 = new Web3(anyWeb3.eth.currentProvider);
    this.contract = initFactProviderRegistryContract(anyWeb3, factProviderRegistryAddress);
  }

  /**
   * Sets information about fact provider
   *
   * @param factProviderAddress - fact provider's address
   * @param info - information about fact provider
   * @param registryOwner - address of fact provider registry owner
   */
  public setInfo(factProviderAddress: Address, info: IFactProviderInfo, registryOwner: Address) {
    const txObj = this.contract.methods.setFactProviderInfo(
      factProviderAddress,
      info.name,
      info.passport || emptyAddress,
      info.website || '',
    );

    return prepareMethod(this.web3, registryOwner, this.contract.address, txObj);
  }

  /**
   * Deletes information about fact provider
   *
   * @param factProviderAddress - fact provider's address
   * @param registryOwner - address of fact provider registry owner
   */
  public deleteInfo(factProviderAddress: Address, registryOwner: Address) {
    const txObj = this.contract.methods.deleteFactProviderInfo(factProviderAddress);

    return prepareMethod(this.web3, registryOwner, this.contract.address, txObj);
  }

  /**
   * Gets information about fact provider.
   * Returns null promise if no information was entered or it was deleted
   *
   * @param factProviderAddress - fact provider's address
   */
  public async getInfo(factProviderAddress: Address): Promise<IFactProviderInfo> {
    const result = await this.contract.methods.factProviders(factProviderAddress).call();

    if (!result || !result.initialized) {
      return null;
    }

    const info: IFactProviderInfo = {
      name: result.name,
    };

    if (result.website) {
      info.website = result.website;
    }

    if (result.reputation_passport && result.reputation_passport !== emptyAddress) {
      info.passport = result.reputation_passport;
    }

    return info;
  }
}
