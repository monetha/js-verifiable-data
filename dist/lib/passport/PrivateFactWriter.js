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
var elliptic_1 = require("elliptic");
var cryptor_1 = require("../crypto/ecies/cryptor");
var ecies_1 = require("../crypto/ecies/ecies");
var ipfs_1 = require("../utils/ipfs");
var privateFactCommon_1 = require("./privateFactCommon");
var PassportOwnership_1 = require("./PassportOwnership");
var EC = elliptic_1.ec;
/**
 * Class to write private facts
 */
var PrivateFactWriter = /** @class */ (function () {
    function PrivateFactWriter(factWriter, options) {
        this.ec = new EC(privateFactCommon_1.ellipticCurveAlg);
        this.ownership = new PassportOwnership_1.PassportOwnership(factWriter.web3, factWriter.passportAddress, options);
        this.writer = factWriter;
    }
    /**
     * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
     */
    PrivateFactWriter.prototype.setPrivateData = function (factProviderAddress, key, data, ipfsClient) {
        return __awaiter(this, void 0, void 0, function () {
            var pubKeyBytes, ecies, ephemeralPublicKey, pubKeyPair, skmData, skm, cryptor, encryptedMsg, ephemeralPublicKeyAddResult, encryptedMsgAddResult, messageHMACAddResult, result, dirHash, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ownership.getOwnerPublicKey()];
                    case 1:
                        pubKeyBytes = _a.sent();
                        ecies = ecies_1.ECIES.createGenerated(this.ec);
                        ephemeralPublicKey = ecies.getPublicKey().getPublic('array');
                        pubKeyPair = this.ec.keyFromPublic(Buffer.from(pubKeyBytes));
                        skmData = privateFactCommon_1.deriveSecretKeyringMaterial(ecies, pubKeyPair, this.writer.passportAddress, factProviderAddress, key);
                        skm = privateFactCommon_1.unmarshalSecretKeyringMaterial(skmData.skm);
                        cryptor = new cryptor_1.Cryptor(this.ec.curve);
                        encryptedMsg = cryptor.encryptAuth(skm, data);
                        return [4 /*yield*/, ipfsClient.add(Buffer.from(ephemeralPublicKey))];
                    case 2:
                        ephemeralPublicKeyAddResult = _a.sent();
                        return [4 /*yield*/, ipfsClient.add(Buffer.from(encryptedMsg.encryptedMsg))];
                    case 3:
                        encryptedMsgAddResult = _a.sent();
                        return [4 /*yield*/, ipfsClient.add(Buffer.from(encryptedMsg.hmac))];
                    case 4:
                        messageHMACAddResult = _a.sent();
                        return [4 /*yield*/, ipfs_1.dagPutLinks([
                                ipfs_1.convertAddResultToLink(ephemeralPublicKeyAddResult, privateFactCommon_1.ipfsFileNames.publicKey),
                                ipfs_1.convertAddResultToLink(encryptedMsgAddResult, privateFactCommon_1.ipfsFileNames.encryptedMessage),
                                ipfs_1.convertAddResultToLink(messageHMACAddResult, privateFactCommon_1.ipfsFileNames.messageHMAC),
                            ], ipfsClient)];
                    case 5:
                        result = _a.sent();
                        dirHash = result.Cid['/'];
                        return [4 /*yield*/, this.writer.setPrivateDataHashes(key, {
                                dataIpfsHash: dirHash,
                                dataKeyHash: "0x" + Buffer.from(skmData.skmHash).toString('hex'),
                            }, factProviderAddress)];
                    case 6:
                        tx = _a.sent();
                        return [2 /*return*/, {
                                dataIpfsHash: dirHash,
                                dataKey: skmData.skm,
                                dataKeyHash: skmData.skmHash,
                                tx: tx,
                            }];
                }
            });
        });
    };
    return PrivateFactWriter;
}());
exports.PrivateFactWriter = PrivateFactWriter;
