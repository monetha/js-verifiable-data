/// <reference types="node" />
import Web3 from 'web3';
import { Transaction } from 'web3-core';
import { IEthOptions } from 'lib/models/IEthOptions.js';
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
