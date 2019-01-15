import { Web3Provider } from './Web3Provider';
import { IRawTX } from '../models/IRawTX';
import { Address } from '../models/Address';

/**
 * Helper class to work with contract reading and writing
 */
export class ContractIO {
  public web3: any;
  public contract: any;
  public contractInstance: any;
  public contractAddress: string;

  constructor(abi, contractAddress: Address, network: string) {
    this.web3 = new Web3Provider(network).web3;
    this.contract = this.web3.eth.contract(abi);
    this.contractInstance = this.contract.at(contractAddress);
    this.contractAddress = contractAddress;
  }

  /**
   * Generates raw unsigned transaction to call smart contract method, which manipulates data
   */
  public async prepareCallTX(
    contractFunctionName: string,
    contractArguments: any[],
    userAddress: Address,
  ): Promise<IRawTX> {

    const contractData = await this.prepareWriteData(
      contractFunctionName,
      contractArguments,
    );

    const rawTx = await this.prepareRawTX(
      userAddress,
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

      this.contractInstance[contractFunctionName].call(...args, { from: '' }, (err, data) => {
        if (err) {
          const error = 'DID not register';
          reject(error);
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
    return this.contractInstance[contractFunctionName].getData(...args);
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
    return this.web3.eth.estimateGas({ data, from, to });
  }

  private getGasPriceFromBlockChain(): string {
    return this.web3.toHex(this.web3.eth.gasPrice);
  }

  private getNonceFromBlockChain(fromAddress: Address): string {
    const count = this.web3.eth.getTransactionCount(fromAddress);
    return this.web3.toHex(count);
  }
}
