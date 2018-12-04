import Ethereum from '../transactionHelpers/Ethereum';
import abi from '../../config/abis';
import fetchEvents from '../providers/fetchEvents';

interface IFilteredEvents {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}

export class PassportReader {
  contract: any;

  constructor(network: string) {
    this.contract = new Ethereum(abi.PassportFactory.abi, abi.PassportFactory.at, network);
  }

  //method to fetch all the passport created by a particular passportFactory address
  async getPassportLists (factoryAddress: string): Promise<Array<IFilteredEvents>> {
  
    const events = await fetchEvents(factoryAddress, this.contract.web3);
    let filteredEvents: Array<IFilteredEvents>;
    filteredEvents = (events as Array<any>).map((event) => ({
      blockNumber: event.blockNumber,
      blockHash: event.blockHash,
      passportAddress: '0x' + event.topics[1].slice(26),
      ownerAddress: '0x' + event.topics[2].slice(26),
    }));
  
    return filteredEvents;
  }
}

export default PassportReader;
