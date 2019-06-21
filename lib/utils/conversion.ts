import { toAscii } from 'web3-utils';

/**
 * Converts hex string (with or without 0x) to byte array
 */
export function hexToArray(hexString: string): number[] {
  if (!hexString) {
    return [];
  }

  return Array.from(Buffer.from(hexString.replace('0x', '')));
}

/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
export function hexToUnpaddedAscii(hexString: string): string {
  return toAscii(hexString).replace(/\u0000/g, '');
}
