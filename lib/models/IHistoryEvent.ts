import { Address } from './Address';
import { IEvent } from './IEvent';

export enum EventType {
  Updated = 'Updated',
  Deleted = 'Deleted',
}

export enum DataType {
  Address = 'Address',
  Bool = 'Bool',
  Bytes = 'Bytes',
  Int = 'Int',
  Uint = 'Uint',
  String = 'String',
  TxData = 'TxData',
  IPFSHash = 'IPFSHash',
  PrivateData = 'PrivateDataHashes',
}

export interface IHistoryEvent extends IEvent {
  eventType: EventType;
  dataType: DataType;

  /**
   * Fact provider which made the change
   */
  factProviderAddress: Address;

  /**
   * Key that was changed
   */
  key: string;
}
