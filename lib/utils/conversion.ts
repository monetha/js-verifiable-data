import BN from 'bn.js';
import { toAscii } from 'web3-utils';

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
 * Converts hex string (with or without 0x) to boolean
 * Zero or empty value resolves to false. Other values resolves to true.
 */
export function hexToBoolean(hexString: string): boolean {
  if (!hexString) {
    return false;
  }

  return toBN(hexString).toNumber() !== 0;
}

/**
 * Converts given value to BN
 * Accepts:
 * - number - interpreted as decimal
 * - string - if with 0x prefix - hex, otherwise decimal
 * - BN
 * - bignumber.js object
 */
export function toBN(value: string | number | BN | any): BN {
  if (value === null || value === undefined) {
    return value;
  }

  if (BN.isBN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    if (value.indexOf('0x') === 0) {
      return new BN(value.replace('0x', ''), 'hex');
    }

    return new BN(value, 10);
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

/**
 * Converts given value to date. Any numerical representation is expected to be UNIX timestamp
 */
export function toDate(value: string | number| BN | any): Date {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return new Date(value);
  }

  if (typeof value === 'number') {
    let adaptedValue = value;

    // Check if value is represented as seconds
    if (value < 1000000) {
      adaptedValue *= 1000;
    }

    return new Date(adaptedValue);
  }

  const bnValue = toBN(value);

  // If date occupies 4 bytes - it is seconds
  if (bnValue.byteLength() <= 4) {
    return new Date(bnValue.muln(1000).toNumber());
  }

  // If date occupies 8 bytes - it is nano seconds
  if (bnValue.byteLength() >= 8) {
    return new Date(bnValue.divn(1000000).toNumber());
  }

  return new Date(bnValue.toNumber());
}
