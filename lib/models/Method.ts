import { ContractMethod } from '@harmony-js/contract/dist/methods/method';
import BN = require('bn.js');

export interface ITxConfig {
  from?: string;
  to?: string;
  shardID?: number | string;
  toShardID?: number | string;
  gasLimit?: BN;
  gasPrice?: BN;
  value?: BN;
  data?: string;
  nonce?: string;
}

export { ContractMethod };

export interface IConfiguredContractMethod {
  method: ContractMethod;
  txConfig: ITxConfig;
}
