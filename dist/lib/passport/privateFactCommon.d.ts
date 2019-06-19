import { ECIES, ISecretKeyringMaterial } from '../crypto/ecies/ecies';
import { ec } from 'elliptic';
export declare const ipfsFileNames: {
    /**
     * Public key in IPFS
     */
    publicKey: string;
    /**
     * Encrypted message
     */
    encryptedMessage: string;
    /**
     * Hashed MAC (Message Authentication Code)
     */
    messageHMAC: string;
};
export declare const ellipticCurveAlg = "secp256k1";
export declare function deriveSecretKeyringMaterial(ecies: ECIES, publicKey: ec.KeyPair, passAddress: string, factProviderAddress: string, factKey: string): {
    skm: number[];
    skmHash: number[];
};
/**
 * Unmarshals secret keyring material to encryption and MAC keys
 */
export declare function unmarshalSecretKeyringMaterial(skm: number[]): ISecretKeyringMaterial;
