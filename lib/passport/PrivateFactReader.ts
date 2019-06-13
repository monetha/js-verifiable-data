import { curve, ec } from 'elliptic';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Cryptor } from '../crypto/ecies/cryptor';
import { ECIES } from '../crypto/ecies/ecies';
import { constantTimeCompare } from '../crypto/utils/compare';
import { Address } from '../models/Address';
import { IIPFSClient } from '../models/IIPFSClient';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { FactReader, IPrivateDataHashes } from './FactReader';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ipfsFileNames, unmarshalSecretKeyringMaterial } from './privateFactCommon';
const EC = ec;

/**
 * Class to read private facts
 */
export class PrivateFactReader {
  private contractIO: ContractIO;
  private reader: FactReader;
  private ec = new EC(ellipticCurveAlg);

  private get web3() { return this.contractIO.getWeb3(); }
  private get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3: Web3, passportAddress: Address) {
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);

    this.reader = new FactReader(web3, null, passportAddress);
  }

  /**
   * Decrypts secret key using passport owner key and then decrypts private data using decrypted secret key
   * @param passportOwnerPrivateKey
   * @param factProviderAddress
   * @param key
   * @param ipfsClient
   */
  public async getPrivateData(
    passportOwnerPrivateKey: string,
    factProviderAddress: Address,
    key: string,
    ipfsClient: IIPFSClient,
  ) {
    const hashes = await this.reader.getPrivateDataHashes(factProviderAddress, key);

    const passportOwnerPrivateKeyPair = this.ec.keyPair({
      priv: passportOwnerPrivateKey,
      privEnc: 'hex',
    });

    const secretKey = await this.decryptSecretKey(passportOwnerPrivateKeyPair, hashes, factProviderAddress, key, ipfsClient);

    return this.decryptPrivateData(hashes.dataIpfsHash, secretKey, passportOwnerPrivateKeyPair.ec.curve, ipfsClient);
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
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.passportAddress, factProviderAddress, key);

    if (!constantTimeCompare(Array.from(Buffer.from(factProviderHashes.dataKeyHash.replace('0x', ''), 'hex')), skmData.skmHash)) {
      throw new Error('Invalid passport owner key');
    }

    return skmData.skm;
  }
}
