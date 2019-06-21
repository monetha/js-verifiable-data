/**
 * Converts hex string (with or without 0x) to byte array
 */
export declare function hexToArray(hexString: string): number[];
/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
export declare function hexToUnpaddedAscii(hexString: string): string;
