import PassportGenerator from './contracts/createPassport';
import FactReader from './contracts/readPassportFacts';
import getPassportLists from './contracts/getPassportLists';
import FactWriter from './contracts/writePassportFacts';
import FactRemover from './contracts/deletePassportFacts';
import TransactionReader from './contracts/readTransactionData';
import Permissions from './contracts/changePermission';
import readPassportHistory  from './contracts/readPassportHistory';
export { PassportReader } from './contracts/PassportReader';

export default {
  PassportGenerator,
  FactReader,
  getPassportLists,
  FactWriter,
  Permissions,
  readPassportHistory,
  FactRemover,
  TransactionReader
};
