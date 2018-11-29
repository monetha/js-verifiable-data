import web3 from '../../../lib/web3'

const getDataFromSmartContract = async (
  contractAddress,
  contractFunctionName,
  contractArguments,
  abi,
  fromAddress) => {
  return new Promise(function (resolve, reject) {
    let Contract, contractInstance
    Contract = web3.eth.contract(abi)
    contractInstance = Contract.at(contractAddress)
    contractArguments = contractArguments || []
    contractInstance[contractFunctionName].call(...contractArguments, { from: fromAddress }, function (err, data) {
      if (err) {
        const error = 'DID not registered'
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

export default getDataFromSmartContract
