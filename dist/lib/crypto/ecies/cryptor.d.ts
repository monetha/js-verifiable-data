import { curve } from 'elliptic';
import { ISecretKeyringMaterial } from './ecies';
interface IEncryptedAuthenticatedMessage {
    encryptedMsg: number[];
    hmac: number[];
}
export declare class Cryptor {
    private params;
    constructor(_curve: curve.base);
    /**
     * Checks encrypted message HMAC and if it's valid decrypts the message.
     * s2 contains shared information that is not part of the ciphertext, it's fed into the MAC. If the
     * shared information parameters aren't being used, they should not be provided.
     */
    decryptAuth(skm: ISecretKeyringMaterial, encAuthMsg: IEncryptedAuthenticatedMessage, s2?: number[]): number[];
    /**
     * EncryptAuth encrypts message using provided secret keyring material and returns encrypted message with the HMAC.
     * s2 contains shared information that is not part of the resulting ciphertext, it's fed into the MAC. If the
     * shared information parameters aren't being used, they should not be provided.
     */
    encryptAuth(skm: ISecretKeyringMaterial, msg: number[], s2?: number[]): IEncryptedAuthenticatedMessage;
}
export {};
