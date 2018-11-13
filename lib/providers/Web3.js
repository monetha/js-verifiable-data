const Web3 = require('web3');

class Web3 {
  constructor(address) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(address));
  }

  get connector() {
    return this.web3;
  }

  set connector(web4) {
    this.web3 = web4;
  }
}

module.exports = Web3;
  