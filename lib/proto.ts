import { PassportGenerator } from './passport/PassportGenerator';
import { PassportOwnership } from './passport/PassportOwnership';
import { FactReader } from './passport/FactReader';
import { FactWriter } from './passport/FactWriter';
import { FactRemover } from './passport/FactRemover';
import { Permissions } from './passport/Permissions';
import { PassportReader } from './passport/PassportReader';
import { FactHistoryReader, IFactValue } from './passport/FactHistoryReader';
import { EventType, DataType, IHistoryEvent } from './models/IHistoryEvent';
import { IIPFSClient, IIPFSAddResult } from './models/IIPFSClient';

export default {
  PassportGenerator,
  PassportOwnership,
  PassportReader,
  FactReader,
  FactWriter,
  FactRemover,
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
  Permissions,
  FactHistoryReader,
  EventType,
  DataType,
  IHistoryEvent,
  IIPFSClient,
  IIPFSAddResult,
  IFactValue,
};
