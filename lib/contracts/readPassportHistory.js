import { fetchEvents } from '../providers/fetchEvents';

export default readPassportHistory = async function (factoryAddress) {

  var facts  = await fetchEvents(factoryAddress);
  facts = facts.map((fact) => {
    var filteredFact = {};
    filteredFact.blockNumber = fact.blockNumber;
    filteredFact.blockHash = fact.blockHash;
    filteredFact.passportAddress = '0x' + fact.topics[1].slice(26);
    filteredFact.ownerAddress = '0x' + fact.topics[2].slice(26);
  
    return filteredFact;
  });

  return facts;
}