import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

export const addFactProviderToWhitelist = async function (abi: any, passportAddress: string, factProvider: string) {
  const contract = createInstance(abi, passportAddress);
  let trxHash: any;
  try {
    trxHash = await performAsync(contract.addFactProviderToWhitelist.bind(null, factProvider));
  } catch (err) {
    return err;
  }
  const result: any = await loader(trxHash);

  return result;
};


export const isFactProviderInWhitelist = async function (abi: any, passportAddress: string, factProvider: string) {
  const contract = createInstance(abi, passportAddress);
  let result: any;
  try {
    result = await performAsync(contract.isFactProviderInWhitelist.bind(null, factProvider));
  } catch (err) {
    return err;
  }
  return result;
};

export const isWhitelistOnlyPermissionSet = async function (abi: any, passportAddress: string) {
  const contract = createInstance(abi, passportAddress);
  let result: any;
  try {
    result = await performAsync(contract.isWhitelistOnlyPermissionSet.bind(null));
  } catch (err) {
    return err;
  }
  return result;
};

export const isAllowedFactProvider = async function (abi: any, passportAddress: string, factProvider: string) {
  const contract = createInstance(abi, passportAddress);
  let result: any;
  try {
    result = await performAsync(contract.isAllowedFactProvider.bind(null, factProvider));
  } catch (err) {
    return err;
  }
  return result;
};

export const removeFactProviderFromWhitelist = async function (abi: any, passportAddress: string, factProvider: string) {
  const contract = createInstance(abi, passportAddress);
  let trxHash: any;
  try {
    trxHash = await performAsync(contract.removeFactProviderFromWhitelist.bind(null, factProvider));
  } catch (err) {
    return err;
  }
  const result: any = await loader(trxHash);

  return result;
};

export const changePermission = async function (abi: any, passportAddress: string, value) {
  const contract = createInstance(abi, passportAddress);
  let trxHash: any;
  try {
    trxHash = await performAsync(contract.setWhitelistOnlyPermission.bind(null, value));
  } catch (err) {
    return err;
  }
  const result: any = await loader(trxHash);

  return result;
}
