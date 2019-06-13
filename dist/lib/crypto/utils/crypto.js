"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aes_js_1 = __importDefault(require("aes-js"));
var aesBlockSize = 16;
/**
 * Carries out CTR decryption using the AES cipher
 * @param key - decryption key
 * @param encodedMsg - encoded message with IV in first block
 */
function aesDecrypt(key, encodedMsg) {
    var iv = encodedMsg.slice(0, aesBlockSize);
    var content = encodedMsg.slice(aesBlockSize);
    var ctr = new aes_js_1.default.ModeOfOperation.ctr(key, new aes_js_1.default.Counter(iv));
    var result = ctr.decrypt(content);
    return result;
}
exports.aesDecrypt = aesDecrypt;
