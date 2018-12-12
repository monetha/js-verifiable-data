import Web4 from './Web4';

// Class to use all web ethereum method for gasprice. nonce, gaslimit, contractInstance
export class Ethereum {
  web4: any;
  Contract: any;
  contractInstance: any;
  contractAddress: any;
  constructor(abi, contractAddress, network) {
    this.web4 = new Web4(network).web4;
    this.Contract = this.web4.eth.contract(abi)
    this.contractInstance = this.Contract.at(contractAddress)
    this.contractAddress = contractAddress
  }

  getEstimatedGas (data, from, to) {
    const gas = this.web4.eth.estimateGas({ data, from, to })
    return gas
  }

  getGasPriceFromBlockChain () {
    return this.web4.toHex(this.web4.eth.gasPrice)
  }

  getNonceFromBlockChain (fromAddress) {
    const count = this.web4.eth.getTransactionCount(fromAddress)
    return this.web4.toHex(count)
  }

  async generateRawTransaction (fromAddress, toAddress, value, data) {
    const nonce = await this.getNonceFromBlockChain(fromAddress)
    const gasPrice = await this.getGasPriceFromBlockChain()
    const gasLimit = await this.getEstimatedGas(data, fromAddress, toAddress)

    return {
      from: fromAddress,
      nonce,
      gasPrice,
      gasLimit,
      to: toAddress,
      value,
      data
    }
  }

  // generates hex from contract data (methods, params)
  async generateDataForSmartContractInteraction (
    contractFunctionName,
    contractArguments
  ) {
    contractArguments = contractArguments || []
    return this.contractInstance[contractFunctionName].getData(...contractArguments)
  }

  // method to generate raw unsigned transaction 
  async generateRawTransactionForSmartContractInteraction (
    contractFunctionName,
    contractArguments,
    userAddress
  ) {
   
    const contractData = await this.generateDataForSmartContractInteraction(
      contractFunctionName,
      contractArguments
    )

    const rawTx = await this.generateRawTransaction(
      userAddress,
      this.contractAddress,
      0,
      contractData
    )

    return rawTx
  }

// method to read data from contracts (read methods gas free)
  async getDataFromSmartContract (
    contractFunctionName,
    contractArguments) {
    return new Promise((resolve, reject) => {
      contractArguments = contractArguments || []
      this.contractInstance[contractFunctionName].call(...contractArguments, { from: ""}, function (err, data) {
        if (err) {
          const error = 'DID not registered'
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

}
export default Ethereum
