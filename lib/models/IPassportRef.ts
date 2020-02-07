import { IEvent } from './IEvent';

export interface IPassportRef extends IEvent {
  passportAddress: string;
  ownerAddress: string;
}
