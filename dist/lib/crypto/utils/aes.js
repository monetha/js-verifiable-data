"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aes_js_1 = __importDefault(require("aes-js"));
var secure_random_1 = __importDefault(require("secure-random"));
var aesBlockSize = 16;
/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param ivPrefixedEncryptedMsg - encoded message with IV in first block
 */
function aesDecrypt(key, ivPrefixedEncryptedMsg) {
    var iv = ivPrefixedEncryptedMsg.slice(0, aesBlockSize);
    var content = ivPrefixedEncryptedMsg.slice(aesBlockSize);
    var ctr = new aes_js_1.default.ModeOfOperation.ctr(key, new aes_js_1.default.Counter(iv));
    var result = Array.from(ctr.decrypt(content));
    return result;
}
exports.aesDecrypt = aesDecrypt;
/**
 * Carries out CTR encryption using AES cipher
 * @param key - encryption key
 * @param msg - message to encode
 * @returns encrypted message, prefixed with IV at the first block
 */
function aesEncrypt(key, msg) {
    var iv = generateIV();
    var ctr = new aes_js_1.default.ModeOfOperation.ctr(key, new aes_js_1.default.Counter(iv));
    var encryptedMsg = Array.from(ctr.encrypt(msg));
    var ivPrefixedEncryptedMsg = iv.concat(encryptedMsg);
    return ivPrefixedEncryptedMsg;
}
exports.aesEncrypt = aesEncrypt;
function generateIV() {
    return secure_random_1.default.randomArray(aesBlockSize);
}
//# sourceMappingURL=aes.js.map