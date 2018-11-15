import { fetchEvents } from '../providers/fetchEvents';

export default getPassportLists = async function (factoryAddress) {

  var events  = await fetchEvents(factoryAddress);
  events = events.map((event) => {
    var filteredEvent = {};
    filteredEvent.blockNumber = event.blockNumber;
    filteredEvent.blockHash = event.blockHash;
    filteredEvent.passportAddress = '0x' + event.topics[1].slice(26);
    filteredEvent.ownerAddress = '0x' + event.topics[2].slice(26);
  
    return filteredEvent;
  });

  return events;
}