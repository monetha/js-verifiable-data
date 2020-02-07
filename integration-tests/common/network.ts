import * as harmonyTestnet from './networks/harmony';
import { Harmony } from '@harmony-js/core';

export enum NetworkType {
  HarmonyTestnet = 'harmony_testnet',
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
    cachedNetwork = NetworkType.HarmonyTestnet;
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
    case NetworkType.HarmonyTestnet:
    default:
      return harmonyTestnet.getNetworkNodeUrls();
  }
}

/**
 * Gets specific ethereum network url
 */
export function getNetworkNodeUrl(index: number = 0): string {
  return getNetworkNodeUrls()[index];
}

/**
 * Gets account addresses
 */
export async function getAccounts(harmony: Harmony): Promise<string[]> {
  return harmony.wallet.accounts;
}
/**
 * Gets specific account address
 */
export async function getAccount(harmony: Harmony, index: number = 0): Promise<string> {
  const accounts = await getAccounts(harmony);
  return accounts[index];
}

/**
 * Gets account private keys
 */
export function getPrivateKeys(): string[] {
  const network = getNetwork();

  switch (network) {
    case NetworkType.HarmonyTestnet:
    default:
      return harmonyTestnet.getPrivateKeys();
  }
}

/**
 * Gets specific account private key
 */
export function getPrivateKey(index: number = 0): string {
  return getPrivateKeys()[index];
}

/**
 * Adds accounts to harmony wallet using private keys
 */
export function addAccountsFromPrivateKeys(harmony: Harmony) {
  const keys = getPrivateKeys();

  keys.forEach(k => harmony.wallet.addByPrivateKey(k));
}
