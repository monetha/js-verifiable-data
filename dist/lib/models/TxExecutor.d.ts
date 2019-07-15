import { TransactionReceipt, TransactionConfig } from 'web3-core';
export declare type TxExecutor = (rawTx: TransactionConfig) => Promise<TransactionReceipt>;
