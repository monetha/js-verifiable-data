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
  private harmony: Harmony;
  private passportAddress: Address;

  constructor(harmony: Harmony, passportAddress: Address) {
    this.harmony = harmony;
    this.passportAddress = passportAddress;
  }

  private getContract(): Contract {
    return initPassportLogicContract(this.harmony, this.passportAddress);
  }

  /**
   * After the passport is created, the owner must call this method to become a full passport owner
   */
  public async claimOwnership(passportOwnerAddress: Address) {
    const method = this.getContract().methods.claimOwnership();

    return configureSendMethod(this.harmony, method, passportOwnerAddress);
  }

  /**
   * Returns passport owner address
   */
  public async getOwnerAddress(): Promise<string> {
    return callMethod(this.getContract().methods.owner());
  }

  /**
   * Returns passport pending owner address
   */
  public async getPendingOwnerAddress(): Promise<string> {
    return callMethod(this.getContract().methods.pendingOwner());
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
    const events = await getPastEvents(this.harmony, this.getContract(), 'OwnershipTransferred', {
      filter: {
        previousOwner: null,
        newOwner: newOwnerAddress,
      },
    });

    return events.find(e => e && !(e as any).removed);
  }
}
