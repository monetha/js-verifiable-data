import fetchEvents from '../providers/fetchEvents';

interface IFilteredFact {
  blockNumber: Number;
  transactionHash: string;
  factProviderAddress: string;
  key: string;
}

var globalWindow: any = window;
var readPassportHistory = async function (factoryAddress: string) {

  var facts  = await fetchEvents(factoryAddress);
  facts = (facts as Array<any>).map((fact) => {
    var filteredFact: IFilteredFact;
    filteredFact.blockNumber = fact.blockNumber;
    filteredFact.transactionHash = fact.transactionHash;
    filteredFact.factProviderAddress = '0x' + fact.topics[1].slice(26);
    filteredFact.key = globalWindow.web3.toAscii(fact.topics[2].slice(0,23));
  
    return filteredFact;
  });

  return facts;
}

export default readPassportHistory;