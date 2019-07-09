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
Object.defineProperty(exports, "__esModule", { value: true });
var conversion_1 = require("../utils/conversion");
var getTxData_1 = require("../utils/getTxData");
var PrivateFactReader_1 = require("./PrivateFactReader");
// #endregion
/**
 * Class to read historic facts from the passport
 */
var FactHistoryReader = /** @class */ (function () {
    function FactHistoryReader(web3, options) {
        this.web3 = web3;
        this.options = options || {};
    }
    /**
     * Read string type fact from transaction
     */
    FactHistoryReader.prototype.getString = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setString');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: methodInfo.params[1].value,
                            }];
                }
            });
        });
    };
    /**
     * Read bytes type fact from transaction
     */
    FactHistoryReader.prototype.getBytes = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo, value, hexValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setBytes');
                        value = [];
                        hexValue = methodInfo.params[1].value;
                        if (hexValue) {
                            value = this.web3.utils.hexToBytes(hexValue);
                        }
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: value,
                            }];
                }
            });
        });
    };
    /**
     * Read address type fact from transaction
     */
    FactHistoryReader.prototype.getAddress = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setAddress');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: methodInfo.params[1].value,
                            }];
                }
            });
        });
    };
    /**
     * Read uint type fact from transaction
     */
    FactHistoryReader.prototype.getUint = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setUint');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: parseInt(methodInfo.params[1].value, 10),
                            }];
                }
            });
        });
    };
    /**
     * Read int type fact from transaction
     */
    FactHistoryReader.prototype.getInt = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setInt');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: parseInt(methodInfo.params[1].value, 10),
                            }];
                }
            });
        });
    };
    /**
     * Read boolean type fact from transaction
     */
    FactHistoryReader.prototype.getBool = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setBool');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: methodInfo.params[1].value,
                            }];
                }
            });
        });
    };
    /**
     * Read TX data type fact from transaction
     */
    FactHistoryReader.prototype.getTxdata = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setTxDataBlockNumber');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: this.web3.utils.hexToBytes(methodInfo.params[1].value),
                            }];
                }
            });
        });
    };
    /**
     * Read IPFS hash type fact from transaction
     * @param ipfs IPFS client
     *
     * @returns data stored in IPFS
     */
    FactHistoryReader.prototype.getIPFSData = function (txHash, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _b.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setIPFSHash');
                        _a = {
                            factProviderAddress: txInfo.tx.from,
                            passportAddress: txInfo.tx.to,
                            key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value)
                        };
                        return [4 /*yield*/, ipfs.cat(methodInfo.params[1].value)];
                    case 2: return [2 /*return*/, (_a.value = _b.sent(),
                            _a)];
                }
            });
        });
    };
    /**
     * Read decrypted private data fact from transaction.
     * Fact value is retrieved by IPFS hash from transaction data and decrypted using passport owner private key.
     *
     * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    FactHistoryReader.prototype.getPrivateData = function (txHash, passportOwnerPrivateKey, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var factData, privateReader, privateData, decryptedFactData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPrivateDataHashes(txHash)];
                    case 1:
                        factData = _a.sent();
                        privateReader = new PrivateFactReader_1.PrivateFactReader();
                        return [4 /*yield*/, privateReader.getPrivateData(factData, passportOwnerPrivateKey, ipfs)];
                    case 2:
                        privateData = _a.sent();
                        decryptedFactData = __assign({}, factData, { value: privateData });
                        return [2 /*return*/, decryptedFactData];
                }
            });
        });
    };
    /**
     * Read decrypted private data fact from transaction.
     * Fact value is retrieved by IPFS hash from transaction data and decrypted using secret key.
     *
     * @param secretKey secret key in hex, used for data decryption
     * @param ipfs IPFS client
     */
    FactHistoryReader.prototype.getPrivateDataUsingSecretKey = function (txHash, secretKey, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var factData, privateReader, privateData, decryptedFactData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPrivateDataHashes(txHash)];
                    case 1:
                        factData = _a.sent();
                        privateReader = new PrivateFactReader_1.PrivateFactReader();
                        return [4 /*yield*/, privateReader.getPrivateDataUsingSecretKey(factData.value.dataIpfsHash, secretKey, ipfs)];
                    case 2:
                        privateData = _a.sent();
                        decryptedFactData = __assign({}, factData, { value: privateData });
                        return [2 /*return*/, decryptedFactData];
                }
            });
        });
    };
    /**
     * Read private data hashes fact from transaction
     */
    FactHistoryReader.prototype.getPrivateDataHashes = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txInfo, methodInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTxData_1.getTxData(txHash, this.web3, this.options.txRetriever)];
                    case 1:
                        txInfo = _a.sent();
                        methodInfo = txInfo.methodInfo;
                        this.validateMethodSignature(methodInfo, 'setPrivateDataHashes');
                        return [2 /*return*/, {
                                factProviderAddress: txInfo.tx.from,
                                passportAddress: txInfo.tx.to,
                                key: conversion_1.hexToUnpaddedAscii(methodInfo.params[0].value),
                                value: {
                                    dataIpfsHash: methodInfo.params[1].value,
                                    dataKeyHash: methodInfo.params[2].value,
                                },
                            }];
                }
            });
        });
    };
    FactHistoryReader.prototype.validateMethodSignature = function (methodInfo, expectedName) {
        if (methodInfo.name !== expectedName) {
            throw new Error("Input method signature for transaction must be \"" + expectedName + "\". Got \"" + methodInfo.name + "\"");
        }
    };
    return FactHistoryReader;
}());
exports.FactHistoryReader = FactHistoryReader;
