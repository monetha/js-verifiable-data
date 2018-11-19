import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

var createPassport = async function (abi: any, atAddress: string) {
  var contract = createInstance(abi, atAddress);
  var trxHash: any;
  try {
    trxHash = await performAsync(contract.createPassport.bind(null));
  } catch (err) {
    return err;
  }
  var result: any = await loader(trxHash);
  var passport: string = result.logs[0].topics[1];
  passport = '0x' + passport.slice(26);
  return passport;
};

export default createPassport;
