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
import { PassportOwnership } from './PassportOwnership.js';
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

    // TODO: NOT WORKING
    const pubKeyPair = this.ec.keyPair({
      pub: pubKeyBytes,
    });

    // Derive SKM
    const skmData = deriveSecretKeyringMaterial(ecies, pubKeyPair, this.passportAddress, factProviderAddress, key);
    const skm = unmarshalSecretKeyringMaterial(skmData.skm);

    // Encrypt data
    const cryptor = new Cryptor(this.ec.curve);
    const encryptedMsg = cryptor.encryptAuth(skm, data);



    // const hashes = await this.reader.getPrivateDataHashes(factProviderAddress, key);

    // const passportOwnerPrivateKeyPair = this.ec.keyPair({
    //   priv: passportOwnerPrivateKey,
    //   privEnc: 'hex',
    // });

    // const secretKey = await this.decryptSecretKey(passportOwnerPrivateKeyPair, hashes, factProviderAddress, key, ipfsClient);

    // return this.decryptPrivateData(hashes.dataIpfsHash, secretKey, passportOwnerPrivateKeyPair.ec.curve, ipfsClient);
  }
}
