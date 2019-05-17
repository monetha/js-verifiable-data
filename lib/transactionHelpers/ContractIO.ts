import { Address } from '../models/Address';
import { IRawTX } from '../models/IRawTX';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

/**
 * Helper class to work with contract reading and writing
 */
export class ContractIO {
  private web3: Web3;
  private contract: Contract;
  private contractInstance: any;
  private contractAddress: string;

  constructor(web3: Web3, abi: AbiItem[], contractAddress: Address) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, contractAddress);
    this.contractInstance = this.contract.methods;
    this.contractAddress = contractAddress;
  }

  public getWeb3() {
    return this.web3;
  }

  public getContract() {
    return this.contract;
  }

  public getContractInstance() {
    return this.contractInstance;
  }

  public getContractAddress() {
    return this.contractAddress;
  }

  /**
   * Generates raw unsigned transaction to call smart contract method, which manipulates data
   */
  public async prepareCallTX(
    contractFunctionName: string,
    contractArguments: any[],
    address: Address,
  ): Promise<IRawTX> {

    const contractData = await this.prepareWriteData(
      contractFunctionName,
      contractArguments,
    );

    const rawTx = await this.prepareRawTX(
      address,
      this.contractAddress,
      0,
      contractData,
    );

    return rawTx;
  }

  /**
   * Reads data from contracts (read methods gas free)
   */
  public async readData(
    contractFunctionName: string,
    contractArguments: any[]) {

    return new Promise((resolve, reject) => {
      const args = contractArguments || [];

      const func = this.contractInstance[contractFunctionName];
      if (!func) {
        reject(new Error(`Function ${contractFunctionName} was not found in contract ${this.contractAddress}`));
      }

      func.call(...args, { from: '' }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }

  /**
   * Generates hex from contract data (methods, params)
   */
  private async prepareWriteData(contractFunctionName: string, contractArguments: any[]) {
    const args = contractArguments || [];

    const func = this.contractInstance[contractFunctionName];
    if (!func) {
      throw new Error(`Function ${contractFunctionName} was not found in contract ${this.contractAddress}`);
    }

    return func.getData(...args);
  }

  private async prepareRawTX(fromAddress: Address, toAddress: Address, value: number, data: any): Promise<IRawTX> {
    const nonce = await this.getNonceFromBlockChain(fromAddress);
    const gasPrice = await this.getGasPriceFromBlockChain();
    const gasLimit = await this.getEstimatedGas(data, fromAddress, toAddress);

    return {
      from: fromAddress,
      to: toAddress,
      nonce,
      gasPrice,
      gasLimit,
      value,
      data,
    };
  }

  private async getEstimatedGas(data: any, from: Address, to: Address): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.web3.eth.estimateGas({ data, from, to }, (error, gas) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(gas);
      });
    });
  }

  private getGasPriceFromBlockChain(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.web3.eth.getGasPrice((error, gasPrice) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(this.web3.utils.toHex(gasPrice));
      });
    });
  }

  private async getNonceFromBlockChain(fromAddress: Address): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.web3.eth.getTransactionCount(fromAddress, (error, count) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(this.web3.utils.toHex(count));
      });
    });
  }
}
