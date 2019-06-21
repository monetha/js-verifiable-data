"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_utils_1 = require("web3-utils");
/**
 * Converts hex string (with or without 0x) to byte array
 */
function hexToArray(hexString) {
    if (!hexString) {
        return [];
    }
    return Array.from(Buffer.from(hexString.replace('0x', '')));
}
exports.hexToArray = hexToArray;
/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
function hexToUnpaddedAscii(hexString) {
    return web3_utils_1.toAscii(hexString).replace(/\u0000/g, '');
}
exports.hexToUnpaddedAscii = hexToUnpaddedAscii;
