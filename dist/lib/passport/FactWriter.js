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
var ContractIO_1 = require("../transactionHelpers/ContractIO");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var PrivateFactWriter_1 = require("./PrivateFactWriter");
/**
 * Class to write facts to passport
 */
var FactWriter = /** @class */ (function () {
    function FactWriter(web3, passportAddress, options) {
        this.contractIO = new ContractIO_1.ContractIO(web3, PassportLogic_json_1.default, passportAddress);
        this.options = options || {};
    }
    Object.defineProperty(FactWriter.prototype, "web3", {
        get: function () { return this.contractIO.getWeb3(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FactWriter.prototype, "passportAddress", {
        get: function () { return this.contractIO.getContractAddress(); },
        enumerable: true,
        configurable: true
    });
    /**
     * Writes string type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setString = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setString', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes bytes type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setBytes = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setBytes', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes address type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setAddress = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setAddress', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes uint type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setUint = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setUint', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes int type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setInt = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setInt', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes boolean type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setBool = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setBool', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes TX data type fact to passport
     *
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setTxdata = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set('setTxDataBlockNumber', key, value, factProviderAddress)];
            });
        });
    };
    /**
     * Writes IPFS hash data type fact to passport
     *
     * @param key fact key
     * @param value value to store on IPFS
     * @param ipfs IPFS client
     */
    FactWriter.prototype.setIPFSData = function (key, value, factProviderAddress, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ipfs.add(value)];
                    case 1:
                        result = _a.sent();
                        if (Array.isArray(result)) {
                            result = result[0];
                        }
                        if (!result || !result.Hash) {
                            throw new Error('Returned result from IPFS file adding is not as expected. Result object should contain property "hash"');
                        }
                        return [2 /*return*/, this.set('setIPFSHash', key, result.Hash, factProviderAddress)];
                }
            });
        });
    };
    /**
     * Writes private data value to IPFS by encrypting it and then storing IPFS hashes of encrypted data to passport fact.
     * Data can be decrypted using passport owner's wallet private key or a secret key which is returned as a result of this call.
     * @param key fact key
     * @param value value to store privately
     * @param ipfs IPFS client
     */
    FactWriter.prototype.setPrivateData = function (key, value, factProviderAddress, ipfs) {
        return __awaiter(this, void 0, void 0, function () {
            var privateWriter;
            return __generator(this, function (_a) {
                privateWriter = new PrivateFactWriter_1.PrivateFactWriter(this, this.options);
                return [2 /*return*/, privateWriter.setPrivateData(factProviderAddress, key, value, ipfs)];
            });
        });
    };
    /**
     * Writes IPFS hash of encrypted private data and hash of data encryption key
     * @param key fact key
     * @param value value to store
     */
    FactWriter.prototype.setPrivateDataHashes = function (key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var preparedKey, contract, tx;
            return __generator(this, function (_a) {
                preparedKey = this.web3.utils.fromAscii(key);
                contract = this.contractIO.getContract();
                tx = contract.methods.setPrivateDataHashes(preparedKey, value.dataIpfsHash, value.dataKeyHash);
                return [2 /*return*/, this.contractIO.prepareRawTX(factProviderAddress, contract.address, 0, tx)];
            });
        });
    };
    FactWriter.prototype.set = function (method, key, value, factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var preparedKey;
            return __generator(this, function (_a) {
                preparedKey = this.web3.utils.fromAscii(key);
                return [2 /*return*/, this.contractIO.prepareCallTX(method, [preparedKey, value], factProviderAddress)];
            });
        });
    };
    return FactWriter;
}());
exports.FactWriter = FactWriter;
