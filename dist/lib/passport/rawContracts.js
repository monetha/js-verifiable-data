"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Passport_json_1 = __importDefault(require("../../config/Passport.json"));
var PassportFactory_json_1 = __importDefault(require("../../config/PassportFactory.json"));
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var PassportLogicRegistry_json_1 = __importDefault(require("../../config/PassportLogicRegistry.json"));
/**
 * Creates PassportFactory contract instance
 */
function initPassportFactoryContract(web3, factoryAddress) {
    return new web3.eth.Contract(PassportFactory_json_1.default, factoryAddress);
}
exports.initPassportFactoryContract = initPassportFactoryContract;
/**
 * Creates PassportLogic contract instance
 */
function initPassportLogicContract(web3, passportAddress) {
    return new web3.eth.Contract(PassportLogic_json_1.default, passportAddress);
}
exports.initPassportLogicContract = initPassportLogicContract;
/**
 * Creates Passport contract instance
 */
function initPassportContract(web3, passportAddress) {
    return new web3.eth.Contract(Passport_json_1.default, passportAddress);
}
exports.initPassportContract = initPassportContract;
/**
 * Creates PassportLogicRegistry contract instance
 */
function initPassportLogicRegistryContract(web3, registryAddress) {
    return new web3.eth.Contract(PassportLogicRegistry_json_1.default, registryAddress);
}
exports.initPassportLogicRegistryContract = initPassportLogicRegistryContract;
