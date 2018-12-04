import fetchEvents from '../providers/fetchEvents';

interface IFilteredEvents {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}

//method to fetch all the passport created by a particular passportFactory address
const getPassportLists = async function (factoryAddress: string): Promise<Array<IFilteredEvents>> {

  // const events = await fetchEvents(factoryAddress);
  // let filteredEvents: Array<IFilteredEvents>;
  // filteredEvents = (events as Array<any>).map((event) => ({
  //   blockNumber: event.blockNumber,
  //   blockHash: event.blockHash,
  //   passportAddress: '0x' + event.topics[1].slice(26),
  //   ownerAddress: '0x' + event.topics[2].slice(26),
  // }));

  return null;
}

export default getPassportLists;