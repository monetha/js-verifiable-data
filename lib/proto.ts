import { PassportGenerator } from './passport/PassportGenerator';
import { PassportOwnership } from './passport/PassportOwnership';
import { FactReader } from './passport/FactReader';
import { FactWriter } from './passport/FactWriter';
import { FactRemover } from './passport/FactRemover';
import { Permissions } from './passport/Permissions';
import { PassportReader } from './passport/PassportReader';
import { PrivateFactReader } from './passport/PrivateFactReader';
import { PrivateFactWriter } from './passport/PrivateFactWriter';
import { FactHistoryReader, IFactValue } from './passport/FactHistoryReader';
import { EventType, DataType, IHistoryEvent } from './models/IHistoryEvent';
import { IIPFSClient, IIPFSAddResult, IIPFSDag, IIPFSLink, IIPLD } from './models/IIPFSClient';
import { IPassportRef } from './models/IPassportRef';
import { IEthOptions } from './models/IEthOptions';
import { PrivateDataExchanger, ExchangeState } from './passport/PrivateDataExchanger';
import { TxExecutor } from './models/TxExecutor';
import { ErrorCode } from './errors/ErrorCode';
import { ISdkError } from './errors/SdkError';
import * as quorum from './extensions/quorum';
import { fetchEvents } from './utils/fetchEvents';
import { Address } from './models/Address';
import { IRawTX } from './models/IRawTX';
import { toBN } from './utils/conversion';

const ext = {
  quorum,
};

export default {
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
  EventType,
  DataType,
  PrivateDataExchanger,
  ErrorCode,
  ExchangeState,
  ext,
  toBN,
};

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
  IRawTX,
  TxExecutor,
  ErrorCode,
  ISdkError,
  fetchEvents,
  IEthOptions,
  Address,
  ExchangeState,
  ext,
  toBN,
};
