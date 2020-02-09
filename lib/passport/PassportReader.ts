import passportFactoryAbi from '../../config/PassportFactory.json';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { DataType, EventType, IHistoryEvent } from '../models/IHistoryEvent';
import { IPassportHistoryFilter } from '../models/IPassportHistoryFilter';
import { IPassportRef } from '../models/IPassportRef';
import { sanitizeAddress } from '../utils/sanitizeAddress';
import { initPassportContract, initPassportFactoryContract, initPassportLogicContract } from './rawContracts';
import * as crypto from '@harmony-js/crypto';
import { Harmony } from '@harmony-js/core';
import { getPastEvents, getAllPastEvents } from 'lib/utils/logs';
import { Contract, parseBytes32String } from '@harmony-js/contract';

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
  private harmony: Harmony;

  constructor(harmony: Harmony) {
    this.harmony = harmony;
  }

  /**
   * Fetches all passport addresses created by a particular passport factory address
   *
   * @param factoryAddress address of passport factory to get passports for
   * @param startBlock block nr to scan from
   * @param endBlock block nr to scan to
   */
  public async getPassportsList(factoryAddress: Address, fromBlock = 'earliest', toBlock = 'latest'): Promise<IPassportRef[]> {
    const contract = initPassportFactoryContract(this.harmony, factoryAddress);

    const events = await getPastEvents(this.harmony, contract, 'PassportCreated', {
      fromBlock,
      toBlock,
    });

    const passportRefs: IPassportRef[] = events.map(event => ({
      ...event,
      passportAddress: event.returnValues.passport,
      ownerAddress: event.returnValues.owner,
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
    const fromBlock = filter && filter.startBlock || 'earliest';
    const toBlock = filter && filter.endBlock || 'latest';

    // Event retrieval
    const contract = initPassportLogicContract(this.harmony, passportAddress);
    const events = await getAllPastEvents(this.harmony, contract, {
      fromBlock,
      toBlock,
    });

    if (!factEventSignatures) {
      const signatures = getEventSignatures(contract.abiCoder);
      factEventSignatures = signatures.factEvents;
    }

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
      const key: string = topics[2] ? parseBytes32String(topics[2]) : '';

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
    const passportContract = initPassportContract(this.harmony, passportAddress);
    return passportContract.methods.getPassportLogicRegistry().call();
  }
}

function getEventSignatures(abiCoder): {
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

      // const rawSignature = `${item.name}(${(item.inputs as any).map(i => i.type).join(',')})`;
      hashedSignatures[item.name] = abiCoder.encodeEventSignature(item); //crypto.keccak256(rawSignature);
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
