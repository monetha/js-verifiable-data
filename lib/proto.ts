import createPassport from './contracts/createPassport';
import readPassportFacts from './contracts/readPassportFacts';
import getPassportLists from './contracts/getPassportLists';
import writePassportFacts from './contracts/writePassportFacts';
import deletePassportFacts from './contracts/deletePassportFacts';
import { addFactProviderToWhitelist, changePermission, removeFactProviderFromWhitelist } from './contracts/changePermission';
import readPassportHistory  from './contracts/readPassportHistory';

export default {
  createPassport,
  readPassportFacts,
  getPassportLists,
  writePassportFacts,
  addFactProviderToWhitelist,
  changePermission,
  readPassportHistory,
  removeFactProviderFromWhitelist,
  deletePassportFacts
};
