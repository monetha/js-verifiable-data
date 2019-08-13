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
var ErrorCode_1 = require("../errors/ErrorCode");
var SdkError_1 = require("../errors/SdkError");
var conversion_1 = require("../utils/conversion");
var tx_1 = require("../utils/tx");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var PrivateFactReader_1 = require("./PrivateFactReader");
// #endregion
/**
 * Class to read latest facts from the passport
 */
var FactReader = /** @class */ (function () {
    function FactReader(web3, passportAddress, options) {
        this.contract = new web3.eth.Contract(PassportLogic_json_1.default, passportAddress);
        this.options = options || {};
        this.web3 = web3;
    }
    Object.defineProperty(FactReader.prototype, "passportAddress", {
        get: function () { return this.contract.address; },
        enumerable: true,
        configurable: true
    });
    /**
     * Read string type fact from passport
     */
    FactReader.prototype.getString = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get('getString', factProviderAddress, key)];
            });
        });
    };
    /**
     * Read bytes type fact from passport
     */
    FactReader.prototype.getBytes = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('getBytes', factProviderAddress, key)];
                    case 1:
                        value = _a.sent();
                        if (!value) {
                            return [2 /*return*/, value];
                        }
                        return [2 /*return*/, this.web3.utils.hexToBytes(value)];
                }
            });
        });
    };
    /**
     * Read address type fact from passport
     */
    FactReader.prototype.getAddress = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get('getAddress', factProviderAddress, key)];
            });
        });
    };
    /**
     * Read uint type fact from passport
     */
    FactReader.prototype.getUint = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('getUint', factProviderAddress, key)];
                    case 1:
                        value = _a.sent();
                        if (!value) {
                            return [2 /*return*/, value];
                        }
                        return [2 /*return*/, value.toNumber()];
                }
            });
        });
    };
    /**
     * Read int type fact from passport
     */
    FactReader.prototype.getInt = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('getInt', factProviderAddress, key)];
                    case 1:
                        value = _a.sent();
                        if (!value) {
                            return [2 /*return*/, value];
                        }
                        return [2 /*return*/, value.toNumber()];
                }
            });
        });
    };
    /**
     * Read boolean type fact from passport
     */
    FactReader.prototype.getBool = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get('getBool', factProviderAddress, key)];
            });
        });
    };
    /**
     * Read TX data type fact from passport
     */
    FactReader.prototype.getTxdata = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var data, preparedKey, blockNum, events, txInfo, txDataString, txData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('getTxDataBlockNumber', factProviderAddress, key)];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            return [2 /*return*/, null];
                        }
                        preparedKey = this.web3.utils.fromAscii(key);
                        blockNum = conversion_1.toBN(data).toNumber();
                        return [4 /*yield*/, this.contract.getPastEvents('TxDataUpdated', {
                                fromBlock: blockNum,
                                toBlock: blockNum,
                                filter: {
                                    factProvider: factProviderAddress,
                                    key: preparedKey,
                                },
                            })];
                    case 2:
                        events = _a.sent();
                        if (!events || events.length === 0) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.DataNotFoundInBlock, "Event \"TxDataUpdated\", carrying the data, was not found in block " + blockNum + " referenced by fact in passport");
                        }
                        return [4 /*yield*/, tx_1.getDecodedTx(events[events.length - 1].transactionHash, this.web3, this.options)];
                    case 3:
                        txInfo = _a.sent();
                        txDataString = txInfo.methodInfo.params[1].value;
                        txData = this.web3.utils.hexToBytes(txDataString);
                        return [2 /*return*/, txData];
                }
            });
        });
    };
    /**
     * Read IPFS hash type fact from passport
     *
     * @param ipfs IPFS client
     *
     * @returns data stored in IPFS
     */
    FactReader.prototype.getIPFSData = function (factProviderAddress, key, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('getIPFSHash', factProviderAddress, key)];
                    case 1:
                        hash = _a.sent();
                        if (!hash) {
                            return [2 /*return*/, null];
                        }
                        // Get hash
                        return [2 /*return*/, ipfs.cat(hash)];
                }
            });
        });
    };
    /**
     * Read private data fact value using IPFS by decrypting it using passport owner private key.
     *
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    FactReader.prototype.getPrivateData = function (factProviderAddress, key, passportOwnerPrivateKey, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var privateReader, hashes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateReader = new PrivateFactReader_1.PrivateFactReader();
                        return [4 /*yield*/, this.getPrivateDataHashes(factProviderAddress, key)];
                    case 1:
                        hashes = _a.sent();
                        if (!hashes) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, privateReader.getPrivateData({
                                factProviderAddress: factProviderAddress,
                                passportAddress: this.passportAddress,
                                key: key,
                                value: hashes,
                            }, passportOwnerPrivateKey, ipfs)];
                }
            });
        });
    };
    /**
     * Read private data fact value using IPFS by decrypting it using secret key, generated at the time of writing.
     *
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    FactReader.prototype.getPrivateDataUsingSecretKey = function (factProviderAddress, key, secretKey, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var privateReader, hashes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateReader = new PrivateFactReader_1.PrivateFactReader();
                        return [4 /*yield*/, this.getPrivateDataHashes(factProviderAddress, key)];
                    case 1:
                        hashes = _a.sent();
                        if (!hashes) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, privateReader.getPrivateDataUsingSecretKey(hashes.dataIpfsHash, secretKey, ipfs)];
                }
            });
        });
    };
    /**
     * Read private data hashes fact from the passport.
     */
    FactReader.prototype.getPrivateDataHashes = function (factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var preparedKey, tx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preparedKey = this.web3.utils.fromAscii(key);
                        tx = this.contract.methods.getPrivateDataHashes(factProviderAddress, preparedKey);
                        return [4 /*yield*/, tx.call()];
                    case 1:
                        result = _a.sent();
                        if (!result.success) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                dataIpfsHash: result.dataIPFSHash,
                                dataKeyHash: result.dataKeyHash,
                            }];
                }
            });
        });
    };
    FactReader.prototype.get = function (method, factProviderAddress, key) {
        return __awaiter(this, void 0, void 0, function () {
            var preparedKey, func, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preparedKey = this.web3.utils.fromAscii(key);
                        func = this.contract.methods[method];
                        return [4 /*yield*/, func(factProviderAddress, preparedKey).call()];
                    case 1:
                        result = _a.sent();
                        // Return null in case if value was not initialized
                        if (!result || !result[0]) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, result[1]];
                }
            });
        });
    };
    return FactReader;
}());
exports.FactReader = FactReader;
