import Web3 from '../transactionHelpers/Web3';
import fetchEvents from '../providers/fetchEvents';
import getTxData from '../providers/getTrxData';

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
  web3: any;
  url: string;
  constructor(network: string) {
    const eth = new Web3(network)
    this.web3 = eth.web3;
    this.url = eth.url;
  }

  //method to fetch all the passport created by a particular passportFactory address
  async getPassportLists (factoryAddress: string): Promise<Array<IFilteredEvents>> {

    const events = await fetchEvents("0x0", "0x6c6174657374", factoryAddress, this.url);
    let filteredEvents: Array<IFilteredEvents>;
    filteredEvents = (events as Array<any>).map((event) => ({
      blockNumber: event.blockNumber,
      blockHash: event.blockHash,
      passportAddress: '0x' + event.topics[1] ? event.topics[1].slice(26) : "",
      ownerAddress: '0x' + event.topics[2] ? event.topics[2].slice(26) : "",
    }));

    return filteredEvents;
  }

  //method to fetch all the events(history) of a particular passportFactory address
  async readPassportHistory (factoryAddress: string): Promise<Array<IFilteredFact>> {
    const facts  = await fetchEvents("0x0", "0x6c6174657374", factoryAddress, this.url);
    let filteredFacts: Array<IFilteredFact>;
    filteredFacts = (facts as Array<any>).map(fact => ({
      blockNumber: fact.blockNumber,
      transactionHash: fact.transactionHash,
      factProviderAddress: '0x' + fact.topics[1].slice(26),
      key: this.web3.toAscii(fact.topics[2].slice(0,23)),
    }));

    return filteredFacts;
  }

    //method to return the transaction data using the transaction hash
  async getTrxData(trxHash: string): Promise<any> {
    let result: any;
    result = await getTxData(trxHash, this.web3);
    return result;
  }
}

export default PassportReader;
