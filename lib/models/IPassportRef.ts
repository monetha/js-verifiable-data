import { EventData } from 'web3-eth-contract';

export interface IPassportRef extends EventData {
  passportAddress: string;
  ownerAddress: string;
}
