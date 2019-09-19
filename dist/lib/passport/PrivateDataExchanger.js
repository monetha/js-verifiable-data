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
Object.defineProperty(exports, "__esModule", { value: true });
var abiDecoder = __importStar(require("abi-decoder"));
var bn_js_1 = __importDefault(require("bn.js"));
var elliptic_1 = require("elliptic");
var keccak256_1 = __importDefault(require("keccak256"));
var ecies_1 = require("../crypto/ecies/ecies");
var compare_1 = require("../crypto/utils/compare");
var ErrorCode_1 = require("../errors/ErrorCode");
var SdkError_1 = require("../errors/SdkError");
var proto_1 = require("../proto");
var conversion_1 = require("../utils/conversion");
var string_1 = require("../utils/string");
var tx_1 = require("../utils/tx");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var privateFactCommon_1 = require("./privateFactCommon");
var PrivateFactReader_1 = require("./PrivateFactReader");
var rawContracts_1 = require("./rawContracts");
var gasLimits = {
    accept: 90000,
    dispute: 60000,
    finish: 60000,
    propose: 500000,
    timeout: 60000,
};
var PrivateDataExchanger = /** @class */ (function () {
    function PrivateDataExchanger(web3, passportAddress, currentTimeGetter, options) {
        this.ec = new elliptic_1.ec(privateFactCommon_1.ellipticCurveAlg);
        this.web3 = web3;
        this.passportAddress = passportAddress;
        this.contract = rawContracts_1.initPassportLogicContract(web3, passportAddress);
        this.getCurrentTime = currentTimeGetter;
        if (!currentTimeGetter) {
            this.getCurrentTime = function () { return new Date(); };
        }
        this.options = options || {};
    }
    // #region -------------- Propose -------------------------------------------------------------------
    /**
     * Creates private data exchange proposition
     * @param factKey - fact key name to request data for
     * @param factProviderAddress - fact provider address
     * @param exchangeStakeWei - amount in WEI to stake
     * @param requesterAddress - data requester address (the one who will submit the transaction)
     * @param txExecutor - transaction executor function
     */
    PrivateDataExchanger.prototype.propose = function (factKey, factProviderAddress, exchangeStakeWei, requesterAddress, txExecutor, rand) {
        return __awaiter(this, void 0, void 0, function () {
            var ownerPublicKeyBytes, ownerPubKeyPair, ecies, exchangeKeyData, encryptedExchangeKey, txData, txConfig, receipt, logs, exchangeIdxData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new proto_1.PassportOwnership(this.web3, this.passportAddress, this.options).getOwnerPublicKey()];
                    case 1:
                        ownerPublicKeyBytes = _a.sent();
                        ownerPubKeyPair = this.ec.keyFromPublic(Buffer.from(ownerPublicKeyBytes));
                        return [4 /*yield*/, ecies_1.ECIES.createGenerated(this.ec, rand)];
                    case 2:
                        ecies = _a.sent();
                        exchangeKeyData = privateFactCommon_1.deriveSecretKeyringMaterial(ecies, ownerPubKeyPair, this.passportAddress, factProviderAddress, factKey);
                        encryptedExchangeKey = ecies.getPublicKey().getPublic('array');
                        txData = this.contract.methods.proposePrivateDataExchange(factProviderAddress, this.web3.utils.fromAscii(factKey), "0x" + Buffer.from(encryptedExchangeKey).toString('hex'), exchangeKeyData.skmHash);
                        return [4 /*yield*/, tx_1.prepareTxConfig(this.web3, requesterAddress, this.passportAddress, txData, exchangeStakeWei, gasLimits.propose)];
                    case 3:
                        txConfig = _a.sent();
                        return [4 /*yield*/, txExecutor(txConfig)];
                    case 4:
                        receipt = _a.sent();
                        // Parse exchange index from tx receipt
                        abiDecoder.addABI(PassportLogic_json_1.default);
                        logs = abiDecoder.decodeLogs(receipt.logs);
                        exchangeIdxData = logs[0].events.find(function (e) { return e.name === 'exchangeIdx'; });
                        if (!exchangeIdxData) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.MissingExchangeIdxInReceipt, 'Transaction receipt does not contain "exchangeIdx" in event logs');
                        }
                        return [2 /*return*/, {
                                exchangeIndex: new bn_js_1.default(exchangeIdxData.value, 10),
                                exchangeKey: exchangeKeyData.skm,
                                exchangeKeyHash: exchangeKeyData.skmHash,
                            }];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Accept -------------------------------------------------------------------
    /**
     * Accepts private data exchange proposition (should be called only by the passport owner)
     * @param exchangeIndex - data exchange index
     * @param txExecutor - transaction executor function
     */
    PrivateDataExchanger.prototype.accept = function (exchangeIndex, passportOwnerPrivateKey, ipfsClient, txExecutor) {
        return __awaiter(this, void 0, void 0, function () {
            var status, nearFuture, account, exchangePubKeyPair, passportOwnerPrivateKeyPair, ecies, exchangeKey, privateReader, dataSecretKey, encryptedDataSecretKey, txData, txConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatus(exchangeIndex)];
                    case 1:
                        status = _a.sent();
                        if (status.state !== ExchangeState.Proposed) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.StatusMustBeProposed, 'Status must be "proposed"');
                        }
                        nearFuture = this.getCurrentTime();
                        nearFuture.setTime(nearFuture.getTime() + 60 * 60 * 1000);
                        if (status.stateExpirationTime < nearFuture) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.ExchangeExpiredOrExpireSoon, 'Exchange is expired or will expire very soon');
                        }
                        // Check if private key belongs to passport owner
                        try {
                            account = this.web3.eth.accounts.privateKeyToAccount("0x" + passportOwnerPrivateKey.replace('0x', ''));
                            if (!string_1.ciEquals(account.address, status.passportOwnerAddress)) {
                                throw new Error();
                            }
                        }
                        catch (_b) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidPassportOwnerKey, 'Invalid passport owner private key');
                        }
                        exchangePubKeyPair = this.ec.keyPair({
                            pub: status.encryptedExchangeKey,
                        });
                        passportOwnerPrivateKeyPair = this.ec.keyPair({
                            priv: passportOwnerPrivateKey.replace('0x', ''),
                            privEnc: 'hex',
                        });
                        ecies = new ecies_1.ECIES(passportOwnerPrivateKeyPair);
                        exchangeKey = privateFactCommon_1.deriveSecretKeyringMaterial(ecies, exchangePubKeyPair, this.passportAddress, status.factProviderAddress, status.factKey);
                        // Is decrypted exchange key valid?
                        if (!compare_1.constantTimeCompare(status.exchangeKeyHash, exchangeKey.skmHash)) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidExchangeKeyHash, 'Exchange key hash in passport is invalid');
                        }
                        privateReader = new PrivateFactReader_1.PrivateFactReader();
                        return [4 /*yield*/, privateReader.decryptSecretKey(passportOwnerPrivateKeyPair, {
                                dataIpfsHash: status.dataIpfsHash,
                                dataKeyHash: "0x" + Buffer.from(status.dataKeyHash).toString('hex'),
                            }, status.factProviderAddress, this.passportAddress, status.factKey, ipfsClient)];
                    case 2:
                        dataSecretKey = _a.sent();
                        encryptedDataSecretKey = [];
                        exchangeKey.skm.forEach(function (value, i) {
                            // tslint:disable-next-line: no-bitwise
                            encryptedDataSecretKey[i] = dataSecretKey[i] ^ value;
                        });
                        txData = this.contract.methods.acceptPrivateDataExchange("0x" + exchangeIndex.toString('hex'), encryptedDataSecretKey);
                        return [4 /*yield*/, tx_1.prepareTxConfig(this.web3, status.passportOwnerAddress, this.passportAddress, txData, status.requesterStaked, gasLimits.accept)];
                    case 3:
                        txConfig = _a.sent();
                        return [4 /*yield*/, txExecutor(txConfig)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Timeout -------------------------------------------------------------------
    /**
     * Closes private data exchange after proposition has expired.
     * This can be called only by data exchange requester.
     * @param exchangeIndex - data exchange index
     * @param txExecutor - transaction executor function
     */
    PrivateDataExchanger.prototype.timeout = function (exchangeIndex, txExecutor) {
        return __awaiter(this, void 0, void 0, function () {
            var status, nowMinus1Min, txData, txConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatus(exchangeIndex)];
                    case 1:
                        status = _a.sent();
                        if (status.state !== ExchangeState.Proposed) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.StatusMustBeProposed, 'Status must be "proposed"');
                        }
                        nowMinus1Min = this.getCurrentTime();
                        nowMinus1Min.setTime(nowMinus1Min.getTime() - 60 * 1000);
                        if (status.stateExpirationTime > nowMinus1Min) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.CanOnlyCloseAfterExpiration, 'Exchange can only be closed after expiration date');
                        }
                        txData = this.contract.methods.timeoutPrivateDataExchange("0x" + exchangeIndex.toString('hex'));
                        return [4 /*yield*/, tx_1.prepareTxConfig(this.web3, status.requesterAddress, this.passportAddress, txData, 0, gasLimits.timeout)];
                    case 2:
                        txConfig = _a.sent();
                        return [4 /*yield*/, txExecutor(txConfig)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Dispute -------------------------------------------------------------------
    /**
     * Closes private data exchange after acceptance by dispute.
     * Can be called only by data exhange requester.
     * @param exchangeIndex - data exchange index
     * @param exchangeKey - exchange key, generated by requester when requesting proposal
     * @param txExecutor - transaction executor function
     */
    PrivateDataExchanger.prototype.dispute = function (exchangeIndex, exchangeKey, txExecutor) {
        return __awaiter(this, void 0, void 0, function () {
            var status, nearFuture, exchangeKeyHash, txData, txConfig, receipt, logs, event, params, success, cheater;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatus(exchangeIndex)];
                    case 1:
                        status = _a.sent();
                        if (status.state !== ExchangeState.Accepted) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.StatusMustBeAccepted, 'Status must be "accepted"');
                        }
                        nearFuture = this.getCurrentTime();
                        nearFuture.setTime(nearFuture.getTime() + 60 * 60 * 1000);
                        if (status.stateExpirationTime < nearFuture) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.ExchangeExpiredOrExpireSoon, 'Exchange is expired or will expire very soon');
                        }
                        exchangeKeyHash = Array.from(keccak256_1.default(Buffer.from(exchangeKey)));
                        if (!compare_1.constantTimeCompare(exchangeKeyHash, status.exchangeKeyHash)) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidExchangeKey, 'Invalid exchange key');
                        }
                        txData = this.contract.methods.disputePrivateDataExchange("0x" + exchangeIndex.toString('hex'), exchangeKey);
                        return [4 /*yield*/, tx_1.prepareTxConfig(this.web3, status.requesterAddress, this.passportAddress, txData, 0, gasLimits.dispute)];
                    case 2:
                        txConfig = _a.sent();
                        return [4 /*yield*/, txExecutor(txConfig)];
                    case 3:
                        receipt = _a.sent();
                        // Parse cheater address and dispute result
                        abiDecoder.addABI(PassportLogic_json_1.default);
                        logs = abiDecoder.decodeLogs(receipt.logs);
                        event = logs.find(function (l) { return l.name === 'PrivateDataExchangeDisputed'; });
                        params = event.events;
                        success = params.find(function (e) { return e.name === 'successful'; });
                        if (success === undefined) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.MissingSuccessfulInReceipt, 'Transaction receipt does not contain "successful" in event logs');
                        }
                        cheater = params.find(function (e) { return e.name === 'cheater'; });
                        if (cheater === undefined) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.MissingCheaterInReceipt, 'Transaction receipt does not contain "cheater" in event logs');
                        }
                        return [2 /*return*/, {
                                cheaterAddress: cheater.value,
                                success: conversion_1.hexToBoolean(cheater.successful),
                            }];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Finish -------------------------------------------------------------------
    /**
     * Closes private data exchange after acceptance. It's supposed to be called by the data requester,
     * but passport owner can also call it after data exchange is expired.
     * @param exchangeIndex - data exchange index
     * @param requesterOrPassOwnerAddress - address of requester or passport owner (the one who will execute the transaction)
     * @param txExecutor - transaction executor function
     */
    PrivateDataExchanger.prototype.finish = function (exchangeIndex, requesterOrPassOwnerAddress, txExecutor) {
        return __awaiter(this, void 0, void 0, function () {
            var status, nowMinus1Min, txData, txConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatus(exchangeIndex)];
                    case 1:
                        status = _a.sent();
                        // Status should be accepted
                        if (status.state !== ExchangeState.Accepted) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.StatusMustBeAccepted, 'Status must be "accepted"');
                        }
                        if (string_1.ciEquals(requesterOrPassOwnerAddress, status.passportOwnerAddress)) {
                            nowMinus1Min = this.getCurrentTime();
                            nowMinus1Min.setTime(nowMinus1Min.getTime() - 60 * 1000);
                            if (status.stateExpirationTime > nowMinus1Min) {
                                throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.PassOwnerCanCloseOnlyAfterExpiration, 'Passport owner can close exchange only after expiration date');
                            }
                        }
                        else if (!string_1.ciEquals(requesterOrPassOwnerAddress, status.requesterAddress)) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.OnlyExchangeParticipantsCanClose, 'Only exchange participants can close the exchange');
                        }
                        txData = this.contract.methods.finishPrivateDataExchange("0x" + exchangeIndex.toString('hex'));
                        return [4 /*yield*/, tx_1.prepareTxConfig(this.web3, requesterOrPassOwnerAddress, this.passportAddress, txData, 0, gasLimits.finish)];
                    case 2:
                        txConfig = _a.sent();
                        return [4 /*yield*/, txExecutor(txConfig)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Status -------------------------------------------------------------------
    /**
     * Returns the status of private data exchange
     * @param exchangeIndex - data exchange index
     */
    PrivateDataExchanger.prototype.getStatus = function (exchangeIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var rawStatus, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.methods.privateDataExchanges("0x" + exchangeIndex.toString('hex')).call()];
                    case 1:
                        rawStatus = _a.sent();
                        status = {
                            dataIpfsHash: rawStatus.dataIPFSHash,
                            encryptedExchangeKey: conversion_1.hexToArray(rawStatus.encryptedExchangeKey),
                            dataKeyHash: conversion_1.hexToArray(rawStatus.dataKeyHash),
                            encryptedDataKey: conversion_1.hexToArray(rawStatus.encryptedDataKey),
                            exchangeKeyHash: conversion_1.hexToArray(rawStatus.exchangeKeyHash),
                            factKey: conversion_1.hexToUnpaddedAscii(rawStatus.key),
                            factProviderAddress: rawStatus.factProvider,
                            passportOwnerAddress: rawStatus.passportOwner,
                            passportOwnerStaked: conversion_1.toBN(rawStatus.passportOwnerValue),
                            requesterAddress: rawStatus.dataRequester,
                            requesterStaked: conversion_1.toBN(rawStatus.dataRequesterValue),
                            state: Number(rawStatus.state),
                            stateExpirationTime: conversion_1.toDate(rawStatus.stateExpired),
                        };
                        return [2 /*return*/, status];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Read data -------------------------------------------------------------------
    /**
     * Gets decrypted private data from IPFS by using exchange key.
     * Encrypted secret data encryption key is retrieved from private data exchange and then is decrypted using provided exchangeKey.
     * Then this decrypted secret key is used to decrypt private data, stored in IPFS.
     * @param exchangeIndex - data exchange index
     * @param exchangeKey - exchange key, which is generated and known by data requester
     * @param ipfsClient - IPFS client for private data retrieval
     */
    PrivateDataExchanger.prototype.getPrivateData = function (exchangeIndex, exchangeKey, ipfsClient) {
        return __awaiter(this, void 0, void 0, function () {
            var status, exchangeKeyHash, dataSecretKey, dataSecretKeyHash, reader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatus(exchangeIndex)];
                    case 1:
                        status = _a.sent();
                        // Status should be accepted or closed
                        if (status.state !== ExchangeState.Accepted && status.state !== ExchangeState.Closed) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.StatusMustBeAcceptedOrClosed, 'Exchange status must be "accepted" or "closed"');
                        }
                        exchangeKeyHash = Array.from(keccak256_1.default(Buffer.from(exchangeKey)));
                        if (!compare_1.constantTimeCompare(exchangeKeyHash, status.exchangeKeyHash)) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidExchangeKey, 'Invalid exchange key');
                        }
                        dataSecretKey = [];
                        status.encryptedDataKey.forEach(function (value, i) {
                            // tslint:disable-next-line: no-bitwise
                            dataSecretKey[i] = exchangeKey[i] ^ value;
                        });
                        dataSecretKeyHash = Array.from(keccak256_1.default(Buffer.from(dataSecretKey)));
                        if (!compare_1.constantTimeCompare(dataSecretKeyHash, status.dataKeyHash)) {
                            throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidDecryptedSecretDataKey, 'Decrypted secret data key is invalid');
                        }
                        reader = new PrivateFactReader_1.PrivateFactReader();
                        return [2 /*return*/, reader.decryptPrivateData(status.dataIpfsHash, dataSecretKey, null, ipfsClient)];
                }
            });
        });
    };
    return PrivateDataExchanger;
}());
exports.PrivateDataExchanger = PrivateDataExchanger;
var ExchangeState;
(function (ExchangeState) {
    ExchangeState[ExchangeState["Closed"] = 0] = "Closed";
    ExchangeState[ExchangeState["Proposed"] = 1] = "Proposed";
    ExchangeState[ExchangeState["Accepted"] = 2] = "Accepted";
})(ExchangeState = exports.ExchangeState || (exports.ExchangeState = {}));
// #endregion
