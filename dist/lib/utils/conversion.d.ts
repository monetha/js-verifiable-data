import BN from 'bn.js';
/**
 * Converts hex string (with or without 0x) to byte array
 */
export declare function hexToArray(hexString: string): number[];
/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
export declare function hexToUnpaddedAscii(hexString: string): string;
/**
 * Converts hex string (with or without 0x) to boolean
 * Zero or empty value resolves to false. Other values resolves to true.
 */
export declare function hexToBoolean(hexString: string): boolean;
/**
 * Converts given value to BN
 */
export declare function toBN(value: string | number | BN | any): BN;
/**
 * Converts given value to date. Any numerical representation is expected to be UNIX timestamp
 */
export declare function toDate(value: string | number | BN | any): Date;
