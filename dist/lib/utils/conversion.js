"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var web3_utils_1 = require("web3-utils");
/**
 * Converts hex string (with or without 0x) to byte array
 */
function hexToArray(hexString) {
    if (!hexString) {
        return [];
    }
    return Array.from(Buffer.from(hexString.replace('0x', ''), 'hex'));
}
exports.hexToArray = hexToArray;
/**
 * Converts padded hex string to unpadded ascii (meaning - removing zero bytes)
 * @param hexString
 */
function hexToUnpaddedAscii(hexString) {
    // TODO - remove web3-utils dependency
    return web3_utils_1.toAscii(hexString).replace(/\u0000/g, '');
}
exports.hexToUnpaddedAscii = hexToUnpaddedAscii;
/**
 * Converts hex string (with or without 0x) to boolean
 * Zero or empty value resolves to false. Other values resolves to true.
 */
function hexToBoolean(hexString) {
    if (!hexString) {
        return false;
    }
    return toBN(hexString).toNumber() !== 0;
}
exports.hexToBoolean = hexToBoolean;
/**
 * Converts given value to BN
 * Accepts:
 * - number - interpreted as decimal
 * - string - if with 0x prefix - hex, otherwise decimal
 * - BN
 * - bignumber.js object
 */
function toBN(value) {
    if (value === null || value === undefined) {
        return value;
    }
    if (bn_js_1.default.isBN(value)) {
        return value;
    }
    if (typeof value === 'string') {
        if (value.indexOf('0x') === 0) {
            return new bn_js_1.default(value.replace('0x', ''), 'hex');
        }
        return new bn_js_1.default(value, 10);
    }
    if (typeof value === 'number') {
        return new bn_js_1.default(value);
    }
    if (value.constructor && value.constructor.isBigNumber && value.constructor.isBigNumber(value)) {
        var hexValue = void 0;
        if (value.toHexString) {
            hexValue = value.toHexString();
        }
        else {
            hexValue = value.toString(16);
        }
        return new bn_js_1.default(hexValue.replace('0x', ''), 'hex');
    }
    return new bn_js_1.default(value);
}
exports.toBN = toBN;
/**
 * Converts given value to date. Any numerical representation is expected to be UNIX timestamp
 */
function toDate(value) {
    if (value === null || value === undefined) {
        return null;
    }
    return new Date(Number(value) * 1000);
}
exports.toDate = toDate;
