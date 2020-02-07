import { Contract } from '@harmony-js/contract';
import { Harmony } from '@harmony-js/core';
import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { getPastEvents } from 'lib/utils/logs';
import { Address } from '../models/Address';
import { configureSendMethod, getDecodedTx, callMethod } from '../utils/tx';
import { initPassportLogicContract } from './rawContracts';

/**
 * Class to manage passport ownership
 */
export class PassportOwnership {
  private contract: Contract;
  private harmony: Harmony;

  constructor(harmony: Harmony, passportAddress: Address) {
    this.harmony = harmony;
    this.contract = initPassportLogicContract(harmony, passportAddress);
  }

  /**
   * After the passport is created, the owner must call this method to become a full passport owner
   */
  public async claimOwnership(passportOwnerAddress: Address) {
    const method = this.contract.methods.claimOwnership();

    return configureSendMethod(this.harmony, method, passportOwnerAddress);
  }

  /**
   * Returns passport owner address
   */
  public async getOwnerAddress(): Promise<string> {
    return callMethod(this.contract.methods.owner());
  }

  /**
   * Returns passport pending owner address
   */
  public async getPendingOwnerAddress(): Promise<string> {
    return callMethod(this.contract.methods.pendingOwner());
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

    const tx = await getDecodedTx(this.harmony, transferredEvent.transactionHash);

    return Array.from(tx.senderPublicKey);
  }

  private async getFirstOwnershipTransferredEvent(newOwnerAddress: string) {
    const events = await getPastEvents(this.harmony, this.contract, 'OwnershipTransferred', {
      filter: {
        previousOwner: null,
        newOwner: newOwnerAddress,
      },
    });

    return events.find(e => e && !(e as any).removed);
  }
}
