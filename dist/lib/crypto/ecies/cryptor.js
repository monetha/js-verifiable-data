"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    /**
     * EncryptAuth encrypts message using provided secret keyring material and returns encrypted message with the HMAC.
     * s2 contains shared information that is not part of the resulting ciphertext, it's fed into the MAC. If the
     * shared information parameters aren't being used, they should not be provided.
     */
    Cryptor.prototype.encryptAuth = function (skm, msg, s2, rand) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedMsg, tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, aes_1.aesEncrypt(skm.encryptionKey, msg, rand)];
                    case 1:
                        encryptedMsg = _a.sent();
                        tag = hmac_1.getMessageTag(this.params.hasherConstr, skm.macKey, encryptedMsg, s2);
                        return [2 /*return*/, {
                                encryptedMsg: encryptedMsg,
                                hmac: tag,
                            }];
                }
            });
        });
    };
    return Cryptor;
}());
exports.Cryptor = Cryptor;
