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
var tx_1 = require("../utils/tx");
var web3_1 = __importDefault(require("web3"));
var rawContracts_1 = require("./rawContracts");
// #endregion
// #region -------------- Constants -------------------------------------------------------------------
var emptyAddress = '0x0000000000000000000000000000000000000000';
// #endregion
/**
 * Class to access and manage fact provider registry.
 * Allows managing info about fact providers.
 */
var FactProviderManager = /** @class */ (function () {
    function FactProviderManager(anyWeb3, factProviderRegistryAddress) {
        this.web3 = new web3_1.default(anyWeb3.eth.currentProvider);
        this.contract = rawContracts_1.initFactProviderRegistryContract(anyWeb3, factProviderRegistryAddress);
    }
    /**
     * Sets information about fact provider
     *
     * @param factProviderAddress - fact provider's address
     * @param info - information about fact provider
     * @param registryOwner - address of fact provider registry owner
     */
    FactProviderManager.prototype.setInfo = function (factProviderAddress, info, registryOwner) {
        var txObj = this.contract.methods.setFactProviderInfo(factProviderAddress, info.name, info.passport || emptyAddress, info.website || '');
        return tx_1.prepareTxConfig(this.web3, registryOwner, this.contract.address, txObj);
    };
    /**
     * Deletes information about fact provider
     *
     * @param factProviderAddress - fact provider's address
     * @param registryOwner - address of fact provider registry owner
     */
    FactProviderManager.prototype.deleteInfo = function (factProviderAddress, registryOwner) {
        var txObj = this.contract.methods.deleteFactProviderInfo(factProviderAddress);
        return tx_1.prepareTxConfig(this.web3, registryOwner, this.contract.address, txObj);
    };
    /**
     * Gets information about fact provider.
     * Returns null promise if no information was entered or it was deleted
     *
     * @param factProviderAddress - fact provider's address
     */
    FactProviderManager.prototype.getInfo = function (factProviderAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var result, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.methods.factProviders(factProviderAddress).call()];
                    case 1:
                        result = _a.sent();
                        if (!result || !result.initialized) {
                            return [2 /*return*/, null];
                        }
                        info = {
                            name: result.name,
                        };
                        if (result.website) {
                            info.website = result.website;
                        }
                        if (result.reputation_passport && result.reputation_passport !== emptyAddress) {
                            info.passport = result.reputation_passport;
                        }
                        return [2 /*return*/, info];
                }
            });
        });
    };
    return FactProviderManager;
}());
exports.FactProviderManager = FactProviderManager;
