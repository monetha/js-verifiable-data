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
import { IIPFSClient, IIPFSAddResult } from './models/IIPFSClient';
import { IPassportRef } from './models/IPassportRef';

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
  EventType,
  DataType,
  IHistoryEvent,
  IIPFSClient,
  IIPFSAddResult,
  IFactValue,
  IPassportRef,
};
