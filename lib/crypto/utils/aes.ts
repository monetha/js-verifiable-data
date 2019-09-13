import aes from 'aes-js';
import secureRandom from 'secure-random';
import { RandomArrayGenerator } from 'lib/models/RandomArrayGenerator';

const aesBlockSize = 16;

/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param ivPrefixedEncryptedMsg - encoded message with IV in first block
 */
export function aesDecrypt(key: number[], ivPrefixedEncryptedMsg: number[]): number[] {
  const iv = ivPrefixedEncryptedMsg.slice(0, aesBlockSize);
  const content = ivPrefixedEncryptedMsg.slice(aesBlockSize);

  const ctr = new aes.ModeOfOperation.ctr(key, new aes.Counter(iv));
  const result = Array.from<number>(ctr.decrypt(content));

  return result;
}

/**
 * Carries out CTR encryption using AES cipher
 * @param key - encryption key
 * @param msg - message to encode
 * @returns encrypted message, prefixed with IV at the first block
 */
export async function aesEncrypt(key: number[], msg: number[], rand?: RandomArrayGenerator): Promise<number[]> {
  const iv = await generateIV(rand);

  const ctr = new aes.ModeOfOperation.ctr(key, new aes.Counter(iv));
  const encryptedMsg = Array.from<number>(ctr.encrypt(msg));

  const ivPrefixedEncryptedMsg = [...iv, ...encryptedMsg];

  return ivPrefixedEncryptedMsg;
}

async function generateIV(rand?: RandomArrayGenerator): Promise<number[]> {
  if (rand) {
    return rand(aesBlockSize);
  }

  return secureRandom.randomArray(aesBlockSize);
}
