"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipfsFileNames = {
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
exports.ellipticCurveAlg = 'secp256k1';
function deriveSecretKeyringMaterial(ecies, publicKey, passAddress, factProviderAddress, factKey) {
    var seed = createSKMSeed(passAddress, factProviderAddress, factKey);
    var skm = ecies.deriveSecretKeyringMaterial(publicKey, seed);
    return null;
}
exports.deriveSecretKeyringMaterial = deriveSecretKeyringMaterial;
/**
 * Returns seed using [Provider Address + Passport Address + factKey] to derive secret keyring material and HMAC
 */
function createSKMSeed(passportAddress, factProviderAddress, factKey) {
    return Buffer.concat([
        Buffer.from(factProviderAddress, 'hex'),
        Buffer.from(passportAddress, 'hex'),
        Buffer.from(factKey, 'utf8')
    ]);
}
