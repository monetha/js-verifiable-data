import { Address } from './Address';
import BN from 'bn.js';
export interface IRawTX {
    from: Address;
    to: Address;
    nonce: string;
    gasPrice: string;
    gasLimit: number;
    value: number | BN;
    data: string;
}
