import baseContract from './Ethereum';

var createInstance = function (abi: any, atAddress: string) {
  var contract = new baseContract( abi).getContract();
  var contractInstance = contract.at(atAddress);

  return contractInstance;
}

export default createInstance;