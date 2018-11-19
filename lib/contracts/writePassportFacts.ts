import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

interface IData {
  key: string;
  value: any;
}

var globalWindow: any = window;
var writePassportFacts = async function (abi: any, passportAddress: string, dataType: string, data: IData) {
  
  var contract = createInstance(abi, passportAddress);
  var key: string = globalWindow.web3.fromAscii(data.key);
  var selectedMethod: any;
  var trxHash: any;

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
    trxHash = await performAsync(selectedMethod);
  } catch (err) {
    return err;
  }
  var result = await loader(trxHash);
  return result;
}

export default writePassportFacts;