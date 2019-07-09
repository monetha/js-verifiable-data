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
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var ContractIO_1 = require("../transactionHelpers/ContractIO");
var getTxData_1 = require("../utils/getTxData");
/**
 * Class to change passport ownership
 */
var PassportOwnership = /** @class */ (function () {
    function PassportOwnership(web3, passportAddress, options) {
        this.contract = new ContractIO_1.ContractIO(web3, PassportLogic_json_1.default, passportAddress);
        this.options = options || {};
    }
    /**
     * After the passport is created, the owner must call this method to become a full passport owner
     */
    PassportOwnership.prototype.claimOwnership = function (passportOwnerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.prepareCallTX('claimOwnership', [], passportOwnerAddress)];
            });
        });
    };
    /**
     * Returns passport owner address
     */
    PassportOwnership.prototype.getOwnerAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getContract().methods.owner().call()];
            });
        });
    };
    /**
     * Returns passport pending owner address
     */
    PassportOwnership.prototype.getPendingOwnerAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.getContract().methods.pendingOwner().call()];
            });
        });
    };
    /**
     * Returns passport owner public key. Owner must claim ownership of the passport,
     * before this method can be invoked.
     */
    PassportOwnership.prototype.getOwnerPublicKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ownerAddress, transferredEvent, web3, txInfo, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOwnerAddress()];
                    case 1:
                        ownerAddress = _a.sent();
                        if (!ownerAddress) {
                            throw new Error('The ownership for this passport has not been claimed yet');
                        }
                        return [4 /*yield*/, this.getFirstOwnershipTransferredEvent(ownerAddress)];
                    case 2:
                        transferredEvent = _a.sent();
                        if (!transferredEvent) {
                            throw new Error('Failed to get ownership transfer event');
                        }
                        web3 = this.contract.getWeb3();
                        return [4 /*yield*/, getTxData_1.getTxData(transferredEvent.transactionHash, web3, this.options.txRetriever)];
                    case 3:
                        txInfo = _a.sent();
                        tx = txInfo.tx;
                        return [2 /*return*/, Array.from(getTxData_1.getSenderPublicKey(tx))];
                }
            });
        });
    };
    PassportOwnership.prototype.getFirstOwnershipTransferredEvent = function (newOwnerAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getContract().getPastEvents('OwnershipTransferred', {
                            // TODO: We need to somehow get passport contract creation block address to scan from to increase performance
                            fromBlock: 0,
                            filter: {
                                previousOwner: null,
                                newOwner: newOwnerAddress,
                            },
                        })];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events.find(function (e) { return e && !e.removed; })];
                }
            });
        });
    };
    return PassportOwnership;
}());
exports.PassportOwnership = PassportOwnership;
