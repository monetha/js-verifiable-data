import { IRawTX } from './IRawTX';
import { TransactionReceipt } from 'web3-core';

export type TxExecutor = (rawTx: IRawTX) => TransactionReceipt;
