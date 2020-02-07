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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var encoder_1 = require("@harmony-js/contract/dist/utils/encoder");
var decoder_1 = require("@harmony-js/contract/dist/utils/decoder");
var ErrorCode_1 = require("../errors/ErrorCode");
var SdkError_1 = require("../errors/SdkError");
var conversion_1 = require("./conversion");
function getAllPastEvents(harmony, contract, options) {
    return __awaiter(this, void 0, void 0, function () {
        var finOptions, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finOptions = __assign({ fromBlock: options.fromBlock || 'earliest', address: contract.address }, (options || {}));
                    if (!finOptions.topics) {
                        finOptions.topics = [];
                    }
                    return [4 /*yield*/, harmony.messenger.send("hmy_getLogs" /* GetPastLogs */, [finOptions], this.harmony.messenger.chainType, this.harmony.defaultShardID)];
                case 1:
                    response = _a.sent();
                    if (response.isError()) {
                        throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.RPCFailure, response.error.message);
                    }
                    // Decode events
                    return [2 /*return*/, response.result.map(function (event) {
                            if (!event.topics || event.topics.length === 0) {
                                return event;
                            }
                            var signature = event.topics[0];
                            var eventModel = contract.abiModel.getEventBySignature(signature);
                            if (!eventModel) {
                                return event;
                            }
                            return decoder_1.decode(contract.abiCoder, eventModel, event);
                        })];
            }
        });
    });
}
exports.getAllPastEvents = getAllPastEvents;
function getPastEvents(harmony, contract, eventName, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, filter, restOpts, abiItemModel, finOptions, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = options || { filter: null }, filter = _a.filter, restOpts = __rest(_a, ["filter"]);
                    abiItemModel = contract.abiModel.getEvent(eventName);
                    if (!abiItemModel) {
                        throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.InvalidEventName, "Event \"" + eventName + "\" does not exist in contract's " + contract.address + " ABI file");
                    }
                    finOptions = __assign({}, restOpts, { fromBlock: options.fromBlock || 'earliest', address: contract.address });
                    if (finOptions.fromBlock !== 'earliest') {
                        finOptions.fromBlock = "0x" + conversion_1.toBN(finOptions.fromBlock).toString('hex');
                    }
                    if (finOptions.toBlock && finOptions.toBlock !== 'latest') {
                        finOptions.toBlock = "0x" + conversion_1.toBN(finOptions.toBlock).toString('hex');
                    }
                    if (!finOptions.topics) {
                        finOptions.topics = [];
                    }
                    // Encode event filters
                    if (filter) {
                        finOptions.topics = finOptions.topics.concat(encoder_1.eventFilterEncoder(contract.abiCoder, abiItemModel, filter));
                    }
                    // Event name in topic
                    if (!abiItemModel.anonymous) {
                        finOptions.topics.unshift(abiItemModel.signature);
                    }
                    return [4 /*yield*/, harmony.messenger.send("hmy_getLogs" /* GetPastLogs */, [finOptions], harmony.messenger.chainType, harmony.defaultShardID)];
                case 1:
                    response = _b.sent();
                    if (response.isError()) {
                        throw SdkError_1.createSdkError(ErrorCode_1.ErrorCode.RPCFailure, response.error.message);
                    }
                    // Decode events
                    return [2 /*return*/, response.result.map(function (event) { return decoder_1.decode(contract.abiCoder, abiItemModel, event); })];
            }
        });
    });
}
exports.getPastEvents = getPastEvents;
