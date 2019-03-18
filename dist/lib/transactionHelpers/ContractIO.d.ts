import { Address } from '../models/Address';
import { IRawTX } from '../models/IRawTX';
/**
 * Helper class to work with contract reading and writing
 */
export declare class ContractIO {
    private web3;
    private contract;
    private contractInstance;
    private contractAddress;
    constructor(web3: any, abi: any, contractAddress: Address);
    getWeb3(): any;
    getContract(): any;
    getContractInstance(): any;
    getContractAddress(): string;
    /**
     * Generates raw unsigned transaction to call smart contract method, which manipulates data
     */
    prepareCallTX(contractFunctionName: string, contractArguments: any[], address: Address): Promise<IRawTX>;
    /**
     * Reads data from contracts (read methods gas free)
     */
    readData(contractFunctionName: string, contractArguments: any[]): Promise<{}>;
    /**
     * Generates hex from contract data (methods, params)
     */
    private prepareWriteData;
    private prepareRawTX;
    private getEstimatedGas;
    private getGasPriceFromBlockChain;
    private getNonceFromBlockChain;
}
