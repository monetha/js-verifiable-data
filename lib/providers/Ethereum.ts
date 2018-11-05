const Web3 = require('web3');
const config = require('config');

class Ethereum {
  web3: any;
  contract: any;
  constructor(abi: any) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(config.web3.address));
    this.contract = {};
    this.loadContract(abi);
  }

  loadContract(abi: any) {
    const contract = this.web3.eth.contract(abi);
    this.contract = contract;
  }
}

module.exports = Ethereum;
