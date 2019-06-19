import { expect } from 'chai';
import { concatKDF } from './kdf';
import { sha256 } from 'hash.js';

describe('KDF', () => {
  it('Validate concatenation KDF', () => {
    const msg = Buffer.from('Hello, world', 'utf8');

    const key = concatKDF(sha256, msg, null, 64);

    expect(Buffer.from(key).toString('hex'), 'Invalid generated key').to.equal(
      '746b4476aa0751884c9cb3fa41d2ebc64ed2d7f0fe7acd53ad7381b13c87acddc5c6762ceddb9731e2d77d3d78325e40e660ac64762bf1e68030d607be9a7d8a',
    );
  });
});
