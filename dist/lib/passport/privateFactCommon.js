"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var keccak256_1 = __importDefault(require("keccak256"));
var web3_utils_1 = require("web3-utils");
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
        Buffer.from(factProviderAddress.replace('0x', ''), 'hex'),
        Buffer.from(passportAddress.replace('0x', ''), 'hex'),
        Buffer.from(web3_utils_1.hexToBytes(web3_utils_1.asciiToHex(factKey)))
    ]);
}
/**
 * Unmarshals secret keyring material to encryption and MAC keys
 */
function unmarshalSecretKeyringMaterial(skm) {
    var keyLength = skm.length / 2;
    return {
        encryptionKey: skm.slice(0, keyLength),
        macKey: skm.slice(keyLength),
    };
}
exports.unmarshalSecretKeyringMaterial = unmarshalSecretKeyringMaterial;
//# sourceMappingURL=privateFactCommon.js.map