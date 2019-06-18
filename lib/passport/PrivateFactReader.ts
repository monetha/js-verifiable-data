import { curve, ec } from 'elliptic';
import { Cryptor } from '../crypto/ecies/cryptor';
import { ECIES } from '../crypto/ecies/ecies';
import { constantTimeCompare } from '../crypto/utils/compare';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { FactReader, IPrivateDataHashes } from './FactReader';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ipfsFileNames, unmarshalSecretKeyringMaterial } from './privateFactCommon';
const EC = ec;

/**
 * Class to read private facts
 */
export class PrivateFactReader {
  private reader: FactReader;
  private ec = new EC(ellipticCurveAlg);

  constructor(factReader: FactReader) {
    this.reader = factReader;
  }

  /**
   * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
   * @param passportOwnerPrivateKey private passport owner wallet key in hex, used for data decryption
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   * @param ipfs IPFS client
   */
  public async getPrivateData(
    passportOwnerPrivateKey: string,
    factProviderAddress: Address,
    key: string,
    ipfsClient: IIPFSClient,
  ) {
    const hashes = await this.reader.getPrivateDataHashes(factProviderAddress, key);

    const passportOwnerPrivateKeyPair = this.ec.keyPair({
      priv: passportOwnerPrivateKey.replace('0x', ''),
      privEnc: 'hex',
    });

    const secretKey = await this.decryptSecretKey(passportOwnerPrivateKeyPair, hashes, factProviderAddress, key, ipfsClient);

    return this.decryptPrivateData(hashes.dataIpfsHash, secretKey, passportOwnerPrivateKeyPair.ec.curve, ipfsClient);
  }

  /**
   * Decrypts decrypts private data using secret key
   * @param secretKey secret key in hex, used for data decryption
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   * @param ipfs IPFS client
   */
  public async getPrivateDataUsingSecretKey(
    secretKey: string,
    factProviderAddress: Address,
    key: string,
    ipfsClient: IIPFSClient,
  ) {
    const hashes = await this.reader.getPrivateDataHashes(factProviderAddress, key);

    const secretKeyArr = Array.from(Buffer.from(secretKey.replace('0x', ''), 'hex'));

    return this.decryptPrivateData(hashes.dataIpfsHash, secretKeyArr, null, ipfsClient);
  }

  /**
   * reads encrypted data and HMAC and decrypts data using provided secret keyring material and elliptic curve.
   * Default elliptic curve is used if it's nil.
   * @param dataIpfsHash
   * @param secretKey
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
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.reader.passportAddress, factProviderAddress, key);

    if (!constantTimeCompare(Array.from(Buffer.from(factProviderHashes.dataKeyHash.replace('0x', ''), 'hex')), skmData.skmHash)) {
      throw new Error('Invalid passport owner key');
    }

    return skmData.skm;
  }
}
