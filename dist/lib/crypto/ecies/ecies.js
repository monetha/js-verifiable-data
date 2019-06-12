"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hash_js_1 = require("hash.js");
var kdf_1 = require("./kdf");
var keyLength = 16;
/**
 * implements Elliptic Curve Integrated Encryption Scheme
 */
var ECIES = /** @class */ (function () {
    function ECIES(privateKeyPair) {
        this.privateKeyPair = privateKeyPair;
    }
    /**
     * derives secret keyring material by computing shared secret from private and public keys and
     * passing it as a parameter to the KDF.
     * @param publicKey
     * @param s1 - seed for key derivation function
     */
    ECIES.prototype.deriveSecretKeyringMaterial = function (publicKey, s1) {
        if (this.privateKeyPair.getPublic().curve !== publicKey.ec.curve) {
            throw new Error('Invalid curve');
        }
        var sharedKey = this.generateShared(publicKey, keyLength, keyLength);
        var hashConstr = hash_js_1.sha256;
        var key = kdf_1.concatKDF(hashConstr, Buffer.from(sharedKey.toArray()), s1, keyLength * 2);
        var encKey = key.slice(0, keyLength);
        var macKey = key.slice(keyLength);
        macKey = hashConstr().update(macKey).digest();
        return {
            encryptionKey: encKey,
            macKey: macKey,
        };
    };
    /**
     * Generates shared secret keys for encryption using ECDH key agreement protocol.
     * @param publicKey
     * @param skLength
     * @param macLength
     */
    ECIES.prototype.generateShared = function (publicKey, skLength, macLength) {
        if (this.privateKeyPair.getPublic().curve !== publicKey.ec.curve) {
            throw new Error('Invalid curve');
        }
        if (skLength + macLength > this.maxSharedKeyLength(publicKey)) {
            throw new Error('Shared key length is too big');
        }
        return this.privateKeyPair.derive(publicKey.getPublic());
    };
    /**
     * Returns the maximum length of the shared key the public key can produce.
     */
    ECIES.prototype.getMaxSharedKeyLength = function () {
        return this.maxSharedKeyLength(this.getPublicKey());
    };
    /**
     * Returns the maximum length of the shared key the public key can produce.
     */
    ECIES.prototype.maxSharedKeyLength = function (publicKey) {
        return Math.floor((publicKey.ec.curve.red.prime.n + 7) / 8);
    };
    ECIES.prototype.getPublicKey = function () {
        return this.privateKeyPair.ec.keyFromPublic(this.privateKeyPair.getPublic('hex'), 'hex');
    };
    return ECIES;
}());
exports.ECIES = ECIES;
