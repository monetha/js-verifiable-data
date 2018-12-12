const Web4 = require('web3');

export class Web4Provider {
  url: string;
  web4: any;
  constructor(network) {
    this.url = network
    // const url = network == "mainnet" ? 'https://mainnet.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90' : 'https://ropsten.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90'
    this.web4 = new Web4(new Web4.providers.HttpProvider(this.url))
    if(!this.web4.isConnected()) {
      throw new Error("The url provided is incorrect");
    }
  }
}

export default Web4Provider;
