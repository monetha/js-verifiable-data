import { ECIES } from '../crypto/ecies/ecies';
import { ec } from 'elliptic';

export const ipfsFileNames = {
  /**
   * Public key in IPFS
   */
  publicKey: 'public_key',

  /**
   * Encrypted message
   */
  encryptedMessage: 'encrypted_message',

  /**
   * Hashed MAC (Message Authentication Code)
   */
  messageHMAC: 'hmac',
};

export const ellipticCurveAlg = 'secp256k1';

export function deriveSecretKeyringMaterial(
  ecies: ECIES,
  publicKey: ec.KeyPair,
  passAddress: string,
  factProviderAddress: string,
  factKey: string,
) {
  const seed = createSKMSeed(passAddress, factProviderAddress, factKey);

  const skm = ecies.deriveSecretKeyringMaterial(publicKey, seed);

  return null;
}

/**
 * Returns seed using [Provider Address + Passport Address + factKey] to derive secret keyring material and HMAC
 */
function createSKMSeed(passportAddress: string, factProviderAddress: string, factKey: string) {
  return Buffer.concat([
    Buffer.from(factProviderAddress, 'hex'),
    Buffer.from(passportAddress, 'hex'),
    Buffer.from(factKey, 'utf8')]);
}
