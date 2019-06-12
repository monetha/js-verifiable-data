"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var keccak256_1 = __importDefault(require("keccak256"));
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
    // take only part of MAC otherwise EncryptionKey + MACKey won't fit into 32 bytes array
    skm.macKey = skm.macKey.slice(0, skm.encryptionKey.length);
    var skmBytes = skm.encryptionKey.concat(skm.macKey);
    var skmHash = Array.from(keccak256_1.default(Buffer.from(skmBytes)));
    return {
        skm: skmBytes,
        skmHash: skmHash,
    };
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
