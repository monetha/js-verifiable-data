import { ContractIO } from '../transactionHelpers/ContractIO';
import abi from '../../config/abis';
import { Address } from '../models/Address';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

/**
 * Class to change passport ownership
 */
export class PassportOwnership {
  private contract: ContractIO;

  constructor(web3: Web3, passportAddress: Address) {
    this.contract = new ContractIO(web3, abi.PassportLogic.abi as AbiItem[], passportAddress);
  }

  /**
   * After the passport is created, the owner must call this method to become a full passport owner
   */
  public async claimOwnership(passportOwnerAddress: Address) {
    return this.contract.prepareCallTX('claimOwnership', [], passportOwnerAddress);
  }

  /**
   * Returns passport owner address
   */
  public async getOwnerAddress(): Promise<string> {
    return this.contract.readData('owner', []) as any;
  }
}
