import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

export default writePassportFacts = async function (abi, passportAddress, dataType, data) {

  var contract = createInstance(abi, passportAddress);
  var key = window.web3.fromAscii(data.key);
  var selectedMethod;
  var trxHash;

  switch (dataType) {
    case "string": {
      selectedMethod = contract.setString.bind(null, key, data.value);
    }
      break;
    case "bytes": {
      selectedMethod = contract.setBytes.bind(null, key, data.value);
    }
      break;
    case "address": {
      selectedMethod = contract.setAddress.bind(null, key, data.value);
    }
      break;
    case "uint": {
      selectedMethod = contract.setUint.bind(null, key, data.value);
    }
      break;
    case "int": {
      selectedMethod = contract.setInt.bind(null, key, data.value);
    }
      break;
    case "bool": {
      selectedMethod = contract.setBool.bind(null, key, data.value);
    }
      break;
    case "txdata": {
      selectedMethod = contract.setTxDataBlockNumber.bind(null, key, data.value);
    }
      break;
  }

  try {
    var trxHash = await performAsync(selectedMethod);
  } catch (err) {
    return err;
  }
  var result = await loader(trxHash);
  return result;
}