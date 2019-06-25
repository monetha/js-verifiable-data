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
