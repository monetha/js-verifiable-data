import Web3 from 'web3';
import { Transaction } from 'web3-core';
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
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export declare const getTxData: (txHash: string, web3: Web3) => Promise<ITxData>;
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
}) => any;
