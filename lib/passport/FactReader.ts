import { Address } from '../models/Address';
import { fetchEvents } from '../utils/fetchEvents';
import { getTxData } from '../utils/getTxData';
import { ContractIO } from '../transactionHelpers/ContractIO';
import { IIPFSClient } from '../models/IIPFSClient';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import passportLogicAbi from '../../config/PassportLogic.json';
import { EC, KeyPair } from 'elliptic';

/**
 * Class to read latest facts from the passport
 */
export class FactReader {
  private contractIO: ContractIO;
  private ethNetworkUrl: string;

  private get web3() { return this.contractIO.getWeb3(); }
  private get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3: Web3, ethNetworkUrl: string, passportAddress: Address) {
    this.ethNetworkUrl = ethNetworkUrl;
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
  }

  /**
   * Read string type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getString(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getString', factProviderAddress, key);
  }

  /**
   * Read bytes type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBytes(factProviderAddress: Address, key: string): Promise<number[]> {
    const value = await this.get('getBytes', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return this.web3.utils.hexToBytes(value);
  }

  /**
   * Read address type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getAddress(factProviderAddress: Address, key: string): Promise<string> {
    return this.get('getAddress', factProviderAddress, key);
  }

  /**
   * Read uint type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getUint(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getUint', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return value.toNumber();
  }

  /**
   * Read int type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getInt(factProviderAddress: Address, key: string): Promise<number> {
    const value = await this.get('getInt', factProviderAddress, key);
    if (!value) {
      return value;
    }

    return value.toNumber();
  }

  /**
   * Read boolean type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getBool(factProviderAddress: Address, key: string): Promise<boolean> {
    return this.get('getBool', factProviderAddress, key);
  }

  /**
   * Read TX data type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   */
  public async getTxdata(factProviderAddress: Address, key: string): Promise<number[]> {
    const data = await this.get('getTxDataBlockNumber', factProviderAddress, key);

    if (!data) {
      return null;
    }

    const blockNumHex = this.web3.utils.toHex(data);
    const events = await fetchEvents(this.ethNetworkUrl, blockNumHex, blockNumHex, this.passportAddress);
    const txInfo = await getTxData(events[0].transactionHash, this.web3);
    const txDataString = txInfo.methodInfo.params[1].value;
    const txData = this.web3.utils.hexToBytes(txDataString);

    return txData;
  }

  /**
   * Read IPFS hash type fact from passport
   *
   * @param factProviderAddress fact provider to read fact for
   * @param key fact key
   * @param ipfs IPFS client
   *
   * @returns data stored in IPFS
   */
  public async getIPFSData(factProviderAddress: Address, key: string, ipfs: IIPFSClient): Promise<any> {
    const hash = await this.get('getIPFSHash', factProviderAddress, key);
    if (!hash) {
      return null;
    }

    // Get hash
    return ipfs.cat(hash);
  }

  public async readPrivateData(passportOwnerPrivateKey: string, factProviderAddress: Address, key: string, ipfs: IIPFSClient): Promise<any> {

    // Libraries to be used
    // elliptic  for Elliptic Curve Integrated Encryption Scheme operations
    // hash.js for hashing
    // BN.js (part of web3.utils) for big number operations

    // TODO: move to general place for sensitive data configuration
    // ipfsPublicKeyFileName - file name of a public key in IPFS
    const ipfsPublicKeyFileName = 'public_key';
    // ipfsEncryptedMessageFileName - file name of an encrypted message
    const ipfsEncryptedMessageFileName = 'encrypted_message';
    // ipfsMessageHMACFileName - file name of hashed MAC (Message Authentication Code)
    const ipfsMessageHMACFileName = 'hmac';
    // curve - elliptical curve for Ethereum cryptography
    const curve = 'secp256k1';

    this.web3.eth.accounts.privateKeyToAccount(passportOwnerPrivateKey);

    // Retrieve private data hashes (bool success, string dataIPFSHash, bytes32 dataKeyHash) as an array, each parameter is
    // mapped in an array by its' index
    // success - flag which determines if value was written prior reading or this is a default value from Ethereum storage
    // dataIPFSHash - IPFS hash of the encrypted data
    // dataKeyHash - hash of of the secret which was used for encryption
    const privateDataHashes = await this.contractIO.readData('getPrivateDataHashes', [factProviderAddress, key]);

    if (!privateDataHashes[0]) {
      return null;
    }

    const dataIPFSHash = privateDataHashes[1];
    const dataKeyHash = privateDataHashes[2];

    // ----- TODO: DecryptSecretKey(ctx, passportOwnerPrivateKey, factProviderHashes, passportAddress, factProviderAddress, factKey)

    // read data from IPFS
    const publicKey = await ipfs.cat(`${dataIPFSHash}/${ipfsPublicKeyFileName}`);

    const ec = new EC(curve);

    const passportOwnerKeyPair = new KeyPair(ec, {
      priv: passportOwnerPrivateKey,
    });

    const factKeyPair = new KeyPair(ec, {
      pub: publicKey,
    });

    // ---------- decrypt the secret key deriveSecretKeyringMaterial()

    const seed = Buffer.concat([Buffer.from(factProviderAddress, 'hex'), Buffer.from(this.passportAddress, 'hex'), Buffer.from(key, 'utf8')]);

    // sk a derived key (aka shared key for encryption)
    const sk = passportOwnerKeyPair.derive(factKeyPair.getPublic('string', 'hex'));

    // secret keying material - hashing the key with seed to hide the
    // const skm = concatKDF(hash, sk, seed)

    // skm = 64 bytes; first 32 bytes encryption key; second 32 bytes MAC key
    const skm = '';

    const hashedSKM = this.web3.utils.sha3(skm);

    if (dataKeyHash !== hashedSKM) {
      return null;
    }
    // ----------
    // -----

    // ----- TODO: DecryptPrivateData(ctx, factProviderHashes.DataIPFSHash, secretKey, passportOwnerPrivateKey.Curve)
  }

  private async get(method: string, factProviderAddress: Address, key: string) {
    const preparedKey = this.web3.utils.fromAscii(key);

    // Contract returns result = (bool success, any value) as an array, each parameter is mapped in an array by its' index
    // success - flag which determines if value was written prior reading or this is a default value from Ethereum storage
    // value - data read from Ethereum storage
    const result = await this.contractIO.readData(method, [factProviderAddress, preparedKey]);

    // Return null in case if value was not initialized
    if (!result[0]) {
      return null;
    }

    return result[1];
  }
}
