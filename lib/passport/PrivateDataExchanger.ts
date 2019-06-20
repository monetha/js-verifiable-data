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
      encryptedExchangeKey as any,
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

  public async accept(exchangeIndex: BN, passOwnerAddress: Address, txExecutor: TxExecutor): Promise<void> {
    throw new Error('Not implemented');
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
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Read data -------------------------------------------------------------------

  public async getPrivateData(exchangeIndex: BN, exchangeKey: number[]) {
    throw new Error('Not implemented');
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
  dataKeyHash: number[];
  encryptedExchangeKey: number[];
  exchangeKeyHash: number[];
  encryptedSecretkey: number[];
  state: ExchangeState;
  stateExpirationTime: Date;
}

// #endregion
