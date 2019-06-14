import { ec, } from 'elliptic';
import BN from 'bn.js';
import { sha256 } from 'hash.js';
import { concatKDF } from './kdf';

export const keyLength = 16;

export interface ISecretKeyringMaterial {
  encryptionKey: number[];
  macKey: number[];
}

/**
 * implements Elliptic Curve Integrated Encryption Scheme
 */
export class ECIES {
  private privateKeyPair: ec.KeyPair;

  public constructor(privateKeyPair: ec.KeyPair) {
    this.privateKeyPair = privateKeyPair;
  }

  public static createGenerated(ellipticCurve: ec) {
    const keyPair = ellipticCurve.genKeyPair();
    return new ECIES(keyPair);
  }

  /**
   * derives secret keyring material by computing shared secret from private and public keys and
   * passing it as a parameter to the KDF.
   * @param publicKey
   * @param s1 - seed for key derivation function
   */
  public deriveSecretKeyringMaterial(publicKey: ec.KeyPair, s1: Buffer): ISecretKeyringMaterial {
    if (this.privateKeyPair.getPublic().curve !== publicKey.ec.curve) {
      throw new Error('Invalid curve');
    }

    const sharedKey = this.generateShared(publicKey, keyLength, keyLength);
    const hashConstr = sha256;

    const key = concatKDF(hashConstr, Buffer.from(sharedKey.toArray()), s1, keyLength * 2);

    const encKey = key.slice(0, keyLength);
    let macKey = key.slice(keyLength);

    macKey = hashConstr().update(macKey).digest();

    return {
      encryptionKey: encKey,
      macKey,
    };
  }

  /**
   * Generates shared secret keys for encryption using ECDH key agreement protocol.
   * @param publicKey
   * @param skLength
   * @param macLength
   */
  public generateShared(publicKey: ec.KeyPair, skLength: number, macLength: number): BN {
    if (this.privateKeyPair.getPublic().curve !== publicKey.ec.curve) {
      throw new Error('Invalid curve');
    }

    if (skLength + macLength > this.maxSharedKeyLength(publicKey)) {
      throw new Error('Shared key length is too big');
    }

    return this.privateKeyPair.derive(publicKey.getPublic());
  }

  /**
   * Returns the maximum length of the shared key the public key can produce.
   */
  public getMaxSharedKeyLength() {
    return this.maxSharedKeyLength(this.getPublicKey());
  }

  /**
   * Returns the maximum length of the shared key the public key can produce.
   */
  private maxSharedKeyLength(publicKey: ec.KeyPair) {
    return Math.floor((publicKey.ec.curve.red.prime.n + 7) / 8);
  }

  public getPublicKey() {
    return this.privateKeyPair.ec.keyFromPublic(this.privateKeyPair.getPublic('hex'), 'hex');
  }
}
