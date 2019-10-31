import Web3 from 'web3';
import * as quorum from './networks/quorum';
import * as besu from './networks/besu';
import * as ganache from './networks/ganache';

export enum NetworkType {
  Ganache = 'development',
  Quorum = 'quorum',
  Besu = 'besu',
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

    case NetworkType.Besu:
      return besu.getNetworkNodeUrls();

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

    case NetworkType.Besu:
      return besu.getNetworkPrivateNodeUrls();

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

    case NetworkType.Besu:
      return besu.getAccounts();

    default:
      return web3.eth.getAccounts();
  }
}
/**
 * Gets specific account address
 */
export async function getAccount(web3: Web3, index: number = 0): Promise<string> {
  const accounts = await getAccounts(web3);
  return accounts[index];
}

/**
 * Gets account private keys
 */
export function getPrivateKeys(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getPrivateKeys();

    case NetworkType.Besu:
      return besu.getPrivateKeys();

    default:
      return ganache.getPrivateKeys();
  }
}

/**
 * Gets specific account private key
 */
export function getPrivateKey(index: number = 0): string {
  return getPrivateKeys()[index];
}

/**
 * Gets node public keys
 */
export function getNodePublicKeys(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.Quorum:
      return quorum.getNodePublicKeys();

    case NetworkType.Besu:
      return besu.getNodePublicKeys();

    default:
      return [];
  }
}
/**
 * Gets specific node public key
 */
export function getNodePublicKey(index: number = 0): string {
  return getNodePublicKeys()[index];
}