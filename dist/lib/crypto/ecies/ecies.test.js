"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ecies_1 = require("./ecies");
var elliptic_1 = require("elliptic");
var privateFactCommon_1 = require("../../passport/privateFactCommon");
var bn_js_1 = __importDefault(require("bn.js"));
describe('ECIES', function () {
    // #region -------------- Derivation -------------------------------------------------------------------
    it('Should derive secret keyring material', function () {
        var curve = new elliptic_1.ec(privateFactCommon_1.ellipticCurveAlg);
        var ecies1 = new ecies_1.ECIES(curve.genKeyPair());
        var ecies2 = new ecies_1.ECIES(curve.genKeyPair());
        var skm1 = ecies1.deriveSecretKeyringMaterial(ecies2.getPublicKey(), null);
        var skm2 = ecies2.deriveSecretKeyringMaterial(ecies1.getPublicKey(), null);
        chai_1.expect(skm1, 'deriveSecretKeyringMaterial must produce the same result for both sides').deep.eq(skm2);
    });
    // #endregion
    // #region -------------- Shared keys -------------------------------------------------------------------
    it('Validate ECDH for shared keys', function () {
        var curve = new elliptic_1.ec(privateFactCommon_1.ellipticCurveAlg);
        var ecies1 = new ecies_1.ECIES(curve.genKeyPair());
        var ecies2 = new ecies_1.ECIES(curve.genKeyPair());
        var skLen = ecies1.getMaxSharedKeyLength() / 2;
        var sk1 = ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen);
        var sk2 = ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen);
        chai_1.expect(sk1.eq(sk2), 'Generated shared keys are different').to.be.true;
    });
    it('Should fail for too big shared key', function () {
        var curve = new elliptic_1.ec(privateFactCommon_1.ellipticCurveAlg);
        var ecies1 = new ecies_1.ECIES(curve.genKeyPair());
        var ecies2 = new ecies_1.ECIES(curve.genKeyPair());
        var skLen = 32;
        chai_1.expect(function () { return ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen); }, 'Too big key error expected').to.throw();
        chai_1.expect(function () { return ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen); }, 'Too big key error expected').to.throw();
    });
    it('Validate shared keys padding', function () {
        var curve = new elliptic_1.ec(privateFactCommon_1.ellipticCurveAlg);
        // Sanity checks
        var prv0 = curve.keyFromPrivate('1adf5c18167d96a1f9a0b1ef63be8aa27eaf6032c233b2b38f7850cf5b859fd9', 'hex');
        var prv1 = curve.keyFromPrivate('0097a076fc7fcd9208240668e31c9abee952cbb6e375d1b8febc7499d6e16f1a', 'hex');
        var x0 = new bn_js_1.default('1a8ed022ff7aec59dc1b440446bdda5ff6bcb3509a8b109077282b361efffbd8', 16);
        var x1 = new bn_js_1.default('6ab3ac374251f638d0abb3ef596d1dc67955b507c104e5f2009724812dc027b8', 16);
        var y0 = new bn_js_1.default('e040bd480b1deccc3bc40bd5b1fdcb7bfd352500b477cb9471366dbd4493f923', 16);
        var y1 = new bn_js_1.default('8ad915f2b503a8be6facab6588731fefeb584fd2dfa9a77a5e0bba1ec439e4fa', 16);
        chai_1.expect(prv0.getPublic().getX().eq(x0), 'Invalid prv0.x').to.be.true;
        chai_1.expect(prv0.getPublic().getY().eq(y0), 'Invalid prv0.y').to.be.true;
        chai_1.expect(prv1.getPublic().getX().eq(x1), 'Invalid prv1.x').to.be.true;
        chai_1.expect(prv1.getPublic().getY().eq(y1), 'Invalid prv1.y').to.be.true;
        // Shared key generation
        var ecies1 = new ecies_1.ECIES(prv0);
        var ecies2 = new ecies_1.ECIES(prv1);
        var skLen = 16;
        var sk1 = ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen);
        var sk2 = ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen);
        chai_1.expect(sk1.eq(sk2), 'Generated shared keys are different').to.be.true;
    });
    // #endregion
});
