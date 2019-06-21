import BN from 'bn.js';
import { toAscii, hexToString } from 'web3-utils';

/**
 * Converts hex string (with or without 0x) to byte array
 */
export function hexToArray(hexString: string): number[] {
  if (!hexString) {
    return [];
  }

  return Array.from(Buffer.from(hexString.replace('0x', ''), 'hex'));
}

/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
export function hexToUnpaddedAscii(hexString: string): string {
  return toAscii(hexString).replace(/\u0000/g, '');
}

/**
 * Converts given value to BN
 */
export function toBN(value: string | number | BN | any): BN {
  if (value === null || value === undefined) {
    return value;
  }

  if (BN.isBN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return new BN(value.replace('0x', ''), 'hex');
  }

  if (typeof value === 'number') {
    return new BN(value);
  }

  if (value.constructor && value.constructor.isBigNumber && value.constructor.isBigNumber(value)) {
    let hexValue: string;
    if (value.toHexString) {
      hexValue = value.toHexString();
    } else {
      hexValue = value.toString(16);
    }

    return new BN(hexValue.replace('0x', ''), 'hex');
  }

  return new BN(value);
}
