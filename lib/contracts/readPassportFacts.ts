import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';

const globalWindow: any = window;
const readPassportFacts = async function (abi: any, passportAddress: string, factProviderAddress: string, dataType: string, key: string) {
  const contract = createInstance(abi, passportAddress);
  key = globalWindow.web3.fromAscii(key);
  let selectedMethod: any;
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
  const result: any = await performAsync(selectedMethod);
  return result;
}

export default readPassportFacts;