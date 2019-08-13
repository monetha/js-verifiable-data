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
var abiDecoder = __importStar(require("abi-decoder"));
var bn_js_1 = __importDefault(require("bn.js"));
var ethereumjs_tx_1 = __importDefault(require("ethereumjs-tx"));
var ethereumjs_util_1 = __importDefault(require("ethereumjs-util"));
var SdkError_1 = require("../errors/SdkError");
var proto_1 = require("../proto");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
/**
 * Gets transaction by hash and recovers its sender public key
 */
exports.getDecodedTx = function (txHash, web3, options) { return __awaiter(_this, void 0, void 0, function () {
    var tx, senderPublicKey, retrievedTx, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(options && options.txRetriever)) return [3 /*break*/, 2];
                return [4 /*yield*/, options.txRetriever(txHash, web3)];
            case 1:
                retrievedTx = _a.sent();
                if (retrievedTx) {
                    if (!retrievedTx.senderPublicKey) {
                        throw SdkError_1.createSdkError(proto_1.ErrorCode.MissingSenderPublicKey, 'Specified txRetriever did not return required senderPublicKey property');
                    }
                    senderPublicKey = retrievedTx.senderPublicKey;
                    tx = retrievedTx.tx;
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, web3.eth.getTransaction(txHash)];
            case 3:
                tx = _a.sent();
                if (tx) {
                    senderPublicKey = exports.getSenderPublicKey(tx);
                }
                _a.label = 4;
            case 4:
                if (!tx) {
                    throw SdkError_1.createSdkError(proto_1.ErrorCode.TxNotFound, 'Transaction was not found');
                }
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
exports.getSenderPublicKey = function (tx) {
    var ethTx = new ethereumjs_tx_1.default({
        nonce: tx.nonce,
        gasPrice: ethereumjs_util_1.default.bufferToHex(new bn_js_1.default(tx.gasPrice).toBuffer()),
        gasLimit: tx.gas,
        to: tx.to,
        value: ethereumjs_util_1.default.bufferToHex(new bn_js_1.default(tx.value).toBuffer()),
        data: tx.input,
        r: tx.r,
        s: tx.s,
        v: tx.v,
    });
    // To be a valid EC public key - it must be prefixed with byte 4
    return Buffer.concat([Buffer.from([4]), ethTx.getSenderPublicKey()]);
};
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
exports.prepareTxConfig = function (web3, from, to, data, value, gasLimit) {
    if (value === void 0) { value = 0; }
    return __awaiter(_this, void 0, void 0, function () {
        var nonce, gasPrice, actualGasLimit, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(from)];
                case 1:
                    nonce = _b.sent();
                    return [4 /*yield*/, web3.eth.getGasPrice()];
                case 2:
                    gasPrice = _b.sent();
                    if (!(gasLimit > 0 || gasLimit === 0)) return [3 /*break*/, 3];
                    _a = gasLimit;
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, web3.eth.estimateGas({
                        data: data.encodeABI(),
                        from: from,
                        to: to,
                        value: value,
                    })];
                case 4:
                    _a = _b.sent();
                    _b.label = 5;
                case 5:
                    actualGasLimit = _a;
                    return [2 /*return*/, {
                            from: from,
                            to: to,
                            nonce: nonce,
                            gasPrice: gasPrice,
                            gas: actualGasLimit,
                            value: value,
                            data: data.encodeABI(),
                        }];
            }
        });
    });
};
