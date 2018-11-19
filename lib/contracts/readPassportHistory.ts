import fetchEvents from '../providers/fetchEvents';

interface IFilteredFact {
  blockNumber: Number;
  blockHash: string;
  passportAddress: string;
  ownerAddress: string;
}

var readPassportHistory = async function (factoryAddress: string) {

  var facts  = await fetchEvents(factoryAddress);
  facts = (facts as Array<any>).map((fact) => {
    var filteredFact: IFilteredFact;
    filteredFact.blockNumber = fact.blockNumber;
    filteredFact.blockHash = fact.blockHash;
    filteredFact.passportAddress = '0x' + fact.topics[1].slice(26);
    filteredFact.ownerAddress = '0x' + fact.topics[2].slice(26);
  
    return filteredFact;
  });

  return facts;
}

export default readPassportHistory;