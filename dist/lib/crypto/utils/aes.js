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
function aesEncrypt(key, msg, rand) {
    return __awaiter(this, void 0, void 0, function () {
        var iv, ctr, encryptedMsg, ivPrefixedEncryptedMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateIV(rand)];
                case 1:
                    iv = _a.sent();
                    ctr = new aes_js_1.default.ModeOfOperation.ctr(key, new aes_js_1.default.Counter(iv));
                    encryptedMsg = Array.from(ctr.encrypt(msg));
                    ivPrefixedEncryptedMsg = iv.concat(encryptedMsg);
                    return [2 /*return*/, ivPrefixedEncryptedMsg];
            }
        });
    });
}
exports.aesEncrypt = aesEncrypt;
function generateIV(rand) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (rand) {
                return [2 /*return*/, rand(aesBlockSize)];
            }
            return [2 /*return*/, secure_random_1.default.randomArray(aesBlockSize)];
        });
    });
}
