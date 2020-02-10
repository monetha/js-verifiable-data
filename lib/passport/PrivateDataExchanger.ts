import { Contract, formatBytes32String } from '@harmony-js/contract';
import { Harmony } from '@harmony-js/core';
import { TransasctionReceipt } from '@harmony-js/transaction';
import * as abiDecoder from 'abi-decoder';
import BN from 'bn.js';
import { ec } from 'elliptic';
import keccak256 from 'keccak256';
import { ECIES } from 'lib/crypto/ecies/ecies';
import { constantTimeCompare } from 'lib/crypto/utils/compare';
import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { IIPFSClient } from 'lib/models/IIPFSClient';
import { RandomArrayGenerator } from 'lib/models/RandomArrayGenerator';
import { PassportOwnership } from 'lib/proto';
import { hexToArray, hexToBoolean, hexToUnpaddedAscii, toBN, toDate } from 'lib/utils/conversion';
import { ciEquals } from 'lib/utils/string';
import { callMethod, configureSendMethod } from 'lib/utils/tx';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { TxExecutor } from '../models/TxExecutor';
import { deriveSecretKeyringMaterial, ellipticCurveAlg, ISKM } from './privateFactCommon';
import { PrivateFactReader } from './PrivateFactReader';
import { initPassportLogicContract } from './rawContracts';

// TODO: It is not known for now what optimal limits are for Harmony
// const gasLimits = {
//   accept: 90000,
//   dispute: 60000,
//   finish: 60000,
//   propose: 500000,
//   timeout: 60000,
// };

export class PrivateDataExchanger {
  private passportAddress: Address;
  private harmony: Harmony;
  private ec = new ec(ellipticCurveAlg);
  private getCurrentTime: CurrentTimeGetter;

  public constructor(harmony: Harmony, passportAddress: Address, currentTimeGetter?: CurrentTimeGetter) {
    this.harmony = harmony;
    this.passportAddress = passportAddress;

    this.getCurrentTime = currentTimeGetter;
    if (!currentTimeGetter) {
      this.getCurrentTime = () => new Date();
    }
  }

  private getContract(): Contract {
    return initPassportLogicContract(this.harmony, this.passportAddress);
  }

  // #region -------------- Propose -------------------------------------------------------------------

  /**
   * Creates private data exchange proposition
   * @param factKey - fact key name to request data for
   * @param factProviderAddress - fact provider address in hex
   * @param exchangeStakeWei - amount in WEI to stake
   * @param requesterAddress - data requester address (the one who will submit the transaction)
   * @param txExecutor - transaction executor function
   * @param rand - custom cryptographically secure number array generator
   * @param onExchangeKey - a callback, which is invoked as soon as exchange key is generated and available
   */
  public async propose(
    factKey: string,
    factProviderAddress: Address,
    exchangeStakeWei: BN,
    requesterAddress: Address,
    txExecutor: TxExecutor,
    rand?: RandomArrayGenerator,
    onExchangeKey?: (exchangeKey: ISKM) => void,
  ): Promise<IProposeDataExchangeResult> {

    // Get owner public key
    const ownerPublicKeyBytes = await new PassportOwnership(this.harmony, this.passportAddress).getOwnerPublicKey();
    const ownerPubKeyPair = this.ec.keyFromPublic(Buffer.from(ownerPublicKeyBytes));

    // Create exchange key to be shared with passport owner
    const ecies = await ECIES.createGenerated(this.ec, rand);

    const exchangeKeyData = deriveSecretKeyringMaterial(ecies, ownerPubKeyPair, this.passportAddress, factProviderAddress, factKey);
    const encryptedExchangeKey = ecies.getPublicKey().getPublic('array');

    // Pass exchange key to callback
    if (onExchangeKey) {
      onExchangeKey(exchangeKeyData);
    }

    // Propose private data exchange
    const contract = this.getContract();
    const method = contract.methods.proposePrivateDataExchange(
      factProviderAddress,
      formatBytes32String(factKey),
      `0x${Buffer.from(encryptedExchangeKey).toString('hex')}` as any,
      exchangeKeyData.skmHash,
    );

    // Execute transaction
    const txConfig = await configureSendMethod(this.harmony, method, requesterAddress, {
      value: exchangeStakeWei,
      // gasLimit: toBN(gasLimits.propose),
    });
    const receipt = await txExecutor(txConfig);

    // Parse exchange index from tx receipt
    const exchangeIdx = getExchangeIndexFromReceipt(receipt);
    if (exchangeIdx === null) {
      throw createSdkError(ErrorCode.MissingExchangeIdxInReceipt, 'Transaction receipt does not contain "exchangeIdx" in event logs');
    }

    return {
      exchangeIndex: new BN(exchangeIdx, 10),
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
      throw createSdkError(ErrorCode.StatusMustBeProposed, 'Status must be "proposed"');
    }

    // Check for expiration
    const nearFuture = this.getCurrentTime();
    nearFuture.setTime(nearFuture.getTime() + 60 * 60 * 1000);

    if (status.stateExpirationTime < nearFuture) {
      throw createSdkError(ErrorCode.ExchangeExpiredOrExpireSoon, 'Exchange is expired or will expire very soon');
    }

    // Check if private key belongs to passport owner
    try {
      // TODO: probably convert to  address from private key by not using `add` func
      const account = this.harmony.wallet.addByPrivateKey(`0x${passportOwnerPrivateKey.replace('0x', '')}`);
      if (!ciEquals(account.address, status.passportOwnerAddress)) {
        throw new Error();
      }
    } catch {
      throw createSdkError(ErrorCode.InvalidPassportOwnerKey, 'Invalid passport owner private key');
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
      throw createSdkError(ErrorCode.InvalidExchangeKeyHash, 'Exchange key hash in passport is invalid');
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
    const contract = this.getContract();
    const method = contract.methods.acceptPrivateDataExchange(exchangeIndex, encryptedDataSecretKey);

    // Execute transaction (owner stakes same amount as requester)
    const txConfig = await configureSendMethod(this.harmony, method, status.passportOwnerAddress, {
      value: status.requesterStaked,
      // gasLimit: toBN(gasLimits.accept),
    });

    await txExecutor(txConfig);
  }

  // #endregion

  // #region -------------- Timeout -------------------------------------------------------------------

  /**
   * Closes private data exchange after proposition has expired.
   * This can be called only by data exchange requester.
   * @param exchangeIndex - data exchange index
   * @param txExecutor - transaction executor function
   */
  public async timeout(exchangeIndex: BN, txExecutor: TxExecutor): Promise<void> {
    const status = await this.getStatus(exchangeIndex);
    if (status.state !== ExchangeState.Proposed) {
      throw createSdkError(ErrorCode.StatusMustBeProposed, 'Status must be "proposed"');
    }

    // Data requester can call only after expiration date
    const nowMinus1Min = this.getCurrentTime();
    nowMinus1Min.setTime(nowMinus1Min.getTime() - 60 * 1000);

    if (status.stateExpirationTime > nowMinus1Min) {
      throw createSdkError(ErrorCode.CanOnlyCloseAfterExpiration, 'Exchange can only be closed after expiration date');
    }

    // Timeout private data exchange
    const contract = this.getContract();
    const method = contract.methods.timeoutPrivateDataExchange(exchangeIndex);

    const txConfig = await configureSendMethod(this.harmony, method, status.requesterAddress, {
      // gasLimit: toBN(gasLimits.timeout),
    });

    await txExecutor(txConfig);
  }

  // #endregion

  // #region -------------- Dispute -------------------------------------------------------------------

  /**
   * Closes private data exchange after acceptance by dispute.
   * Can be called only by data exhange requester.
   * @param exchangeIndex - data exchange index
   * @param exchangeKey - exchange key, generated by requester when requesting proposal
   * @param txExecutor - transaction executor function
   */
  public async dispute(exchangeIndex: BN, exchangeKey: number[], txExecutor: TxExecutor): Promise<IDisputeDataExchangeResult> {
    const status = await this.getStatus(exchangeIndex);
    if (status.state !== ExchangeState.Accepted) {
      throw createSdkError(ErrorCode.StatusMustBeAccepted, 'Status must be "accepted"');
    }

    // Check for expiration
    const nearFuture = this.getCurrentTime();
    nearFuture.setTime(nearFuture.getTime() + 60 * 60 * 1000);

    if (status.stateExpirationTime < nearFuture) {
      throw createSdkError(ErrorCode.ExchangeExpiredOrExpireSoon, 'Exchange is expired or will expire very soon');
    }

    // Validate exchange key
    const exchangeKeyHash = Array.from<number>(keccak256(Buffer.from(exchangeKey)));
    if (!constantTimeCompare(exchangeKeyHash, status.exchangeKeyHash)) {
      throw createSdkError(ErrorCode.InvalidExchangeKey, 'Invalid exchange key');
    }

    // Dispute private data exchange
    const contract = this.getContract();
    const method = contract.methods.disputePrivateDataExchange(exchangeIndex, exchangeKey);

    const txConfig = await configureSendMethod(this.harmony, method, status.requesterAddress, {
      // gasLimit: toBN(gasLimits.dispute),
    });

    const receipt = await txExecutor(txConfig);

    // Parse cheater address and dispute result
    abiDecoder.addABI(passportLogicAbi);
    const logs = abiDecoder.decodeLogs(receipt.logs);
    const event = logs.find(l => l.name === 'PrivateDataExchangeDisputed');
    const params = event.events;

    const success = params.find(e => e.name === 'successful');
    if (success === undefined) {
      throw createSdkError(ErrorCode.MissingSuccessfulInReceipt, 'Transaction receipt does not contain "successful" in event logs');
    }

    const cheater = params.find(e => e.name === 'cheater');
    if (cheater === undefined) {
      throw createSdkError(ErrorCode.MissingCheaterInReceipt, 'Transaction receipt does not contain "cheater" in event logs');
    }

    return {
      cheaterAddress: cheater.value,
      success: hexToBoolean(cheater.successful),
    };
  }

  // #endregion

  // #region -------------- Finish -------------------------------------------------------------------

  /**
   * Closes private data exchange after acceptance. It's supposed to be called by the data requester,
   * but passport owner can also call it after data exchange is expired.
   * @param exchangeIndex - data exchange index
   * @param requesterOrPassOwnerAddress - address of requester or passport owner (the one who will execute the transaction)
   * @param txExecutor - transaction executor function
   */
  public async finish(exchangeIndex: BN, requesterOrPassOwnerAddress: Address, txExecutor: TxExecutor): Promise<void> {
    const status = await this.getStatus(exchangeIndex);

    // Status should be accepted
    if (status.state !== ExchangeState.Accepted) {
      throw createSdkError(ErrorCode.StatusMustBeAccepted, 'Status must be "accepted"');
    }

    if (ciEquals(requesterOrPassOwnerAddress, status.passportOwnerAddress)) {

      // Passport owner can finish only after expiration date
      const nowMinus1Min = this.getCurrentTime();
      nowMinus1Min.setTime(nowMinus1Min.getTime() - 60 * 1000);

      if (status.stateExpirationTime > nowMinus1Min) {
        throw createSdkError(ErrorCode.PassOwnerCanCloseOnlyAfterExpiration,
          'Passport owner can close exchange only after expiration date');
      }
    } else if (!ciEquals(requesterOrPassOwnerAddress, status.requesterAddress)) {
      throw createSdkError(ErrorCode.OnlyExchangeParticipantsCanClose,
        'Only exchange participants can close the exchange');
    }

    // Finish private data exchange
    const contract = this.getContract();
    const method = contract.methods.finishPrivateDataExchange(exchangeIndex);

    const txConfig = await configureSendMethod(this.harmony, method, requesterOrPassOwnerAddress, {
      value: status.requesterStaked,
      // gasLimit: toBN(gasLimits.finish),
    });

    await txExecutor(txConfig);
  }

  // #endregion

  // #region -------------- Status -------------------------------------------------------------------

  /**
   * Returns the status of private data exchange
   * @param exchangeIndex - data exchange index
   */
  public async getStatus(exchangeIndex: BN): Promise<IDataExchangeStatus> {
    const contract = this.getContract();
    const method = contract.methods.privateDataExchanges(exchangeIndex);
    const rawStatus = await callMethod(method);

    if (!rawStatus) {
      throw createSdkError(ErrorCode.ExchangeNotFound, `Data exchange with index ${exchangeIndex.toString(10)} was not found`);
    }

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
      stateExpirationTime: toDate(rawStatus.stateExpired),
    };

    return status;
  }

  // #endregion

  // #region -------------- Read data -------------------------------------------------------------------

  /**
   * Gets decrypted private data from IPFS by using exchange key.
   * Encrypted secret data encryption key is retrieved from private data exchange and then is decrypted using provided exchangeKey.
   * Then this decrypted secret key is used to decrypt private data, stored in IPFS.
   * @param exchangeIndex - data exchange index
   * @param exchangeKey - exchange key, which is generated and known by data requester
   * @param ipfsClient - IPFS client for private data retrieval
   */
  public async getPrivateData(exchangeIndex: BN, exchangeKey: number[], ipfsClient: IIPFSClient): Promise<number[]> {
    const status = await this.getStatus(exchangeIndex);

    // Status should be accepted or closed
    if (status.state !== ExchangeState.Accepted && status.state !== ExchangeState.Closed) {
      throw createSdkError(ErrorCode.StatusMustBeAcceptedOrClosed, 'Exchange status must be "accepted" or "closed"');
    }

    // Validate exchange key
    const exchangeKeyHash = Array.from<number>(keccak256(Buffer.from(exchangeKey)));
    if (!constantTimeCompare(exchangeKeyHash, status.exchangeKeyHash)) {
      throw createSdkError(ErrorCode.InvalidExchangeKey, 'Invalid exchange key');
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
      throw createSdkError(ErrorCode.InvalidDecryptedSecretDataKey, 'Decrypted secret data key is invalid');
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

// #region -------------- Types -------------------------------------------------------------------

export type CurrentTimeGetter = () => Date;

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

// #region -------------- Utils -------------------------------------------------------------------

/**
 * Extracts data exchange index from proposal receipt.
 * Returns null in case exchangeIdx was not found in receipt logs
 */
export function getExchangeIndexFromReceipt(receipt: TransasctionReceipt): string {
  abiDecoder.addABI(passportLogicAbi);

  if (!receipt || !receipt.logs) {
    return null;
  }

  const logs = abiDecoder.decodeLogs(receipt.logs);
  const exchangeIdxData = logs[0].events.find(e => e.name === 'exchangeIdx');
  if (!exchangeIdxData) {
    return null;
  }

  return exchangeIdxData.value;
}

// #endregion
