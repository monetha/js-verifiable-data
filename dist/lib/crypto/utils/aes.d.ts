import { RandomArrayGenerator } from '../../models/RandomArrayGenerator';
/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param ivPrefixedEncryptedMsg - encoded message with IV in first block
 */
export declare function aesDecrypt(key: number[], ivPrefixedEncryptedMsg: number[]): number[];
/**
 * Carries out CTR encryption using AES cipher
 * @param key - encryption key
 * @param msg - message to encode
 * @returns encrypted message, prefixed with IV at the first block
 */
export declare function aesEncrypt(key: number[], msg: number[], rand?: RandomArrayGenerator): Promise<number[]>;
