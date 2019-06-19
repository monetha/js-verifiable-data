/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param encodedMsg - encoded message with IV in first block
 */
export declare function aesDecrypt(key: number[], encodedMsg: number[]): any;
