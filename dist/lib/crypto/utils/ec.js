"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts public key into the uncompressed form specified in section 4.3.6 of ANSI X9.62.
 */
function marshalPublicKey(publicKey) {
    var length = Math.floor((publicKey.ec.curve.red.prime.n + 7) / 8);
    // First byte - uncompressed point
    var result = [4];
    publicKey.getPublic('array');
}
exports.marshalPublicKey = marshalPublicKey;
