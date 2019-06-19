import { IRawTX } from './IRawTX';
import { TransactionReceipt } from 'web3-core';
export declare type TxExecutor = (rawTx: IRawTX) => TransactionReceipt;
