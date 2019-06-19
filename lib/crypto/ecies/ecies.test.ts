import { expect } from 'chai';
import { ECIES } from './ecies';
import { ec } from 'elliptic';
import { ellipticCurveAlg } from '../../passport/privateFactCommon';
import BN from 'bn.js';

describe('ECIES', () => {

  // #region -------------- Derivation -------------------------------------------------------------------

  it('Should derive secret keyring material', () => {
    const curve = new ec(ellipticCurveAlg);

    const ecies1 = new ECIES(curve.genKeyPair());
    const ecies2 = new ECIES(curve.genKeyPair());

    const skm1 = ecies1.deriveSecretKeyringMaterial(ecies2.getPublicKey(), null);
    const skm2 = ecies2.deriveSecretKeyringMaterial(ecies1.getPublicKey(), null);

    expect(skm1, 'deriveSecretKeyringMaterial must produce the same result for both sides').deep.eq(skm2);
  });

  // #endregion

  // #region -------------- Shared keys -------------------------------------------------------------------

  it('Validate ECDH for shared keys', () => {
    const curve = new ec(ellipticCurveAlg);

    const ecies1 = new ECIES(curve.genKeyPair());
    const ecies2 = new ECIES(curve.genKeyPair());
    const skLen = ecies1.getMaxSharedKeyLength() / 2;

    const sk1 = ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen);
    const sk2 = ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen);

    expect(sk1.eq(sk2), 'Generated shared keys are different').to.be.true;
  });

  it('Should fail for too big shared key', () => {
    const curve = new ec(ellipticCurveAlg);

    const ecies1 = new ECIES(curve.genKeyPair());
    const ecies2 = new ECIES(curve.genKeyPair());

    const skLen = 32;

    expect(() => ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen),
      'Too big key error expected').to.throw();

    expect(() => ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen),
      'Too big key error expected').to.throw();
  });

  it('Validate shared keys padding', () => {
    const curve = new ec(ellipticCurveAlg);

    // Sanity checks
    const prv0 = curve.keyFromPrivate('1adf5c18167d96a1f9a0b1ef63be8aa27eaf6032c233b2b38f7850cf5b859fd9', 'hex');
    const prv1 = curve.keyFromPrivate('0097a076fc7fcd9208240668e31c9abee952cbb6e375d1b8febc7499d6e16f1a', 'hex');
    const x0 = new BN('1a8ed022ff7aec59dc1b440446bdda5ff6bcb3509a8b109077282b361efffbd8', 16);
    const x1 = new BN('6ab3ac374251f638d0abb3ef596d1dc67955b507c104e5f2009724812dc027b8', 16);
    const y0 = new BN('e040bd480b1deccc3bc40bd5b1fdcb7bfd352500b477cb9471366dbd4493f923', 16);
    const y1 = new BN('8ad915f2b503a8be6facab6588731fefeb584fd2dfa9a77a5e0bba1ec439e4fa', 16);

    expect(prv0.getPublic().getX().eq(x0), 'Invalid prv0.x').to.be.true;
    expect(prv0.getPublic().getY().eq(y0), 'Invalid prv0.y').to.be.true;
    expect(prv1.getPublic().getX().eq(x1), 'Invalid prv1.x').to.be.true;
    expect(prv1.getPublic().getY().eq(y1), 'Invalid prv1.y').to.be.true;

    // Shared key generation
    const ecies1 = new ECIES(prv0);
    const ecies2 = new ECIES(prv1);

    const skLen = 16;

    const sk1 = ecies1.generateShared(ecies2.getPublicKey(), skLen, skLen);
    const sk2 = ecies2.generateShared(ecies1.getPublicKey(), skLen, skLen);

    expect(sk1.eq(sk2), 'Generated shared keys are different').to.be.true;
  });

  // #endregion
});
