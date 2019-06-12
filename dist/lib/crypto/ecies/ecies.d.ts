/// <reference types="node" />
import { ec } from 'elliptic';
import BN from 'bn.js';
export interface ISecretKeyringMaterial {
    encryptionKey: number[];
    macKey: number[];
}
/**
 * implements Elliptic Curve Integrated Encryption Scheme
 */
export declare class ECIES {
    private privateKeyPair;
    constructor(privateKeyPair: ec.KeyPair);
    /**
     * derives secret keyring material by computing shared secret from private and public keys and
     * passing it as a parameter to the KDF.
     * @param publicKey
     * @param s1 - seed for key derivation function
     */
    deriveSecretKeyringMaterial(publicKey: ec.KeyPair, s1: Buffer): ISecretKeyringMaterial;
    /**
     * Generates shared secret keys for encryption using ECDH key agreement protocol.
     * @param publicKey
     * @param skLength
     * @param macLength
     */
    generateShared(publicKey: ec.KeyPair, skLength: number, macLength: number): BN;
    /**
     * Returns the maximum length of the shared key the public key can produce.
     */
    getMaxSharedKeyLength(): number;
    /**
     * Returns the maximum length of the shared key the public key can produce.
     */
    private maxSharedKeyLength;
    getPublicKey(): ec.KeyPair;
}
