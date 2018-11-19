import createPassport from './contracts/createPassport';
import readPassportFacts from './contracts/readPassportFacts';
import getPassportLists from './contracts/getPassportLists';
import writePassportFacts from './contracts/writePassportFacts';
import { addFactProviderToWhitelist, changePermission } from './contracts/changePermission';
import readPassportHistory  from './contracts/readPassportHistory';

export default {
  createPassport,
  readPassportFacts,
  getPassportLists,
  writePassportFacts,
  addFactProviderToWhitelist,
  changePermission,
  readPassportHistory,
};
