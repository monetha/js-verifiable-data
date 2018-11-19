import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

var globalWindow: any = window;
var deletePassportFacts = async function (abi: any, passportAddress: string, dataType: string, key: string) {
  
  var contract = createInstance(abi, passportAddress);
  key = globalWindow.web3.fromAscii(key);
  var selectedMethod: any;
  var trxHash: any;

  switch (dataType) {
    case "string": {
      selectedMethod = contract.deleteString.bind(null, key);
    }
      break;
    case "bytes": {
      selectedMethod = contract.deleteBytes.bind(null, key);
    }
      break;
    case "address": {
      selectedMethod = contract.deleteAddress.bind(null, key);
    }
      break;
    case "uint": {
      selectedMethod = contract.deleteUint.bind(null, key);
    }
      break;
    case "int": {
      selectedMethod = contract.deleteInt.bind(null, key);
    }
      break;
    case "bool": {
      selectedMethod = contract.deleteBool.bind(null, key);
    }
      break;
    case "txdata": {
      selectedMethod = contract.deleteTxDataBlockNumber.bind(null, key);
    }
      break;
  }

  try {
    trxHash = await performAsync(selectedMethod);
  } catch (err) {
    return err;
  }
  var result = await loader(trxHash);
  return result;
}

export default deletePassportFacts;