/// <reference types="node" />
import BN from 'bn.js';
import Web3 from 'web3';
import { Transaction, TransactionConfig } from 'web3-core';
import { IEthOptions } from '../models/IEthOptions';
import { TransactionObject } from '../types/web3-contracts/types';
export interface IMethodInfo {
    name: string;
    params: IMethodParam[];
}
export interface IMethodParam {
    name: string;
    type: string;
    value: string;
}
export interface ITxData {
    tx: Transaction;
    methodInfo: IMethodInfo;
}
/**
 * Gets transaction by hash. Retrieved TX data will be the one which was signed with private key.
 */
export declare const getSignedTx: (txHash: string, web3: Web3, options?: IEthOptions) => Promise<Transaction>;
/**
 * Transforms given transaction (using options.txDecoder if specified) and decodes tx input method. *
 */
export declare const decodeTx: (tx: Transaction, web3: Web3, options?: IEthOptions) => Promise<{
    tx: Transaction;
    methodInfo: any;
}>;
/**
 * Gets sender's elliptic curve public key (prefixed with byte 4)
 */
export declare const getSenderPublicKey: (tx: {
    nonce: string;
    gasPrice: string;
    gas: string;
    to: string;
    value: string;
    input: string;
    r: string;
    s: string;
    v: string;
    hash: string;
}) => Buffer;
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export declare const prepareTxConfig: <TData>(web3: Web3, from: string, to: string, data: TransactionObject<TData>, value?: number | BN, gasLimit?: number) => Promise<TransactionConfig>;
