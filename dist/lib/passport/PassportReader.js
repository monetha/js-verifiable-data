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
var ethereum_1 = require("../const/ethereum");
var fetchEvents_1 = require("../utils/fetchEvents");
var sanitizeAddress_1 = require("../utils/sanitizeAddress");
var PassportReader = /** @class */ (function () {
    function PassportReader(web3, ethNetworkUrl) {
        this.web3 = web3;
        this.ethNetworkUrl = ethNetworkUrl;
    }
    /**
     * Fetches all passport addresses created by a particular passport factory address
     *
     * @param factoryAddress address of passport factory to get passports for
     * @param startBlock block nr to scan from
     * @param endBlock block nr to scan to
     */
    PassportReader.prototype.getPassportsList = function (factoryAddress, startBlock, endBlock) {
        if (startBlock === void 0) { startBlock = ethereum_1.MIN_BLOCK; }
        if (endBlock === void 0) { endBlock = ethereum_1.MAX_BLOCK; }
        return __awaiter(this, void 0, void 0, function () {
            var events, passportRefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchEvents_1.fetchEvents(this.ethNetworkUrl, startBlock, endBlock, factoryAddress)];
                    case 1:
                        events = _a.sent();
                        passportRefs = events.map(function (event) { return ({
                            blockNumber: event.blockNumber,
                            blockHash: event.blockHash,
                            txHash: event.transactionHash,
                            passportAddress: event.topics[1] ? sanitizeAddress_1.sanitizeAddress(event.topics[1].slice(26)) : '',
                            ownerAddress: event.topics[2] ? sanitizeAddress_1.sanitizeAddress(event.topics[2].slice(26)) : '',
                        }); });
                        return [2 /*return*/, passportRefs];
                }
            });
        });
    };
    /**
     * Fetches all the events (history) of a particular passport address
     *
     * @param passportAddress address of passport to get events for
     * @param filter passport history filter
     */
    PassportReader.prototype.readPassportHistory = function (passportAddress, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var startBlock, endBlock, filterFactProviderAddress, filterKey, events, historyEvents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startBlock = filter && filter.startBlock || ethereum_1.MIN_BLOCK;
                        endBlock = filter && filter.endBlock || ethereum_1.MAX_BLOCK;
                        filterFactProviderAddress = filter && filter.factProviderAddress;
                        filterKey = filter && filter.key;
                        return [4 /*yield*/, fetchEvents_1.fetchEvents(this.ethNetworkUrl, startBlock, endBlock, passportAddress)];
                    case 1:
                        events = _a.sent();
                        historyEvents = [];
                        events.forEach(function (event) {
                            if (!event) {
                                return;
                            }
                            var blockNumber = event.blockNumber, transactionHash = event.transactionHash, topics = event.topics;
                            var factProviderAddress = topics[1] ? sanitizeAddress_1.sanitizeAddress(topics[1].slice(26)) : '';
                            var key = topics[2] ? _this.web3.utils.toAscii(topics[2].slice(0, 23)) : '';
                            if (filterFactProviderAddress !== undefined && filterFactProviderAddress !== null && filterFactProviderAddress !== factProviderAddress) {
                                return;
                            }
                            if (filterKey !== undefined && filterKey !== null && filterKey !== key) {
                                return;
                            }
                            historyEvents.push({
                                blockNumber: blockNumber,
                                transactionHash: transactionHash,
                                factProviderAddress: factProviderAddress,
                                key: key,
                            });
                        });
                        return [2 /*return*/, historyEvents];
                }
            });
        });
    };
    return PassportReader;
}());
exports.PassportReader = PassportReader;
