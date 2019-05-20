import { MAX_BLOCK, MIN_BLOCK } from '../const/ethereum';
import { Address } from '../models/Address';
import { IHistoryEvent, EventType, DataType } from '../models/IHistoryEvent';
import { IPassportHistoryFilter } from '../models/IPassportHistoryFilter';
import { IPassportRef } from '../models/IPassportRef';
import { fetchEvents } from '../utils/fetchEvents';
import { sanitizeAddress } from '../utils/sanitizeAddress';
import Web3 from 'web3';
import passportLogicAbi from '../../config/PassportLogic.json';

interface IEventSignatures {
  [signature: string]: {
    eventType: EventType,
    dataType: DataType,
  };
}

let eventSignatures: IEventSignatures;

export class PassportReader {
  private web3: Web3;
  private ethNetworkUrl: string;

  constructor(web3: Web3, ethNetworkUrl: string) {
    this.web3 = web3;
    this.ethNetworkUrl = ethNetworkUrl;

    if (!eventSignatures) {
      eventSignatures = getEventSignatures(web3);
    }
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
      txHash: event.transactionHash,
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

      const { blockNumber, transactionHash, topics, blockHash, transactionIndex } = event;

      const eventSignatureHash = topics[0];
      const eventInfo = eventSignatures[eventSignatureHash];

      // We track only known events
      if (!eventInfo) {
        return;
      }

      // First argument is fact provider address
      const factProviderAddress: string = topics[1] ? sanitizeAddress(topics[1].slice(26)) : '';

      // Second argument is fact key
      const key: string = topics[2] ? this.web3.utils.toAscii(topics[2]).replace(/\u0000/g, '') : '';

      if (filterFactProviderAddress !== undefined && filterFactProviderAddress !== null && filterFactProviderAddress !== factProviderAddress) {
        return;
      }

      if (filterKey !== undefined && filterKey !== null && filterKey !== key) {
        return;
      }

      historyEvents.push({
        blockHash,
        blockNumber,
        transactionIndex,
        transactionHash,
        factProviderAddress,
        key,
        dataType: eventInfo.dataType,
        eventType: eventInfo.eventType,
      });
    });

    return historyEvents;
  }
}

function getEventSignatures(web3): IEventSignatures {

  const hashedSignatures = {};

  // Collect all event signatures from ABI file
  passportLogicAbi.forEach(item => {
    if (item.type !== 'event') {
      return;
    }

    const rawSignature = `${item.name}(${(item.inputs as any).map(i => i.type).join(',')})`;

    hashedSignatures[item.name] = web3.sha3(rawSignature);
  });

  const results: IEventSignatures = {};

  // Create dictionary of event signatures to event data
  Object.keys(DataType).forEach((dataType: DataType) => {
    Object.keys(EventType).forEach((eventType: EventType) => {
      const hashedSignature = hashedSignatures[`${dataType}${eventType}`];

      if (!hashedSignature) {
        return;
      }

      results[hashedSignature] = {
        dataType,
        eventType,
      };
    });
  });

  return results;
}
