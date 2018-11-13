var _ = require("lodash");
const config = require('config');

var baseContract = require("./providers/Ethereum");

function IcoSdk(){ }

var createInstance = function (abi, atAddress) {
  var contract = baseContract(abi);
  var contractInstance = contract.at(atAddress);

  return contractInstance;
}

var createPassport = async function (abi, atAddress) {
  var contract = createInstance(abi, atAddress);
  var trxHash = await contract.createPassport();
  var timeInterval = setInterval(function () {
    var result = await web3.eth.getTransactionReceipt(trxHash);
    if (result.blockNumber) {
      passport = result.logs[0].topics[1];
      passport = parseInt('0x' + passport.slice(66, 130));
      clearInterval(timeInterval);
    }
  }, 2000)
  return passport;
};


var readPassportFacts = async function (contractAddress) {
  filter = web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: contractAddress
  })
  var events = await filter.watch();
  
  return events;
};
IcoSdk.createPassport = createPassport;

module.exports = IcoSdk;