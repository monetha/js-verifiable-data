import Web3 from 'web3';
import { Transaction } from 'web3-core';

export type TxRetriever = (txHash: string, web3: Web3) => Promise<Transaction>;
