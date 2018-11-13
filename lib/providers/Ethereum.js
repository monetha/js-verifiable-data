class Ethereum {
  constructor(web3, abi) {
    this.contract = web3.eth.contract(abi);
  }

  get contract() {
    return this.CONTRACT;
  }

  set contract(contract1) {
    this.CONTRACT = contract1;
  }
}

module.exports = Ethereum;
