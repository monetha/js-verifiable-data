import { curve, ec } from 'elliptic';
import { Cryptor } from '../crypto/ecies/cryptor';
import { ECIES } from '../crypto/ecies/ecies';
import { constantTimeCompare } from '../crypto/utils/compare';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { IFactValue } from './FactHistoryReader';
import { IPrivateDataHashes } from './FactReader';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ipfsFileNames, unmarshalSecretKeyringMaterial } from './privateFactCommon';
import { createSdkError } from '../errors/SdkError';
import { ErrorCode } from '../errors/ErrorCode';
const EC = ec;

/**
 * Class to read private facts
 */
export class PrivateFactReader {
  private ec = new EC(ellipticCurveAlg);

  /**
   * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
   * @param factData fact data written in passport
   * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
   * @param ipfsClient IPFS client
   */
  public async getPrivateData(
    factData: IFactValue<IPrivateDataHashes>,
    passportOwnerPrivateKey: string,
    ipfsClient: IIPFSClient,
  ) {

    const passportOwnerPrivateKeyPair = this.ec.keyPair({
      priv: passportOwnerPrivateKey.replace('0x', ''),
      privEnc: 'hex',
    });

    const secretKey = await this.decryptSecretKey(
      passportOwnerPrivateKeyPair, factData.value, factData.factProviderAddress, factData.passportAddress, factData.key, ipfsClient);

    return this.decryptPrivateData(factData.value.dataIpfsHash, secretKey, passportOwnerPrivateKeyPair.ec.curve, ipfsClient);
  }

  /**
   * Decrypts decrypts private data using secret key
   * @param dataIpfsHash IPFS hash where encrypted data is stored
   * @param secretKey secret key in hex, used for data decryption
   * @param ipfsClient IPFS client
   */
  public async getPrivateDataUsingSecretKey(
    dataIpfsHash: string,
    secretKey: string,
    ipfsClient: IIPFSClient,
  ) {
    const secretKeyArr = Array.from(Buffer.from(secretKey.replace('0x', ''), 'hex'));

    return this.decryptPrivateData(dataIpfsHash, secretKeyArr, null, ipfsClient);
  }

  /**
   * reads encrypted data and HMAC and decrypts data using provided secret keyring material and elliptic curve.
   * Default elliptic curve is used if it's nil.
   * @param dataIpfsHash IPFS hash where encrypted data is stored
   * @param secretKey secret key in hex, used for data decryption
   * @param ellipticCurve - curve to use in encryption
   * @param ipfsClient IPFS client
   */
  public async decryptPrivateData(
    dataIpfsHash: string,
    secretKey: number[],
    ellipticCurve: curve.base,
    ipfsClient: IIPFSClient,
  ) {
    const skm = unmarshalSecretKeyringMaterial(secretKey);

    // Get encrypted message and hmac from IPFS
    const encryptedMsg = await ipfsClient.cat(`${dataIpfsHash}/${ipfsFileNames.encryptedMessage}`);
    const hmac = await ipfsClient.cat(`${dataIpfsHash}/${ipfsFileNames.messageHMAC}`);

    const cryptor = new Cryptor(ellipticCurve);

    const decryptedData = cryptor.decryptAuth(skm, {
      encryptedMsg: Array.from(new Uint8Array(encryptedMsg)),
      hmac: Array.from(new Uint8Array(hmac)),
    });

    return decryptedData;
  }

  /**
   * Gets ephemeral public key from IPFS and derives secret key using passport owner private key.
   * @param passportOwnerPrivateKeyPair
   * @param factProviderHashes
   * @param factProviderAddress
   * @param key
   * @param ipfsClient
   */
  public async decryptSecretKey(
    passportOwnerPrivateKeyPair: ec.KeyPair,
    factProviderHashes: IPrivateDataHashes,
    factProviderAddress: Address,
    passportAddress: Address,
    key: string,
    ipfsClient: IIPFSClient,
  ) {

    // Get ephemeral public key and prepare EC keypair
    const pubKeyBuff = await ipfsClient.cat(`${factProviderHashes.dataIpfsHash}/${ipfsFileNames.publicKey}`);
    const pubKeyBytes = Array.from(new Uint8Array(pubKeyBuff));

    const pubKeyPair = this.ec.keyPair({
      pub: pubKeyBytes,
    });

    // Create ECIES
    const ecies = new ECIES(passportOwnerPrivateKeyPair);

    // Derive SKM
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, passportAddress, factProviderAddress, key);

    if (!constantTimeCompare(Array.from(Buffer.from(factProviderHashes.dataKeyHash.replace('0x', ''), 'hex')), skmData.skmHash)) {
      throw createSdkError(ErrorCode.InvalidPassportOwnerKey, 'Invalid passport owner private key');
    }

    return skmData.skm;
  }
}
