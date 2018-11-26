import Web3 from 'web3';
export { CreatePassport } from './contracts/createPassport';

export enum Network {
  MAIN_NET = 'MAIN_NET',
  TEST_NET = "TEST_NET"
}

const globalWindow: any = window;

class ReputationSDK {
  network: Network;
  web3: any;

  constructor(network: Network) {
    this.network = network;

    if (globalWindow.web3) {
      this.web3 = globalWindow.web3;
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.network));
    }
  }
}

export default ReputationSDK;
