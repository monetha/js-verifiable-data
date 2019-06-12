/**
 * Returns true if and only if the two arrays have equal contents.
 * The time taken is a function of the length of the arrays and is independent of the contents.
 */
export function constantTimeCompare(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;

  for (let i = 0; i < a.length; i += 1) {

    // tslint:disable-next-line: no-bitwise
    mismatch |= a[i] ^ b[i];
  }

  return mismatch === 0;
}
