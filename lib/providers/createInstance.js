var baseContract = require("./Ethereum");

export default createInstance = function ( abi, atAddress) {
  var contract = new baseContract( abi).getContract();
  var contractInstance = contract.at(atAddress);

  return contractInstance;
}