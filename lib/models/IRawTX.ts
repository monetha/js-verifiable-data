import { Address } from './Address';

export interface IRawTX {
  from: Address;
  to: Address;
  nonce: string;
  gasPrice: string;
  gasLimit: number;
  value: number;
  data: string;
}
