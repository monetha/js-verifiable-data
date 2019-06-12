import { ContractIO } from '../transactionHelpers/ContractIO';
import Web3 from 'web3';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { AbiItem } from 'web3-utils';
import { FactReader, IPrivateDataHashes } from './FactReader';
import { IIPFSClient } from '../models/IIPFSClient';
import { ec } from 'elliptic';
import { ECIES } from '../crypto/ecies/ecies';
import { ellipticCurveAlg, ipfsFileNames, deriveSecretKeyringMaterial } from './privateFactCommon';
import { constantTimeCompare } from '../crypto/utils/compare';
import BN from 'bn.js';
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
    return null;
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

    // Get public key and prepare EC keypair
    const pubKeyBuff = await ipfsClient.cat(`${factProviderHashes.dataIpfsHash}/${ipfsFileNames.publicKey}`);
    const pubKeyBytes = Array.from(new Uint8Array(pubKeyBuff));

    const pubKeyPair = this.ec.keyPair({
      pub: pubKeyBytes,
    });

    // Create ECIES
    const ecies = new ECIES(passportOwnerPrivateKeyPair);

    // Derive SKM
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.passportAddress, factProviderAddress, key);

    // TODO: something is not working correctly
    if (!constantTimeCompare(new BN(factProviderHashes.dataKeyHash.replace('0x', ''), 16).toArray(), skmData.skmHash)) {
      throw new Error('Invalid passport owner key');
    }

    return skmData.skm;
  }
}
