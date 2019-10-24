"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Passport_json_1 = __importDefault(require("../../config/Passport.json"));
var PassportFactory_json_1 = __importDefault(require("../../config/PassportFactory.json"));
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var PassportLogicRegistry_json_1 = __importDefault(require("../../config/PassportLogicRegistry.json"));
var FactProviderRegistry_json_1 = __importDefault(require("../../config/FactProviderRegistry.json"));
var web3_1 = __importDefault(require("web3"));
/**
 * Creates PassportFactory contract instance
 */
function initPassportFactoryContract(anyWeb3, factoryAddress) {
    var web3 = new web3_1.default(anyWeb3.eth.currentProvider);
    return new web3.eth.Contract(PassportFactory_json_1.default, factoryAddress);
}
exports.initPassportFactoryContract = initPassportFactoryContract;
/**
 * Creates PassportLogic contract instance
 */
function initPassportLogicContract(anyWeb3, passportAddress) {
    var web3 = new web3_1.default(anyWeb3.eth.currentProvider);
    return new web3.eth.Contract(PassportLogic_json_1.default, passportAddress);
}
exports.initPassportLogicContract = initPassportLogicContract;
/**
 * Creates Passport contract instance
 */
function initPassportContract(anyWeb3, passportAddress) {
    var web3 = new web3_1.default(anyWeb3.eth.currentProvider);
    return new web3.eth.Contract(Passport_json_1.default, passportAddress);
}
exports.initPassportContract = initPassportContract;
/**
 * Creates PassportLogicRegistry contract instance
 */
function initPassportLogicRegistryContract(anyWeb3, registryAddress) {
    var web3 = new web3_1.default(anyWeb3.eth.currentProvider);
    return new web3.eth.Contract(PassportLogicRegistry_json_1.default, registryAddress);
}
exports.initPassportLogicRegistryContract = initPassportLogicRegistryContract;
/**
 * Creates FactProviderRegistry contract instance
 */
function initFactProviderRegistryContract(anyWeb3, registryAddress) {
    var web3 = new web3_1.default(anyWeb3.eth.currentProvider);
    return new web3.eth.Contract(FactProviderRegistry_json_1.default, registryAddress);
}
exports.initFactProviderRegistryContract = initFactProviderRegistryContract;
