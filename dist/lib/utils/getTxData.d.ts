import Web3 from 'web3';
/**
 * Decodes transaction data using the transaction hash
 *
 * @param txHash transaction hash
 * @param web3 web3 instance
 */
export declare const getTxData: (txHash: string, web3: Web3) => Promise<any>;
