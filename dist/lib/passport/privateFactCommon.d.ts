import { ECIES } from '../crypto/ecies/ecies';
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
export declare function deriveSecretKeyringMaterial(ecies: ECIES, publicKey: ec.KeyPair, passAddress: string, factProviderAddress: string, factKey: string): any;
