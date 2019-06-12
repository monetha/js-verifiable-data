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
var FactReader_1 = require("./FactReader");
var elliptic_1 = require("elliptic");
var ecies_1 = require("../crypto/ecies/ecies");
var privateFactCommon_1 = require("./privateFactCommon");
var EC = elliptic_1.ec;
/**
 * Class to read private facts
 */
var PrivateFactReader = /** @class */ (function () {
    function PrivateFactReader(web3, passportAddress) {
        this.ec = new EC(privateFactCommon_1.ellipticCurveAlg);
        this.contractIO = new ContractIO_1.ContractIO(web3, PassportLogic_json_1.default, passportAddress);
        this.reader = new FactReader_1.FactReader(web3, null, passportAddress);
    }
    Object.defineProperty(PrivateFactReader.prototype, "web3", {
        get: function () { return this.contractIO.getWeb3(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrivateFactReader.prototype, "passportAddress", {
        get: function () { return this.contractIO.getContractAddress(); },
        enumerable: true,
        configurable: true
    });
    /**
     * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
     * @param passportOwnerPrivateKey
     * @param factProviderAddress
     * @param key
     * @param ipfsClient
     */
    PrivateFactReader.prototype.getPrivateData = function (passportOwnerPrivateKey, factProviderAddress, key, ipfsClient) {
        return __awaiter(this, void 0, void 0, function () {
            var hashes, passportOwnerPrivateKeyPair, secretKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reader.getPrivateDataHashes(factProviderAddress, key)];
                    case 1:
                        hashes = _a.sent();
                        passportOwnerPrivateKeyPair = this.ec.keyPair({
                            priv: passportOwnerPrivateKey,
                            privEnc: 'hex',
                        });
                        return [4 /*yield*/, this.decryptSecretKey(passportOwnerPrivateKeyPair, hashes, factProviderAddress, key, ipfsClient)];
                    case 2:
                        secretKey = _a.sent();
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Gets ephemeral public key from IPFS and derives secret key using passport owner private key.
     * @param passportOwnerPrivateKeyPair
     * @param factProviderHashes
     * @param factProviderAddress
     * @param key
     * @param ipfsClient
     */
    PrivateFactReader.prototype.decryptSecretKey = function (passportOwnerPrivateKeyPair, factProviderHashes, factProviderAddress, key, ipfsClient) {
        return __awaiter(this, void 0, void 0, function () {
            var pubKeyBuff, pubKeyBytes, pubKeyPair, ecies, skmData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ipfsClient.cat(factProviderHashes.dataIpfsHash + "/" + privateFactCommon_1.ipfsFileNames.publicKey)];
                    case 1:
                        pubKeyBuff = _a.sent();
                        pubKeyBytes = Array.from(new Uint8Array(pubKeyBuff));
                        pubKeyPair = this.ec.keyPair({
                            pub: pubKeyBytes,
                        });
                        ecies = new ecies_1.ECIES(passportOwnerPrivateKeyPair);
                        skmData = privateFactCommon_1.deriveSecretKeyringMaterial(ecies, pubKeyPair, this.passportAddress, factProviderAddress, key);
                        return [2 /*return*/, null];
                }
            });
        });
    };
    return PrivateFactReader;
}());
exports.PrivateFactReader = PrivateFactReader;