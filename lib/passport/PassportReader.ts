import { MAX_BLOCK, MIN_BLOCK } from '../const/ethereum';
import { Address } from '../models/Address';
import { IHistoryEvent } from '../models/IHistoryEvent';
import { IPassportHistoryFilter } from '../models/IPassportHistoryFilter';
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
   * Fetches all the events (history) of a particular passport address
   *
   * @param passportAddress address of passport to get events for
   * @param filter passport history filter
   */
  public async readPassportHistory(passportAddress: Address, filter?: IPassportHistoryFilter): Promise<IHistoryEvent[]> {
    const startBlock = filter && filter.startBlock || MIN_BLOCK;
    const endBlock = filter && filter.endBlock || MAX_BLOCK;
    const filterFactProviderAddress = filter && filter.factProviderAddress;
    const filterKey = filter && filter.key;

    const events = await fetchEvents(this.ethNetworkUrl, startBlock, endBlock, passportAddress);

    const historyEvents: IHistoryEvent[] = [];

    events.forEach(event => {
      if (!event) {
        return;
      }

      const { blockNumber, transactionHash, topics } = event;

      const factProviderAddress: string = topics[1] ? sanitizeAddress(topics[1].slice(26)) : '';
      const key: string = topics[2] ? this.web3.toAscii(topics[2].slice(0, 23)) : '';

      if (filterFactProviderAddress !== undefined && filterFactProviderAddress !== null && filterFactProviderAddress !== factProviderAddress) {
        return;
      }

      if (filterKey !== undefined && filterKey !== null && filterKey !== key) {
        return;
      }

      historyEvents.push({
        blockNumber,
        transactionHash,
        factProviderAddress,
        key,
      });
    });

    return historyEvents;
  }
}
