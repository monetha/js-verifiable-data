import { MAX_BLOCK, MIN_BLOCK } from '../const/ethereum';
import { Address } from '../models/Address';
import { IHistoryEvent } from '../models/IHistoryEvent';
import { IPassportRef } from '../models/IPassportRef';
import { fetchEvents } from '../utils/fetchEvents';
import { sanitizeAddress } from '../utils/sanitizeAddress';

export class PassportReader {
  private web3: any;
  private ethNetworkUrl: string;

  constructor(web3, ethNetworkUrl: string) {
    this.web3 = web3;
    this.ethNetworkUrl = ethNetworkUrl;
  }

  /**
   * Fetches all passport addresses created by a particular passport factory address
   *
   * @param factoryAddress address of passport factory to get passports for
   * @param startBlock block nr to scan from
   * @param endBlock block nr to scan to
   */
  public async getPassportsList(factoryAddress: Address, startBlock = MIN_BLOCK, endBlock = MAX_BLOCK): Promise<IPassportRef[]> {
    const events = await fetchEvents(this.ethNetworkUrl, startBlock, endBlock, factoryAddress);

    const passportRefs: IPassportRef[] = events.map(event => ({
      blockNumber: event.blockNumber,
      blockHash: event.blockHash,
      passportAddress: event.topics[1] ? sanitizeAddress(event.topics[1].slice(26)) : '',
      ownerAddress: event.topics[2] ? sanitizeAddress(event.topics[2].slice(26)) : '',
    }));

    return passportRefs;
  }

  /**
   * Fetches all the events (history) of a particular passport factory address
   *
   * @param factoryAddress address of passport factory to get passports for
   * @param startBlock block nr to scan from
   * @param endBlock block nr to scan to
   */
  public async readPassportHistory(factoryAddress: string, startBlock = MIN_BLOCK, endBlock = MAX_BLOCK): Promise<IHistoryEvent[]> {
    const events = await fetchEvents(this.ethNetworkUrl, startBlock, endBlock, factoryAddress);

    const historyEvents: IHistoryEvent[] = events.map(event => ({
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      factProviderAddress: event.topics[1] ? sanitizeAddress(event.topics[1].slice(26)) : '',
      key: this.web3.toAscii(event.topics[2].slice(0, 23)),
    }));

    return historyEvents;
  }
}