"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("@harmony-js/crypto"));
var abiDecoder = __importStar(require("abi-decoder"));
var bn_js_1 = __importDefault(require("bn.js"));
var elliptic_1 = __importDefault(require("elliptic"));
var SdkError_1 = require("../errors/SdkError");
var proto_1 = require("../proto");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var secp256k1 = elliptic_1.default.ec('secp256k1');
/**
 * Gets transaction by hash and recovers its sender public key
 */
exports.getDecodedTx = function (harmony, txHash) { return __awaiter(_this, void 0, void 0, function () {
    var tx, senderPublicKey, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, harmony.blockchain.getTransactionByHash({ txnHash: txHash })];
            case 1:
                tx = (_a.sent()).result;
                if (!tx) {
                    throw SdkError_1.createSdkError(proto_1.ErrorCode.TxNotFound, 'Transaction was not found');
                }
                senderPublicKey = exports.getSenderPublicKey(harmony, tx);
                abiDecoder.addABI(PassportLogic_json_1.default);
                result = {
                    tx: tx,
                    methodInfo: abiDecoder.decodeMethod(tx.input),
                    senderPublicKey: senderPublicKey,
                };
                return [2 /*return*/, result];
        }
    });
}); };
/**
 * Gets sender's elliptic curve public key (prefixed with byte 4)
 */
exports.getSenderPublicKey = function (harmony, tx) {
    var signature = {
        r: tx.r,
        v: tx.v,
        s: tx.s,
    };
    var hmyTx = harmony.transactions.newTx({
        from: tx.from,
        nonce: tx.nonce,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gas,
        shardID: tx.shardID,
        to: tx.to,
        value: tx.value,
        data: tx.input,
        signature: signature,
    });
    var txSignature = hmyTx.txParams.signature;
    var chainId = hmyTx.txParams.chainId;
    var _a = hmyTx.getRLPUnsigned(), _ = _a[0], unsignedArr = _a[1];
    // Strip r, s, v
    var rawTxNoSig = unsignedArr.slice(0, 8);
    var recoveryParam = txSignature.v - 27;
    if (chainId !== 0) {
        rawTxNoSig.push(crypto.hexlify(chainId));
        rawTxNoSig.push('0x');
        rawTxNoSig.push('0x');
        recoveryParam -= chainId * 2 + 8;
    }
    var digest = crypto.keccak256(crypto.encode(rawTxNoSig));
    var splittedSig = crypto.splitSignature({
        r: signature.r,
        s: signature.s,
        recoveryParam: recoveryParam,
    });
    var rs = { r: crypto.arrayify(splittedSig.r), s: crypto.arrayify(splittedSig.s) };
    var recovered = secp256k1.recoverPubKey(crypto.arrayify(digest), rs, splittedSig.recoveryParam);
    var key = recovered.encode('hex', false);
    var ecKey = secp256k1.keyFromPublic(key, 'hex');
    var publicKey = ecKey.getPublic(false, 'hex');
    return Buffer.from(publicKey, 'hex');
};
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
exports.configureSendMethod = function (harmony, method, from, params) { return __awaiter(_this, void 0, void 0, function () {
    var txConfig;
    return __generator(this, function (_a) {
        txConfig = __assign({}, (params || {}));
        txConfig.from = from;
        // TODO: Handle nonce internally (maybe it is already handled by contract object?)
        // if (!txConfig.nonce) {
        //   txConfig.nonce = (await harmony.blockchain.getTransactionCount({ address: from })).result;
        // }
        if (!txConfig.gasPrice) {
            txConfig.gasPrice = new bn_js_1.default('100000000000'); // (await harmony.blockchain.gasPrice()).result; <-- Always returns 0x1 so just hardcode it
        }
        if (!txConfig.gasLimit) {
            txConfig.gasLimit = new bn_js_1.default('5100000'); // (await method.estimateGas()).result;  <-- NOT IMPLEMENTED IN HARMONY
        }
        return [2 /*return*/, {
                method: method,
                txConfig: txConfig,
            }];
    });
}); };
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
exports.callMethod = function (method) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, method.call({
                gasPrice: new bn_js_1.default('100000000000'),
                gasLimit: new bn_js_1.default('5100000'),
            })];
    });
}); };
