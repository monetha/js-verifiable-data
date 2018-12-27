const Web3 = require('web3');

export class Web3Provider {
  url: string;
  web3: any;
  constructor(network) {
    this.url = network
    // const url = network == "mainnet" ? 'https://mainnet.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90' : 'https://ropsten.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90'
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.url))
    if(!this.web3.isConnected()) {
      throw new Error("The url provided is incorrect");
    }
  }
}

export default Web3Provider;
