import { Address } from '../models/Address';
import { IRawTX } from '../models/IRawTX';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
/**
 * Helper class to work with contract reading and writing
 */
export declare class ContractIO {
    private web3;
    private contract;
    private contractAddress;
    constructor(web3: Web3, abi: AbiItem[], contractAddress: Address);
    getWeb3(): Web3;
    getContract(): Contract;
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
