import aes from 'aes-js';

const aesBlockSize = 16;

/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param encodedMsg - encoded message with IV in first block
 */
export function aesDecrypt(key: number[], encodedMsg: number[]) {
  const iv = encodedMsg.slice(0, aesBlockSize);
  const content = encodedMsg.slice(aesBlockSize);

  const ctr = new aes.ModeOfOperation.ctr(key, new aes.Counter(iv));
  const result = ctr.decrypt(content);

  return result;
}
