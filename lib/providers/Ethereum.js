class Ethereum {
  constructor(abi) {
    web3 = window.web3;
    this.contract = web3.eth.contract(abi);
  }

  getContract() {
    return this.contract;
  }
}

module.exports = Ethereum;
