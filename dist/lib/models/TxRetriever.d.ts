/// <reference types="node" />
import Web3 from 'web3';
import { Transaction } from 'web3-core';
export interface ITxWithMeta {
    tx: Transaction;
    senderPublicKey: Buffer;
}
export declare type TxRetriever = (txHash: string, web3: Web3) => Promise<ITxWithMeta>;
