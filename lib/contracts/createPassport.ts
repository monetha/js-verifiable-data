import createInstance from '../providers/createInstance';
import performAsync from '../providers/performAsync';
import loader from '../providers/loader';

export class CreatePassport {
  contract: any;

  constructor(abi: any, atAddress?: string) {
    this.contract = createInstance(abi, atAddress);
  }

  async generateEmptyPassport(): Promise<string> {
    let trxHash: any;
    try {
      trxHash = await performAsync(this.contract.createPassport.bind(null));
    } catch (err) {
      return err;
    }

    const result: any = await loader(trxHash);
    let passport: string = result.logs[0].topics[1];
    passport = '0x' + passport.slice(26);
    return passport;    
  }
}

export default CreatePassport;
