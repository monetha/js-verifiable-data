import { TransactionReceipt, TransactionConfig } from 'web3-core';

export type TxExecutor = (rawTx: TransactionConfig) => Promise<TransactionReceipt>;
