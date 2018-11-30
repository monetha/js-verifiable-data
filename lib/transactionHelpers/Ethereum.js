import EthereumTx from 'ethereumjs-tx'
import EthereumWallet from 'ethereumjs-wallet'
import Web3 from 'web3'

export class Ethereum {

  constructor(abi, contractAddress, network) {
    const url = network == "mainnet" ? 'https://mainnet.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90' : 'https://ropsten.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90'
    this.web3 = new Web3(new Web3.providers.HttpProvider(url))
    this.Contract = this.web3.eth.contract(abi)
    this.contractInstance = Contract.at(contractAddress)
    this.contractAddress = contractAddress
  }

  getEstimatedGas (data, from, to) {
    const gas = this.web3.eth.estimateGas({ data, from, to })
    return gas
  }

  getGasPriceFromBlockChain () {
    return this.web3.toHex(this.web3.eth.gasPrice)
  }

  getNonceFromBlockChain (fromAddress) {
    const count = this.web3.eth.getTransactionCount(fromAddress)
    return this.web3.toHex(count)
  }

  async generateRawTransaction (fromAddress, toAddress, value, data) {
    const nonce = await getNonceFromBlockChain(fromAddress)
    const gasPrice = await getGasPriceFromBlockChain()
    const gasLimit = await getEstimatedGas(data, fromAddress, toAddress)

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
    const tx = new EthereumTx(rawTx)
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

    const contractData = await generateDataForSmartContractInteraction(
      contractFunctionName,
      contractArguments
    )

    const rawTx = await generateRawTransaction(
      userWallet.getAddressString(),
      this.contractAddress,
      0,
      contractData
    )

    const signedTransaction = await generateSignedTransaction(
      rawTx,
      userWallet.getPrivateKey().toString('hex')
    )

    return signedTransaction
  }


  async getDataFromSmartContract (
    contractFunctionName,
    contractArguments) {
    return new Promise(function (resolve, reject) {
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
