import { aesEncrypt, aesDecrypt } from './aes';
import { expect } from 'chai';

describe('AES', () => {

  it('Should encrypt -> decrypt', () => {
    const message = 'Hello, world 🌎';
    const messageArr = Array.from(Buffer.from(message, 'utf8'));
    const key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const encrypted = aesEncrypt(key, messageArr);
    const decrypted = aesDecrypt(key, encrypted);

    const decryptedStr = Buffer.from(decrypted).toString('utf8');

    expect(decryptedStr).eq(message);
  });
});
