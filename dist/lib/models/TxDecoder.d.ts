import { Transaction } from 'web3-core';
import Web3 from 'web3';
export declare type TxDecoder = (tx: Transaction, web3: Web3) => Promise<Transaction>;
