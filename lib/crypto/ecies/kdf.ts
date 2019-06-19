import BN from 'bn.js';
import { sha256 } from 'hash.js';

const big2To32 = new BN(2).pow(new BN(32));
const big2To32M1 = big2To32.sub(new BN(1));

/**
 * NIST SP 800-56 Concatenation Key Derivation Function (see section 5.8.1).
 */
export function concatKDF(hashConstr: () => MessageDigest<any>, msg: Buffer, seed: Buffer, kdLength: number): number[] {
  const s1 = seed ? Array.from(seed) : [];

  let hasher = hashConstr();

  const reps = Math.floor(((kdLength + 7) * 8) / (hasher.blockSize));
  if (new BN(reps).cmp(big2To32M1) > 0) {
    throw new Error('Key data is too long');
  }

  const counter = [0, 0, 0, 1];
  const key = [];
  const zArr = Array.from(msg);

  for (let i = 0; i <= reps; i += 1) {
    const payload = [
      ...counter,
      ...zArr,
      ...s1,
    ];

    const digest = sha256().update(payload).digest() as number[];
    key.push(...digest);

    incCounter(counter);

    hasher = hashConstr();
  }

  return key.slice(0, kdLength);
}

function incCounter(counter: number[]) {
  for (let i = 3; i >= 0; i -= 1) {
    counter[i] += 1;

    if (counter[i] > 255) {
      counter[i] = 0;
    }

    if (counter[i] !== 0) {
      return;
    }
  }
}
