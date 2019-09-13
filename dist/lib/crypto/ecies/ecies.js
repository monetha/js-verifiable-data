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
var kdf_1 = require("./kdf");
exports.keyLength = 16;
/**
 * Implements Elliptic Curve Integrated Encryption Scheme
 */
var ECIES = /** @class */ (function () {
    function ECIES(privateKeyPair) {
        this.privateKeyPair = privateKeyPair;
    }
    ECIES.createGenerated = function (ellipticCurve, rand) {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a, keyPair;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!rand) return [3 /*break*/, 2];
                        _a = {};
                        return [4 /*yield*/, rand(ellipticCurve.hash.hmacStrength)];
                    case 1:
                        options = (_a.entropy = _b.sent(),
                            _a);
                        _b.label = 2;
                    case 2:
                        keyPair = ellipticCurve.genKeyPair(options);
                        return [2 /*return*/, new ECIES(keyPair)];
                }
            });
        });
    };
    /**
     * Derives secret keyring material by computing shared secret from private and public keys and
     * passing it as a parameter to the KDF.
     * @param publicKey
     * @param s1 - seed for key derivation function
     */
    ECIES.prototype.deriveSecretKeyringMaterial = function (publicKey, s1) {
        if (this.privateKeyPair.getPublic().curve !== publicKey.ec.curve) {
            throw new Error('Invalid curve');
        }
        var sharedKey = this.generateShared(publicKey, exports.keyLength, exports.keyLength);
        var hashConstr = hash_js_1.sha256;
        var key = kdf_1.concatKDF(hashConstr, Buffer.from(sharedKey.toArray()), s1, exports.keyLength * 2);
        var encKey = key.slice(0, exports.keyLength);
        var macKey = key.slice(exports.keyLength);
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
