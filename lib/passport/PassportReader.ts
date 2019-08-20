import { PassportFactory } from 'lib/types/web3-contracts/PassportFactory';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportAbi from '../../config/Passport.json';
import passportFactoryAbi from '../../config/PassportFactory.json';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { DataType, EventType, IHistoryEvent } from '../models/IHistoryEvent';
import { IPassportHistoryFilter } from '../models/IPassportHistoryFilter';
import { IPassportRef } from '../models/IPassportRef';
import { Passport } from '../types/web3-contracts/Passport';
import { sanitizeAddress } from '../utils/sanitizeAddress';
import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic.js';

interface IFactEventSignatures {
  [signature: string]: {
    eventType: EventType,
    dataType: DataType,
  };
}

let factEventSignatures: IFactEventSignatures;

/**
 * Class to get passports list and historic events
 */
export class PassportReader {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;

    if (!factEventSignatures) {
      const signatures = getEventSignatures(web3);
      factEventSignatures = signatures.factEvents;
    }
  }

  /**
   * Fetches all passport addresses created by a particular passport factory address
   *
   * @param factoryAddress address of passport factory to get passports for
   * @param startBlock block nr to scan from
   * @param endBlock block nr to scan to
   */
  public async getPassportsList(factoryAddress: Address, fromBlock = 0, toBlock = 'latest'): Promise<IPassportRef[]> {
    const contract = new this.web3.eth.Contract(passportFactoryAbi as AbiItem[], factoryAddress) as PassportFactory;

    const events = await contract.getPastEvents('PassportCreated', {
      fromBlock,
      toBlock,
    });

    const passportRefs: IPassportRef[] = events.map(event => ({
      ...event,
      passportAddress: event.raw.topics[1] ? sanitizeAddress(event.raw.topics[1].slice(26)) : '',
      ownerAddress: event.raw.topics[2] ? sanitizeAddress(event.raw.topics[2].slice(26)) : '',
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

    // Filters
    const fromBlock = filter && filter.startBlock || 0;
    const toBlock = filter && filter.endBlock || 'latest';

    // Event retrieval
    const contract = new this.web3.eth.Contract(passportLogicAbi as AbiItem[], passportAddress) as PassportLogic;
    const events = await contract.getPastEvents('allEvents', {
      fromBlock,
      toBlock,
    });

    const historyEvents: IHistoryEvent[] = [];

    events.forEach(event => {
      if (!event) {
        return;
      }

      const { topics } = event.raw;

      const eventSignatureHash = topics[0];
      const eventInfo = factEventSignatures[eventSignatureHash];

      // We track only known events
      if (!eventInfo) {
        return;
      }

      // First argument is fact provider address
      const factProviderAddress: string = topics[1] ? sanitizeAddress(topics[1].slice(26)) : '';

      if (filter && filter.factProviderAddress && factProviderAddress.toLowerCase() !== filter.factProviderAddress.toLowerCase()) {
        return;
      }

      // Second argument is fact key
      const key: string = topics[2] ? this.web3.utils.toAscii(topics[2]).replace(/\u0000/g, '') : '';

      if (filter && filter.key && key.toLowerCase() !== filter.key.toLowerCase()) {
        return;
      }

      historyEvents.push({
        ...event,
        factProviderAddress,
        key,
        dataType: eventInfo.dataType,
        eventType: eventInfo.eventType,
      });
    });

    return historyEvents;
  }

  /**
   * Returns the address of passport logic registry
   */
  public async getPassportLogicRegistryAddress(passportAddress: string): Promise<string> {
    const passportContract = new this.web3.eth.Contract(passportAbi as AbiItem[], passportAddress) as Passport;
    return passportContract.methods.getPassportLogicRegistry().call();
  }
}

function getEventSignatures(web3: Web3): {
  factEvents: IFactEventSignatures;
} {

  const hashedSignatures: any = {};

  // Collect all event signatures from ABI file
  const abis = [passportLogicAbi, passportFactoryAbi];

  abis.forEach(abi => {
    abi.forEach(item => {
      if (item.type !== 'event') {
        return;
      }

      const rawSignature = `${item.name}(${(item.inputs as any).map(i => i.type).join(',')})`;

      hashedSignatures[item.name] = web3.utils.sha3(rawSignature);
    });
  });

  const factEvents: IFactEventSignatures = {};

  // Create dictionary of event signatures to event data
  Object.keys(DataType).forEach((dataType: string) => {
    Object.keys(EventType).forEach((eventType: string) => {
      const hashedSignature = hashedSignatures[`${DataType[dataType]}${EventType[eventType]}`];

      if (!hashedSignature) {
        return;
      }

      factEvents[hashedSignature] = {
        dataType: DataType[dataType],
        eventType: EventType[eventType],
      };
    });
  });

  return {
    factEvents,
  };
}
