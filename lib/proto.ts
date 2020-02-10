import { PassportGenerator } from './passport/PassportGenerator';
import { PassportOwnership } from './passport/PassportOwnership';
import { FactReader, IPrivateDataHashes } from './passport/FactReader';
import { FactWriter } from './passport/FactWriter';
import { FactRemover } from './passport/FactRemover';
import { Permissions } from './passport/Permissions';
import { PassportReader } from './passport/PassportReader';
import { PrivateFactReader } from './passport/PrivateFactReader';
import { PrivateFactWriter } from './passport/PrivateFactWriter';
import { FactHistoryReader } from './passport/FactHistoryReader';
import { EventType, DataType, IHistoryEvent } from './models/IHistoryEvent';
import { IIPFSClient, IIPFSAddResult, IIPFSDag, IIPFSLink, IIPLD } from './models/IIPFSClient';
import { IPassportRef } from './models/IPassportRef';
import {
  PrivateDataExchanger,
  ExchangeState,
  IProposeDataExchangeResult,
  IDisputeDataExchangeResult,
  IDataExchangeStatus,
  CurrentTimeGetter,
  getExchangeIndexFromReceipt,
} from './passport/PrivateDataExchanger';
import { ErrorCode } from './errors/ErrorCode';
import { ISdkError } from './errors/SdkError';
import { Address } from './models/Address';
import { IFactValue } from './models/IFactValue';
// import { toBN } from './utils/conversion';
import { RandomArrayGenerator } from './models/RandomArrayGenerator';
import {
  initPassportFactoryContract,
  initPassportLogicContract,
  initPassportContract,
  initPassportLogicRegistryContract,
  initFactProviderRegistryContract,
} from './passport/rawContracts';
import { ISKM } from './passport/privateFactCommon';
import { TxExecutor } from './models/TxExecutor';
// import { FactProviderManager, IFactProviderInfo } from './passport/FactProviderManager';

export {
  PassportGenerator,
  PassportOwnership,
  PassportReader,
  FactReader,
  FactWriter,
  FactRemover,
  PrivateFactReader,
  PrivateFactWriter,
  Permissions,
  FactHistoryReader,
  PrivateDataExchanger,
  EventType,
  DataType,
  IHistoryEvent,
  IIPFSClient,
  IIPFSAddResult,
  IFactValue,
  IPassportRef,
  IIPFSDag,
  IIPFSLink,
  IIPLD,
  IProposeDataExchangeResult,
  IDisputeDataExchangeResult,
  IDataExchangeStatus,
  IPrivateDataHashes,
  CurrentTimeGetter,
  ErrorCode,
  ISdkError,
  Address,
  ExchangeState,
  // toBN,
  RandomArrayGenerator,
  initPassportFactoryContract,
  initPassportLogicContract,
  initPassportContract,
  initPassportLogicRegistryContract,
  initFactProviderRegistryContract,
  getExchangeIndexFromReceipt,
  ISKM,
  // FactProviderManager,
  // IFactProviderInfo,
  TxExecutor,
};
