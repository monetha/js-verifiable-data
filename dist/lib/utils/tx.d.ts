/// <reference types="node" />
import { Harmony } from '@harmony-js/core';
import { IConfiguredContractMethod, ITxConfig, ContractMethod } from '../models/Method';
export interface IMethodInfo {
    name: string;
    params: IMethodParam[];
}
export interface IMethodParam {
    name: string;
    type: string;
    value: string;
}
/**
 * Gets transaction by hash and recovers its sender public key
 */
export declare const getDecodedTx: (harmony: Harmony, txHash: string) => Promise<{
    tx: any;
    methodInfo: any;
    senderPublicKey: Buffer;
}>;
/**
 * Gets sender's elliptic curve public key (prefixed with byte 4)
 */
export declare const getSenderPublicKey: (harmony: Harmony, tx: any) => Buffer;
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export declare const configureSendMethod: (harmony: Harmony, method: ContractMethod, from: string, params?: ITxConfig) => Promise<IConfiguredContractMethod>;
/**
 * Prepares transaction configuration for execution.
 * This includes nonce, gas price and gas limit estimation
 */
export declare const callMethod: (method: ContractMethod) => Promise<any>;
