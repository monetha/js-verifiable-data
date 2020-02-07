import { ec } from 'elliptic';
import { RandomArrayGenerator } from 'lib/models/RandomArrayGenerator';
import { Cryptor } from '../crypto/ecies/cryptor';
import { ECIES } from '../crypto/ecies/ecies';
import { Address } from '../models/Address';
import { IIPFSAddResult, IIPFSClient } from '../models/IIPFSClient';
import { convertAddResultToLink, dagPutLinks } from '../utils/ipfs';
import { FactWriter } from './FactWriter';
import { PassportOwnership } from './PassportOwnership';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ipfsFileNames, unmarshalSecretKeyringMaterial } from './privateFactCommon';
import { Harmony } from '@harmony-js/core';
const EC = ec;

/**
 * Class to write private facts
 */
export class PrivateFactWriter {
  private writer: FactWriter;
  private ownership: PassportOwnership;
  private ec = new EC(ellipticCurveAlg);

  constructor(harmony: Harmony, factWriter: FactWriter) {
    this.ownership = new PassportOwnership(harmony, factWriter.passportAddress);
    this.writer = factWriter;
  }

  /**
   * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
   */
  public async setPrivateData(
    factProviderAddress: Address,
    key: string,
    data: number[],
    ipfsClient: IIPFSClient,
    rand?: RandomArrayGenerator,
  ) {
    // Get passport owner public key
    const pubKeyBytes = await this.ownership.getOwnerPublicKey();

    // Create ECIES with generated keys
    const ecies = await ECIES.createGenerated(this.ec, rand);
    const ephemeralPublicKey = ecies.getPublicKey().getPublic('array');

    const pubKeyPair = this.ec.keyFromPublic(Buffer.from(pubKeyBytes));

    // Derive SKM
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.writer.passportAddress, factProviderAddress, key);
    const skm = unmarshalSecretKeyringMaterial(skmData.skm);

    // Encrypt data
    const cryptor = new Cryptor(this.ec.curve);
    const encryptedMsg = await cryptor.encryptAuth(skm, data, null, rand);

    // Store files to IPFS
    const ephemeralPublicKeyAddResult = await ipfsClient.add(Buffer.from(ephemeralPublicKey)) as IIPFSAddResult;
    const encryptedMsgAddResult = await ipfsClient.add(Buffer.from(encryptedMsg.encryptedMsg)) as IIPFSAddResult;
    const messageHMACAddResult = await ipfsClient.add(Buffer.from(encryptedMsg.hmac)) as IIPFSAddResult;

    // Create IPFS directory
    const result = await dagPutLinks([
      convertAddResultToLink(ephemeralPublicKeyAddResult, ipfsFileNames.publicKey),
      convertAddResultToLink(encryptedMsgAddResult, ipfsFileNames.encryptedMessage),
      convertAddResultToLink(messageHMACAddResult, ipfsFileNames.messageHMAC),
    ], ipfsClient);

    const dirHash = result.Cid['/'];

    // Create TX for setting private data hashes to passport
    const tx = await this.writer.setPrivateDataHashes(key, {
      dataIpfsHash: dirHash,
      dataKeyHash: `0x${Buffer.from(skmData.skmHash).toString('hex')}`,
    }, factProviderAddress);

    return {
      dataIpfsHash: dirHash,
      dataKey: skmData.skm,
      dataKeyHash: skmData.skmHash,
      tx,
    };
  }
}
