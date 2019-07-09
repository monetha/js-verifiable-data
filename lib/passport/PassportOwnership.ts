import { IEthOptions } from 'lib/models/IEthOptions';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { PassportLogic } from '../types/web3-contracts/PassportLogic';
import { getSenderPublicKey, getTxData } from '../utils/getTxData';

/**
 * Class to change passport ownership
 */
export class PassportOwnership {
  private contract: ContractIO<PassportLogic>;
  private options: IEthOptions;

  constructor(web3: Web3, passportAddress: Address, options?: IEthOptions) {
    this.contract = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
    this.options = options || {};
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
    return this.contract.getContract().methods.owner().call();
  }

  /**
   * Returns passport pending owner address
   */
  public async getPendingOwnerAddress(): Promise<string> {
    return this.contract.getContract().methods.pendingOwner().call();
  }

  /**
   * Returns passport owner public key. Owner must claim ownership of the passport,
   * before this method can be invoked.
   */
  public async getOwnerPublicKey(): Promise<number[]> {
    const ownerAddress = await this.getOwnerAddress();
    if (!ownerAddress) {
      throw new Error('The ownership for this passport has not been claimed yet');
    }

    const transferredEvent = await this.getFirstOwnershipTransferredEvent(ownerAddress);
    if (!transferredEvent) {
      throw new Error('Failed to get ownership transfer event');
    }

    const web3 = this.contract.getWeb3();
    const txInfo = await getTxData(transferredEvent.transactionHash, web3, this.options.txRetriever);
    const { tx } = txInfo;

    return Array.from(getSenderPublicKey(tx as any));
  }

  private async getFirstOwnershipTransferredEvent(newOwnerAddress: string) {
    const events = await this.contract.getContract().getPastEvents('OwnershipTransferred', {

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
