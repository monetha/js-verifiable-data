import { hmac } from 'hash.js';

/**
 * computes the MAC of a message (called the tag) as per
 * SEC 1, 3.5.
 */
export function getMessageTag(hashConstr: () => BlockHash<any>, hmacKey: number[], msg: number[], sharedKey?: number[]): number[] {
  const mac = hmac(hashConstr as any, hmacKey);
  const tag = mac.update([...msg, ...(sharedKey || [])]).digest();

  return tag;
}
