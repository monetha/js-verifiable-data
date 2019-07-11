import Web3 from 'web3';
import * as quorum from './quorum';
import * as ganache from './ganache';

export enum NetworkType {
  Ganache = 'development',
  Quorum = 'quorum',
}

const truffleConfig = require('../truffle-config');
let cachedNetwork: NetworkType = null;

/**
 * Gets network type
 */
export function getNetwork(): NetworkType {
  if (cachedNetwork) {
    return cachedNetwork;
  }

  for (let i = 0; i < process.argv.length; i += 1) {
    const arg = process.argv[i];

    if (arg === '--network') {
      cachedNetwork = process.argv[i + 1] as NetworkType;
      break;
    }
  }

  if (!cachedNetwork) {
    cachedNetwork = NetworkType.Ganache;
  }

  return cachedNetwork;
}

/**
 * Gets truffle's network config
 */
export function getNetworkConfig() {
  return truffleConfig.networks[getNetwork()];
}

/**
 * Gets ethereum network url
 */
export function getNetworkUrl(): string {
  const networkConfig = getNetworkConfig();
  return `http://${networkConfig.host}:${networkConfig.port}`;
}

/**
 * Gets ethereum network url node 2
 */
export function getNetworkUrlNode2(): string {
  const networkConfig = getNetworkConfig();
  return `http://${networkConfig.host}:22002`;
}

/**
 * Gets account addresses
 */
export async function getAccounts(web3: Web3): Promise<string[]> {
  const network = getNetwork();

  if (network === NetworkType.Quorum) {
    return quorum.getAccounts();
  }

  return web3.eth.getAccounts();
}

/**
 * Gets account private keys
 */
export async function getPrivateKeys(web3: Web3): Promise<string[]> {
  const network = getNetwork();

  if (network === NetworkType.Quorum) {
    return quorum.getPrivateKeys();
  }

  return ganache.getPrivateKeys();
}
