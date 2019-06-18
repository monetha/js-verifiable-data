import { ec } from 'elliptic';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Cryptor } from '../crypto/ecies/cryptor';
import { ECIES } from '../crypto/ecies/ecies';
import { Address } from '../models/Address';
import { IIPFSAddResult, IIPFSClient } from '../models/IIPFSClient';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { convertAddResultToLink, dagPutLinks } from '../utils/ipfs.js';
import { PassportOwnership } from './PassportOwnership.js';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ipfsFileNames, unmarshalSecretKeyringMaterial } from './privateFactCommon';
const EC = ec;

/**
 * Class to write private facts
 */
export class PrivateFactWriter {
  private contractIO: ContractIO;
  private ownership: PassportOwnership;
  private ec = new EC(ellipticCurveAlg);

  private get web3() { return this.contractIO.getWeb3(); }
  private get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3: Web3, passportAddress: Address) {
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);

    this.ownership = new PassportOwnership(web3, passportAddress);
  }

  /**
   * Encrypts private data, adds encrypted content to IPFS and then writes hashes of encrypted data to passport in Ethereum network.
   */
  public async setPrivateData(
    factProviderAddress: Address,
    key: string,
    data: number[],
    ipfsClient: IIPFSClient,
  ) {
    // Get passport owner public key
    const pubKeyBytes = await this.ownership.getOwnerPublicKey();

    // Create ECIES with generated keys
    const ecies = ECIES.createGenerated(this.ec);
    const ephemeralPublicKey = ecies.getPublicKey().getPublic('array');

    const pubKeyPair = this.ec.keyFromPublic(Buffer.from(pubKeyBytes));

    // Derive SKM
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.passportAddress, factProviderAddress, key);
    const skm = unmarshalSecretKeyringMaterial(skmData.skm);

    // Encrypt data
    const cryptor = new Cryptor(this.ec.curve);
    const encryptedMsg = cryptor.encryptAuth(skm, data);

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
  }
}
