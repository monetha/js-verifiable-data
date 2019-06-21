import * as abiDecoder from 'abi-decoder';
import { Address } from '../models/Address';
import BN from 'bn.js';
import { TxExecutor } from '../models/TxExecutor';
import Web3 from 'web3';
import { PassportOwnership } from 'lib/proto';
import { ECIES } from 'lib/crypto/ecies/ecies';
import { ec } from 'elliptic';
import { ellipticCurveAlg, deriveSecretKeyringMaterial } from './privateFactCommon';
import { PassportLogic } from 'lib/types/web3-contracts/PassportLogic';
import passportLogicAbi from '../../config/PassportLogic.json';
import { AbiItem } from 'web3-utils';
import { ContractIO } from 'lib/transactionHelpers/ContractIO';
import { hexToArray, hexToUnpaddedAscii, toBN } from 'lib/utils/conversion';
import { IIPFSClient } from 'lib/models/IIPFSClient';
import { constantTimeCompare } from 'lib/crypto/utils/compare';
import { PrivateFactReader } from './PrivateFactReader';
import keccak256 from 'keccak256';

export class PrivateDataExchanger {
  private passportAddress: Address;
  private web3: Web3;
  private passportLogic: ContractIO<PassportLogic>;
  private ec = new ec(ellipticCurveAlg);

  public constructor(web3: Web3, passportAddress: Address) {
    this.web3 = web3;
    this.passportAddress = passportAddress;
    this.passportLogic = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
  }

  // #region -------------- Propose -------------------------------------------------------------------

  /**
   * Creates private data exchange proposition
   * @param factKey - fact key name to request data for
   * @param factProviderAddress - fact provider address
   * @param exchangeStakeWei - amount in WEI to stake
   * @param requesterAddress - data requester address (the one who will submit the transaction)
   * @param txExecutor - transaction executor function
   */
  public async propose(
    factKey: string,
    factProviderAddress: Address,
    exchangeStakeWei: BN,
    requesterAddress: Address,
    txExecutor: TxExecutor,
  ): Promise<IProposeDataExchangeResult> {

    // Get owner public key
    const ownerPublicKeyBytes = await new PassportOwnership(this.web3, this.passportAddress).getOwnerPublicKey();
    const ownerPubKeyPair = this.ec.keyFromPublic(Buffer.from(ownerPublicKeyBytes));

    // Create exchange key to be shared with passport owner
    const ecies = ECIES.createGenerated(this.ec);

    const exchangeKeyData = deriveSecretKeyringMaterial(ecies, ownerPubKeyPair, this.passportAddress, factProviderAddress, factKey);
    const encryptedExchangeKey = ecies.getPublicKey().getPublic('array');

    // Propose private data exchange
    const contract = this.passportLogic.getContract();
    const tx = contract.methods.proposePrivateDataExchange(
      factProviderAddress,
      this.web3.utils.fromAscii(factKey),
      `0x${Buffer.from(encryptedExchangeKey).toString('hex')}` as any,
      exchangeKeyData.skmHash,
    );

    // Execute transaction
    const rawTx = await this.passportLogic.prepareRawTX(requesterAddress, this.passportAddress, exchangeStakeWei, tx);
    const receipt = await txExecutor(rawTx);

    // Parse exchange index from tx receipt
    abiDecoder.addABI(passportLogicAbi);
    const logs = abiDecoder.decodeLogs(receipt.logs);
    const exchangeIdxData = logs[0].events.find(e => e.name = 'exchangeIdx');
    if (!exchangeIdxData) {
      throw new Error('Transaction receipt does not contain "exchangeIdx" in event logs');
    }

    return {
      exchangeIndex: new BN(exchangeIdxData.value, 10),
      exchangeKey: exchangeKeyData.skm,
      exchangeKeyHash: exchangeKeyData.skmHash,
    };
  }

  // #endregion

  // #region -------------- Accept -------------------------------------------------------------------

  /**
   * Accepts private data exchange proposition (should be called only by the passport owner)
   * @param exchangeIndex - data exchange index
   * @param txExecutor - transaction executor function
   */
  public async accept(exchangeIndex: BN, passportOwnerPrivateKey: string, ipfsClient: IIPFSClient, txExecutor: TxExecutor): Promise<void> {
    const status = await this.getStatus(exchangeIndex);
    if (status.state !== ExchangeState.Proposed) {
      throw new Error('Status must be "proposed"');
    }

    // Check for expiration
    const nearFuture = new Date();
    nearFuture.setTime(nearFuture.getTime() + 60 * 60 * 1000);

    if (status.stateExpirationTime < nearFuture) {
      throw new Error('Exchange is expired or will expire very soon');
    }

    // Decrypt exchange key
    const exchangePubKeyPair = this.ec.keyPair({
      pub: status.encryptedExchangeKey,
    });

    const passportOwnerPrivateKeyPair = this.ec.keyPair({
      priv: passportOwnerPrivateKey.replace('0x', ''),
      privEnc: 'hex',
    });

    const ecies = new ECIES(passportOwnerPrivateKeyPair);

    const exchangeKey = deriveSecretKeyringMaterial(
      ecies,
      exchangePubKeyPair,
      this.passportAddress,
      status.factProviderAddress,
      status.factKey);

    // Is decrypted exchange key valid?
    if (!constantTimeCompare(status.exchangeKeyHash, exchangeKey.skmHash)) {
      throw new Error('Proposed exchange has invalid exchange key hash');
    }

    // Decrypt data secret encryption key
    const privateReader = new PrivateFactReader();
    const dataSecretKey = await privateReader.decryptSecretKey(
      passportOwnerPrivateKeyPair,
      {
        dataIpfsHash: status.dataIpfsHash,
        dataKeyHash: `0x${Buffer.from(status.dataKeyHash).toString('hex')}`,
      },
      status.factProviderAddress,
      this.passportAddress,
      status.factKey,
      ipfsClient,
    );

    // XOR data secret encryption key with exchange key
    const encryptedDataSecretKey: number[] = [];
    exchangeKey.skm.forEach((value, i) => {

      // tslint:disable-next-line: no-bitwise
      encryptedDataSecretKey[i] = dataSecretKey[i] ^ value;
    });

    // Accept private data exchange
    const contract = this.passportLogic.getContract();
    const tx = contract.methods.acceptPrivateDataExchange(`0x${exchangeIndex.toString('hex')}`, encryptedDataSecretKey);

    // Execute transaction (owner stakes same amount as requester)
    const rawTx = await this.passportLogic.prepareRawTX(
      status.passportOwnerAddress,
      this.passportAddress,
      status.requesterStaked,
      tx,
    );

    await txExecutor(rawTx);
  }

  // #endregion

  // #region -------------- Timeout -------------------------------------------------------------------

  public async timeout(exchangeIndex: BN, requesterAddress: Address, txExecutor: TxExecutor): Promise<void> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Dispute -------------------------------------------------------------------

  public async dispute(exchangeIndex: BN, requesterOrPassOwnerAddress: Address, txExecutor: TxExecutor): Promise<IDisputeDataExchangeResult> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Finish -------------------------------------------------------------------

  public async finish(exchangeIndex: BN, requesterOrOtherAddress: Address, txExecutor: TxExecutor): Promise<void> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Status -------------------------------------------------------------------

  public async getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus> {
    const rawStatus = await this.passportLogic.getContract().methods.privateDataExchanges(`0x${exchangeIndex.toString('hex')}`).call();

    const status: IDataExchangeStatus = {
      dataIpfsHash: rawStatus.dataIPFSHash,
      encryptedExchangeKey: hexToArray(rawStatus.encryptedExchangeKey as any),
      dataKeyHash: hexToArray(rawStatus.dataKeyHash),
      encryptedDataKey: hexToArray(rawStatus.encryptedDataKey),
      exchangeKeyHash: hexToArray(rawStatus.exchangeKeyHash),
      factKey: hexToUnpaddedAscii(rawStatus.key),
      factProviderAddress: rawStatus.factProvider,
      passportOwnerAddress: rawStatus.passportOwner,
      passportOwnerStaked: toBN(rawStatus.passportOwnerValue),
      requesterAddress: rawStatus.dataRequester,
      requesterStaked: toBN(rawStatus.dataRequesterValue),
      state: Number(rawStatus.state) as ExchangeState,
      stateExpirationTime: new Date((rawStatus.stateExpired as any).toNumber() * 1000),
    };

    return status;
  }

  // #endregion

  // #region -------------- Read data -------------------------------------------------------------------

  public async getPrivateData(exchangeIndex: BN, exchangeKey: number[], ipfsClient: IIPFSClient): Promise<number[]> {
    const status = await this.getStatus(exchangeIndex);

    // Status should be accepted or closed
    if (status.state !== ExchangeState.Accepted && status.state !== ExchangeState.Closed) {
      throw new Error('Exchange status must be "accepted" or "closed"');
    }

    // Validate exchange key
    const exchangeKeyHash = Array.from<number>(keccak256(Buffer.from(exchangeKey)));
    if (!constantTimeCompare(exchangeKeyHash, status.exchangeKeyHash)) {
      throw new Error('Invalid exchange key');
    }

    // Decrypt data secret encryption key using exchange key (by XOR'ing encrypted secret key with exchange key)
    const dataSecretKey: number[] = [];
    status.encryptedDataKey.forEach((value, i) => {

      // tslint:disable-next-line: no-bitwise
      dataSecretKey[i] = exchangeKey[i] ^ value;
    });

    // Validate secret key
    const dataSecretKeyHash = Array.from<number>(keccak256(Buffer.from(dataSecretKey)));
    if (!constantTimeCompare(dataSecretKeyHash, status.dataKeyHash)) {
      throw new Error('Decrypted secret key is invalid');
    }

    // Read data
    const reader = new PrivateFactReader();
    return reader.decryptPrivateData(
      status.dataIpfsHash,
      dataSecretKey,
      null,
      ipfsClient,
    );
  }

  // #endregion
}

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IProposeDataExchangeResult {
  exchangeIndex: BN;
  exchangeKey: number[];
  exchangeKeyHash: number[];
}

export interface IDisputeDataExchangeResult {
  success: boolean;
  cheaterAddress: Address;
}

export enum ExchangeState {
  Closed = 0,
  Proposed = 1,
  Accepted = 2,
}

export interface IDataExchangeStatus {
  requesterAddress: Address;
  requesterStaked: BN;
  passportOwnerAddress: Address;
  passportOwnerStaked: BN;
  factProviderAddress: Address;
  factKey: string;
  dataIpfsHash: string;
  encryptedExchangeKey: number[];
  exchangeKeyHash: number[];
  encryptedDataKey: number[];
  dataKeyHash: number[];
  state: ExchangeState;
  stateExpirationTime: Date;
}

// #endregion
