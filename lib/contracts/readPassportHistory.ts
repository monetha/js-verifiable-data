import fetchEvents from '../providers/fetchEvents';

interface IFilteredFact {
  blockNumber: Number;
  transactionHash: string;
  factProviderAddress: string;
  key: string;
}

const globalWindow: any = window;

//method to fetch all the events(history) of a particular passportFactory address
const readPassportHistory = async function (factoryAddress: string): Promise<Array<IFilteredFact>> {

  // const facts  = await fetchEvents(factoryAddress);
  // let filteredFacts: Array<IFilteredFact>;
  // filteredFacts = (facts as Array<any>).map(fact => ({
  //   blockNumber: fact.blockNumber,
  //   transactionHash: fact.transactionHash,
  //   factProviderAddress: '0x' + fact.topics[1].slice(26),
  //   key: globalWindow.web3.toAscii(fact.topics[2].slice(0,23)),
  // }));

  return undefined;
}

export default readPassportHistory;