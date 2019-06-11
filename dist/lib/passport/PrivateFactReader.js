"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ContractIO_1 = require("../transactionHelpers/ContractIO");
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
/**
 * Class to read private facts
 */
var PrivateFactReader = /** @class */ (function () {
    function PrivateFactReader(web3, passportAddress) {
        //this.ethNetworkUrl = ethNetworkUrl;
        this.contractIO = new ContractIO_1.ContractIO(web3, PassportLogic_json_1.default, passportAddress);
    }
    Object.defineProperty(PrivateFactReader.prototype, "web3", {
        //private ethNetworkUrl: string;
        get: function () { return this.contractIO.getWeb3(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrivateFactReader.prototype, "passportAddress", {
        get: function () { return this.contractIO.getContractAddress(); },
        enumerable: true,
        configurable: true
    });
    return PrivateFactReader;
}());
exports.PrivateFactReader = PrivateFactReader;
