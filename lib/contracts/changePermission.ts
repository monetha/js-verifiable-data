import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

export var addFactProviderToWhitelist = async function (abi: any, passportAddress: string, factProvider: string) {
  var contract = createInstance(abi, passportAddress);
  var trxHash: any;
  try {
    trxHash = await performAsync(contract.addFactProviderToWhitelist.bind(null, factProvider));
  } catch (err) {
    return err;
  }
  var result: any = await loader(trxHash);

  return result;
};

export var changePermission = async function (abi: any, passportAddress: string, value) {
  var contract = createInstance(abi, passportAddress);
  var trxHash: any;
  try {
    trxHash = await performAsync(contract.setWhitelistOnlyPermission.bind(null, value));
  } catch (err) {
    return err;
  }
  var result: any = await loader(trxHash);

  return result;
}
