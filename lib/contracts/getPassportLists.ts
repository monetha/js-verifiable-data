import fetchEvents from '../providers/fetchEvents';

interface IFilteredEvents {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}
const getPassportLists = async function (factoryAddress: string): Promise<Array<IFilteredEvents>> {

  let events = await fetchEvents(factoryAddress);
  let fileteredEvents: Array<IFilteredEvents>;
  fileteredEvents = (events as Array<any>).map((event) => {

    let filteredEvent: IFilteredEvents;

    filteredEvent.blockNumber = event.blockNumber;
    filteredEvent.blockHash = event.blockHash;
    filteredEvent.passportAddress = '0x' + event.topics[1].slice(26);
    filteredEvent.ownerAddress = '0x' + event.topics[2].slice(26);
  
    return filteredEvent;
  });

  return fileteredEvents;
}

export default getPassportLists;