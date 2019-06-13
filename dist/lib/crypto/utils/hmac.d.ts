/**
 * computes the MAC of a message (called the tag) as per
 * SEC 1, 3.5.
 */
export declare function getMessageTag(hashConstr: () => BlockHash<any>, hmacKey: number[], msg: number[], sharedKey?: number[]): number[];
