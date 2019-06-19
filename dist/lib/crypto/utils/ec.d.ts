/// <reference types="node" />
import { ec } from 'elliptic';
/**
 * Converts public key into the uncompressed form specified in section 4.3.6 of ANSI X9.62.
 */
export declare function marshalPublicKey(publicKey: ec.KeyPair): Buffer;
