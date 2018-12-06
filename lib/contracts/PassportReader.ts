import * as abiDecoder from 'abi-decoder';
import Web4 from '../transactionHelpers/Web4';
import abi from '../../config/abis';
import fetchEvents from '../providers/fetchEvents';

interface IFilteredEvents {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}

interface IFilteredFact {
  blockNumber: Number;
  transactionHash: string;
  factProviderAddress: string;
  key: string;
}

export class PassportReader {
  web4: any;

  constructor(network: string) {
    this.web4 = new Web4(network).web4;
  }

  //method to fetch all the passport created by a particular passportFactory address
  async getPassportLists (factoryAddress: string): Promise<Array<IFilteredEvents>> {

    const events = await fetchEvents(factoryAddress, this.web4);
    let filteredEvents: Array<IFilteredEvents>;
    filteredEvents = (events as Array<any>).map((event) => ({
      blockNumber: event.blockNumber,
      blockHash: event.blockHash,
      passportAddress: '0x' + event.topics[1].slice(26),
      ownerAddress: '0x' + event.topics[2].slice(26),
    }));
  
    return filteredEvents;
  }

  //method to fetch all the events(history) of a particular passportFactory address
  async readPassportHistory (factoryAddress: string): Promise<Array<IFilteredFact>> {
    const facts  = await fetchEvents(factoryAddress, this.web4);
    let filteredFacts: Array<IFilteredFact>;
    filteredFacts = (facts as Array<any>).map(fact => ({
      blockNumber: fact.blockNumber,
      transactionHash: fact.transactionHash,
      factProviderAddress: '0x' + fact.topics[1].slice(26),
      key: this.web4.toAscii(fact.topics[2].slice(0,23)),
    }));

    return filteredFacts;
  }

    //method to return the transaction data using the transaction hash
  async getTrxData(trxHash: string): Promise<any> {
    const decoder = abiDecoder.addABI(abi.PassportLogic.abi)
    let result: any;
    try {
      result = await this.web4.eth.getTransaction(trxHash);
    } catch(err) {
      return err;
    }
    result = decoder.decodeMethod(result.input);
    return result;
  } 
}

export default PassportReader;
