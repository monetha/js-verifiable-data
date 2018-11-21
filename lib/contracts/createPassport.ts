import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

const createPassport = async function (abi: any, atAddress: string): Promise<string> {
  const contract = createInstance(abi, atAddress);
  let trxHash: any;
  try {
    trxHash = await performAsync(contract.createPassport.bind(null));
  } catch (err) {
    return err;
  }
  const result: any = await loader(trxHash);
  let passport: string = result.logs[0].topics[1];
  passport = '0x' + passport.slice(26);
  return passport;
};

export default createPassport;
