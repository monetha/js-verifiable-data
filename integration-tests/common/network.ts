import Web3 from 'web3';
import * as quorum from './networks/quorum';
import * as pantheon from './networks/pantheon';
import * as ganache from './networks/ganache';

export enum NetworkType {
  Ganache = 'development',
  Quorum = 'quorum',
  Pantheon = 'pantheon',
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
 * Gets all ethereum network urls
 */
export function getNetworkNodeUrls(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getNetworkNodeUrls();
      break;
    case NetworkType.Pantheon:
      return pantheon.getNetworkNodeUrls();
      break;
    default:
      const networkConfig = getNetworkConfig();
      return [`http://${networkConfig.host}:${networkConfig.port}`];
  }
}

/**
 * Gets specific ethereum network url
 */
export function getNetworkNodeUrl(index: number = 0): string {
  return getNetworkNodeUrls()[index];
}

/**
 * Gets all ethereum network private node urls
 */
export function getNetworkPrivateNodeUrls(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getNetworkPrivateNodeUrls();
      break;
    case NetworkType.Pantheon:
      return pantheon.getNetworkPrivateNodeUrls();
      break;
    default:
      return [];
  }
}

/**
 * Gets specific ethereum network url
 */
export function getNetworkPrivateNodeUrl(index: number = 0): string {
  return getNetworkPrivateNodeUrls()[index];
}

/**
 * Gets account addresses
 */
export async function getAccounts(web3: Web3): Promise<string[]> {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getAccounts();
      break;
    case NetworkType.Pantheon:
      return pantheon.getAccounts();
      break;
    default:
      return web3.eth.getAccounts();
  }
}

/**
 * Gets account private keys
 */
export function getPrivateKeys(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getPrivateKeys();
      break;
    case NetworkType.Pantheon:
      return pantheon.getPrivateKeys();
      break;
    default:
      return ganache.getPrivateKeys();
  }
}

/**
 * Gets account private keys
 */
export function getNodePublicKeys(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getNodePublicKeys();
      break;
    case NetworkType.Pantheon:
      return pantheon.getNodePublicKeys();
      break;
    default:
      return [];
  }
}
