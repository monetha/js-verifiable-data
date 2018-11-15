import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

export default createPassport = async function (abi, atAddress) {
  var contract = createInstance(abi, atAddress);
  try {
    var trxHash = await performAsync(contract.createPassport.bind(null));
  } catch (err) {
    return err;
  }
  var result = await loader(trxHash);
  passport = result.logs[0].topics[1];
  passport = '0x' + passport.slice(26);
  return passport;
};