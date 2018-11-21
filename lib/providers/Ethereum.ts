const globalWindow: any = window;

class Ethereum {
  contract: any;
  constructor(abi) {
    const web3: any = globalWindow.web3;
    this.contract = web3.eth.contract(abi);
  }

  getContract() {
    return this.contract;
  }
}

export default Ethereum;
