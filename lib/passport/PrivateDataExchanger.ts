import { Address } from '../models/Address';
import BN from 'bn.js';
import { TxExecutor } from '../models/TxExecutor';

export class PrivateDataExchanger {
  private passportAddress: Address;
  private txExecutor: TxExecutor;

  public constructor(passportAddress: Address, txExecutor?: TxExecutor) {
    this.passportAddress = passportAddress;
    this.txExecutor = txExecutor;
  }

  // #region -------------- Propose -------------------------------------------------------------------

  public async propose(factKey: string, factProviderAddress: Address, exchangeStakeWei: BN): Promise<IPropseDataExchangeResult> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Accept -------------------------------------------------------------------

  public async accept(exchangeIndex: BN): Promise<void> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Timeout -------------------------------------------------------------------

  public async timeout(exchangeIndex: BN): Promise<void> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Dispute -------------------------------------------------------------------

  public async dispute(exchangeIndex: BN): Promise<IDisputeDataExchangeResult> {
    throw new Error('Not implemented');
  }

  // #endregion

  // #region -------------- Finish -------------------------------------------------------------------

  public async finish(exchangeIndex: BN): Promise<void> {
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

export interface IPropseDataExchangeResult {
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
