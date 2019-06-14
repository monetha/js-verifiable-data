import { curve } from 'elliptic';
import { sha256, sha384, sha512 } from 'hash.js';
import { ISecretKeyringMaterial } from './ecies';
import { getMessageTag } from '../utils/hmac';
import { constantTimeCompare } from '../utils/compare';
import { aesDecrypt, aesEncrypt } from '../utils/aes';

interface ICryptorParams {
  hasherConstr: () => BlockHash<any>;
  keyLength: number;
}

interface IEncryptedAuthenticatedMessage {
  encryptedMsg: number[];
  hmac: number[];
}

const standardCryptorParams: { [name: string]: ICryptorParams } = {
  aes128Sha256: {
    hasherConstr: sha256,
    keyLength: 16,
  },
  aes256Sha256: {
    hasherConstr: sha256,
    keyLength: 32,
  },
  aes256Sha384: {
    hasherConstr: sha384,
    keyLength: 32,
  },
  aes256Sha512: {
    hasherConstr: sha512,
    keyLength: 32,
  },
};

export class Cryptor {
  private params: ICryptorParams;

  public constructor(_curve: curve.base) {
    // TODO: determine params from curve
    this.params = standardCryptorParams.aes128Sha256;
  }

  /**
   * Checks encrypted message HMAC and if it's valid decrypts the message.
   * s2 contains shared information that is not part of the ciphertext, it's fed into the MAC. If the
   * shared information parameters aren't being used, they should not be provided.
   */
  public decryptAuth(skm: ISecretKeyringMaterial, encAuthMsg: IEncryptedAuthenticatedMessage, s2?: number[]) {
    const tag = getMessageTag(this.params.hasherConstr, skm.macKey, encAuthMsg.encryptedMsg, s2);

    if (!constantTimeCompare(encAuthMsg.hmac, tag)) {
      throw new Error('Invalid message');
    }

    return aesDecrypt(skm.encryptionKey, encAuthMsg.encryptedMsg);
  }

  /**
   * EncryptAuth encrypts message using provided secret keyring material and returns encrypted message with the HMAC.
   * s2 contains shared information that is not part of the resulting ciphertext, it's fed into the MAC. If the
   * shared information parameters aren't being used, they should not be provided.
   */
  public encryptAuth(skm: ISecretKeyringMaterial, msg: number[], s2?: number[]): IEncryptedAuthenticatedMessage {
    const encryptedMsg = aesEncrypt(skm.encryptionKey, msg);

    const tag = getMessageTag(this.params.hasherConstr, skm.macKey, encryptedMsg, s2);

    return {
      encryptedMsg,
      hmac: tag,
    };
  }
}
