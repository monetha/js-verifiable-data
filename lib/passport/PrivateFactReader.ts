import { ContractIO } from '../transactionHelpers/ContractIO';
import Web3 from 'web3';
import passportLogicAbi from '../../config/PassportLogic.json';
import { Address } from '../models/Address';
import { AbiItem } from 'web3-utils';

/**
 * Class to read private facts
 */
export class PrivateFactReader {
  private contractIO: ContractIO;

  private get web3() { return this.contractIO.getWeb3(); }
  private get passportAddress() { return this.contractIO.getContractAddress(); }

  constructor(web3: Web3, passportAddress: Address) {
    this.contractIO = new ContractIO(web3, passportLogicAbi as AbiItem[], passportAddress);
  }

  public async getPrivateData(passportOwnerPrivateKey: any, factProviderAddress: Address, key: string) {

  }

  private async getPrivateDataHashes(factProviderAddress: Address, key: string) {

  }
}
