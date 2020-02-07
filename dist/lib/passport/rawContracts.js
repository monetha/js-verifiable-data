"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FactProviderRegistry_json_1 = __importDefault(require("../../config/FactProviderRegistry.json"));
var Passport_json_1 = __importDefault(require("../../config/Passport.json"));
var PassportFactory_json_1 = __importDefault(require("../../config/PassportFactory.json"));
var PassportLogic_json_1 = __importDefault(require("../../config/PassportLogic.json"));
var PassportLogicRegistry_json_1 = __importDefault(require("../../config/PassportLogicRegistry.json"));
/**
 * Creates PassportFactory contract instance
 */
function initPassportFactoryContract(harmony, factoryAddress) {
    return harmony.contracts.createContract(PassportFactory_json_1.default, factoryAddress);
}
exports.initPassportFactoryContract = initPassportFactoryContract;
/**
 * Creates PassportLogic contract instance
 */
function initPassportLogicContract(harmony, passportAddress) {
    return harmony.contracts.createContract(PassportLogic_json_1.default, passportAddress);
}
exports.initPassportLogicContract = initPassportLogicContract;
/**
 * Creates Passport contract instance
 */
function initPassportContract(harmony, passportAddress) {
    return harmony.contracts.createContract(Passport_json_1.default, passportAddress);
}
exports.initPassportContract = initPassportContract;
/**
 * Creates PassportLogicRegistry contract instance
 */
function initPassportLogicRegistryContract(harmony, registryAddress) {
    return harmony.contracts.createContract(PassportLogicRegistry_json_1.default, registryAddress);
}
exports.initPassportLogicRegistryContract = initPassportLogicRegistryContract;
/**
 * Creates FactProviderRegistry contract instance
 */
function initFactProviderRegistryContract(harmony, registryAddress) {
    return harmony.contracts.createContract(FactProviderRegistry_json_1.default, registryAddress);
}
exports.initFactProviderRegistryContract = initFactProviderRegistryContract;
