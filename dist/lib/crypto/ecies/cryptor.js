"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hash_js_1 = require("hash.js");
var hmac_1 = require("../utils/hmac");
var compare_1 = require("../utils/compare");
var aes_1 = require("../utils/aes");
var standardCryptorParams = {
    aes128Sha256: {
        hasherConstr: hash_js_1.sha256,
        keyLength: 16,
    },
    aes256Sha256: {
        hasherConstr: hash_js_1.sha256,
        keyLength: 32,
    },
    aes256Sha384: {
        hasherConstr: hash_js_1.sha384,
        keyLength: 32,
    },
    aes256Sha512: {
        hasherConstr: hash_js_1.sha512,
        keyLength: 32,
    },
};
var Cryptor = /** @class */ (function () {
    function Cryptor(_curve) {
        // TODO: determine params from curve
        this.params = standardCryptorParams.aes128Sha256;
    }
    /**
     * Checks encrypted message HMAC and if it's valid decrypts the message.
     * s2 contains shared information that is not part of the ciphertext, it's fed into the MAC. If the
     * shared information parameters aren't being used, they should not be provided.
     */
    Cryptor.prototype.decryptAuth = function (skm, encAuthMsg, s2) {
        var tag = hmac_1.getMessageTag(this.params.hasherConstr, skm.macKey, encAuthMsg.encryptedMsg, s2);
        if (!compare_1.constantTimeCompare(encAuthMsg.hmac, tag)) {
            throw new Error('Invalid message');
        }
        return aes_1.aesDecrypt(skm.encryptionKey, encAuthMsg.encryptedMsg);
    };
    return Cryptor;
}());
exports.Cryptor = Cryptor;
