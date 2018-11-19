import fetchEvents from '../providers/fetchEvents';

interface IFilteredEvents {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}
var getPassportLists = async function (factoryAddress: string) {

  var events = await fetchEvents(factoryAddress);
  events = (events as Array<any>).map((event) => {

    var filteredEvent: IFilteredEvents;

    filteredEvent.blockNumber = event.blockNumber;
    filteredEvent.blockHash = event.blockHash;
    filteredEvent.passportAddress = '0x' + event.topics[1].slice(26);
    filteredEvent.ownerAddress = '0x' + event.topics[2].slice(26);
  
    return filteredEvent;
  });

  return events;
}

export default getPassportLists;