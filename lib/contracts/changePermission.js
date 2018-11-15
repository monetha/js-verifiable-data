import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

var addFactProviderToWhitelist = async function (abi, passportAddress, factProvider) {
  var contract = createInstance(abi, passportAddress);
  var trxHash = await performAsync(contract.addFactProviderToWhitelist.bind(null, factProvider));
  var result = await loader(trxHash);

  return true;
};

var changePermission = async function (abi, passportAddress, value) {
  var contract = createInstance(abi, passportAddress);
  var trxHash = await performAsync(contract.setWhitelistOnlyPermission.bind(null, value));
  var result = await loader(trxHash);

  return result;
}

exports = [addFactProviderToWhitelist, changePermission];