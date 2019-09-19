import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { IEthOptions } from 'lib/models/IEthOptions';
import Web3 from 'web3';
import { Address } from '../models/Address';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { getDecodedTx, prepareTxConfig } from '../utils/tx';
import { initPassportLogicContract } from './rawContracts';

/**
 * Class to manage passport ownership
 */
export class PassportOwnership {
  private contract: PassportLogic;
  private web3: Web3;
  private options: IEthOptions;

  constructor(web3: Web3, passportAddress: Address, options?: IEthOptions) {
    this.contract = initPassportLogicContract(web3, passportAddress);
    this.web3 = web3;
    this.options = options || {};
  }

  /**
   * After the passport is created, the owner must call this method to become a full passport owner
   */
  public async claimOwnership(passportOwnerAddress: Address) {
    const txData = this.contract.methods.claimOwnership();

    return prepareTxConfig(this.web3, passportOwnerAddress, this.contract.address, txData);
  }

  /**
   * Returns passport owner address
   */
  public async getOwnerAddress(): Promise<string> {
    return this.contract.methods.owner().call();
  }

  /**
   * Returns passport pending owner address
   */
  public async getPendingOwnerAddress(): Promise<string> {
    return this.contract.methods.pendingOwner().call();
  }

  /**
   * Returns passport owner public key. Owner must claim ownership of the passport,
   * before this method can be invoked.
   */
  public async getOwnerPublicKey(): Promise<number[]> {
    const ownerAddress = await this.getOwnerAddress();
    if (!ownerAddress) {
      throw createSdkError(ErrorCode.OwnershipNotClaimed, 'The ownership for this passport has not been claimed yet');
    }

    const transferredEvent = await this.getFirstOwnershipTransferredEvent(ownerAddress);
    if (!transferredEvent) {
      throw createSdkError(ErrorCode.FailedToGetOwnershipEvent, 'Failed to get ownership transfer event');
    }

    const tx = await getDecodedTx(transferredEvent.transactionHash, this.web3, this.options);

    return Array.from(tx.senderPublicKey);
  }

  private async getFirstOwnershipTransferredEvent(newOwnerAddress: string) {
    const events = await this.contract.getPastEvents('OwnershipTransferred', {

      // TODO: We need to somehow get passport contract creation block address to scan from to increase performance
      fromBlock: 0,
      filter: {
        previousOwner: null,
        newOwner: newOwnerAddress,
      },
    });

    return events.find(e => e && !(e as any).removed);
  }
}
