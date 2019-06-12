/// <reference types="node" />
/**
 * NIST SP 800-56 Concatenation Key Derivation Function (see section 5.8.1).
 */
export declare function concatKDF(hashConstr: () => MessageDigest<any>, msg: Buffer, seed: Buffer, kdLength: number): number[];
