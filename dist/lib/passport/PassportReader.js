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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Passport_json_1 = __importDefault(require("../../config/Passport.json"));
var PassportFactory_json_1 = __importDefault(require("../../config/PassportFactory.json"));
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var IHistoryEvent_1 = require("../models/IHistoryEvent");
var sanitizeAddress_1 = require("../utils/sanitizeAddress");
var factEventSignatures;
/**
 * Class to get passports list and historic events
 */
var PassportReader = /** @class */ (function () {
    function PassportReader(web3) {
        this.web3 = web3;
        if (!factEventSignatures) {
            var signatures = getEventSignatures(web3);
            factEventSignatures = signatures.factEvents;
        }
    }
    /**
     * Fetches all passport addresses created by a particular passport factory address
     *
     * @param factoryAddress address of passport factory to get passports for
     * @param startBlock block nr to scan from
     * @param endBlock block nr to scan to
     */
    PassportReader.prototype.getPassportsList = function (factoryAddress, fromBlock, toBlock) {
        if (fromBlock === void 0) { fromBlock = 0; }
        if (toBlock === void 0) { toBlock = 'latest'; }
        return __awaiter(this, void 0, void 0, function () {
            var contract, events, passportRefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contract = new this.web3.eth.Contract(PassportFactory_json_1.default, factoryAddress);
                        return [4 /*yield*/, contract.getPastEvents('PassportCreated', {
                                fromBlock: fromBlock,
                                toBlock: toBlock,
                            })];
                    case 1:
                        events = _a.sent();
                        passportRefs = events.map(function (event) { return (__assign({}, event, { passportAddress: event.raw.topics[1] ? sanitizeAddress_1.sanitizeAddress(event.raw.topics[1].slice(26)) : '', ownerAddress: event.raw.topics[2] ? sanitizeAddress_1.sanitizeAddress(event.raw.topics[2].slice(26)) : '' })); });
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
            var fromBlock, toBlock, contract, events, historyEvents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromBlock = filter && filter.startBlock || 0;
                        toBlock = filter && filter.endBlock || 'latest';
                        contract = new this.web3.eth.Contract(PassportLogic_json_1.default, passportAddress);
                        return [4 /*yield*/, contract.getPastEvents('allEvents', {
                                fromBlock: fromBlock,
                                toBlock: toBlock,
                            })];
                    case 1:
                        events = _a.sent();
                        historyEvents = [];
                        events.forEach(function (event) {
                            if (!event) {
                                return;
                            }
                            var topics = event.raw.topics;
                            var eventSignatureHash = topics[0];
                            var eventInfo = factEventSignatures[eventSignatureHash];
                            // We track only known events
                            if (!eventInfo) {
                                return;
                            }
                            // First argument is fact provider address
                            var factProviderAddress = topics[1] ? sanitizeAddress_1.sanitizeAddress(topics[1].slice(26)) : '';
                            if (filter && filter.factProviderAddress && factProviderAddress !== filter.factProviderAddress) {
                                return;
                            }
                            // Second argument is fact key
                            var key = topics[2] ? _this.web3.utils.toAscii(topics[2]).replace(/\u0000/g, '') : '';
                            if (filter && filter.key && key !== filter.key) {
                                return;
                            }
                            historyEvents.push(__assign({}, event, { factProviderAddress: factProviderAddress,
                                key: key, dataType: eventInfo.dataType, eventType: eventInfo.eventType }));
                        });
                        return [2 /*return*/, historyEvents];
                }
            });
        });
    };
    /**
     * Returns the address of passport logic registry
     */
    PassportReader.prototype.getPassportLogicRegistryAddress = function (passportAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var passportContract;
            return __generator(this, function (_a) {
                passportContract = new this.web3.eth.Contract(Passport_json_1.default, passportAddress);
                return [2 /*return*/, passportContract.methods.getPassportLogicRegistry().call()];
            });
        });
    };
    return PassportReader;
}());
exports.PassportReader = PassportReader;
function getEventSignatures(web3) {
    var hashedSignatures = {};
    // Collect all event signatures from ABI file
    var abis = [PassportLogic_json_1.default, PassportFactory_json_1.default];
    abis.forEach(function (abi) {
        abi.forEach(function (item) {
            if (item.type !== 'event') {
                return;
            }
            var rawSignature = item.name + "(" + item.inputs.map(function (i) { return i.type; }).join(',') + ")";
            hashedSignatures[item.name] = web3.utils.sha3(rawSignature);
        });
    });
    var factEvents = {};
    // Create dictionary of event signatures to event data
    Object.keys(IHistoryEvent_1.DataType).forEach(function (dataType) {
        Object.keys(IHistoryEvent_1.EventType).forEach(function (eventType) {
            var hashedSignature = hashedSignatures["" + dataType + eventType];
            if (!hashedSignature) {
                return;
            }
            factEvents[hashedSignature] = {
                dataType: dataType,
                eventType: eventType,
            };
        });
    });
    return {
        factEvents: factEvents,
    };
}
