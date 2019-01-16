import { Address } from './Address';
import { Hex } from './Hex';

export interface IEvent {
  logIndex: number;
  transactionIndex: number;
  transactionHash: Hex;
  blockNumber: number;
  blockHash: Hex;
  address: Address;
  data: string;
  topics: string[];
  type: EventType | string;
}

export enum EventType {
  Pending = 'pending',
  Mined = 'mined',
}
