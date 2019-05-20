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
    txReceipt: any;
    methodInfo: IMethodInfo;
}
/**
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export declare const getTxData: (txHash: string, web3: any) => Promise<ITxData>;
