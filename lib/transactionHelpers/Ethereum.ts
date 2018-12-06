const EthereumTx = require('ethereumjs-tx');
const EthereumWallet = require('ethereumjs-wallet');
import Web4 from './Web4';

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

  async generateSignedTransaction (rawTx, privateKey) {
    const userWallet = EthereumWallet.fromPrivateKey(
      Buffer.from(privateKey.replace(/^(0x)/, ''), 'hex')
    )
    const tx:any = new EthereumTx(rawTx)
    tx.sign(userWallet.getPrivateKey())
    return `0x${tx.serialize().toString('hex')}`
  }

  async generateDataForSmartContractInteraction (
    contractFunctionName,
    contractArguments
  ) {
    contractArguments = contractArguments || []
    return this.contractInstance[contractFunctionName].getData(...contractArguments)
  }

  async generateSignedRawTransactionForSmartContractInteraction (
    contractFunctionName,
    contractArguments,
    privateKey
  ) {
    const userWallet = EthereumWallet.fromPrivateKey(
      Buffer.from(privateKey.replace(/^(0x)/, ''), 'hex')
    )

    const contractData = await this.generateDataForSmartContractInteraction(
      contractFunctionName,
      contractArguments
    )

    const rawTx = await this.generateRawTransaction(
      userWallet.getAddressString(),
      this.contractAddress,
      0,
      contractData
    )

    const signedTransaction = await this.generateSignedTransaction(
      rawTx,
      userWallet.getPrivateKey().toString('hex')
    )

    return signedTransaction
  }


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
