const Web3 = require('web3');

export class Web3Provider {
  public web3;
  public url: string;

  constructor(network: string) {
    this.url = network;
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));

    if (!this.web3.isConnected()) {
      throw new Error('The url provided is incorrect');
    }
  }
}
