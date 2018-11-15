import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';

export default readPassportFacts = async function (abi, passportAddress, factProviderAddress, dataType, key) {
  var contract = createInstance(abi, passportAddress);
  key = window.web3.fromAscii(key);
  var selectedMethod;
  switch (dataType) {
    case "string": {
      selectedMethod = contract.getString.bind(null, factProviderAddress, key);
    }
      break;
    case "bytes": {
      selectedMethod = contract.getBytes.bind(null, factProviderAddress, key);
    }
      break;
    case "address": {
      selectedMethod = contract.getAddress.bind(null, factProviderAddress, key);
    }
      break;
    case "uint": {
      selectedMethod = contract.getUint.bind(null, factProviderAddress, key);
    }
      break;
    case "int": {
      selectedMethod = contract.getInt.bind(null, factProviderAddress, key);
    }
      break;
    case "bool": {
      selectedMethod = contract.getBool.bind(null, factProviderAddress, key);
    }
      break;
    case "txdata": {
      selectedMethod = contract.getTxDataBlockNumber.bind(null, factProviderAddress, key);
    }
      break;
  }
  result = await performAsync(selectedMethod);
  return result;
}