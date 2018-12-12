import PassportGenerator from './contracts/createPassport';
import FactReader from './contracts/readPassportFacts';
import FactWriter from './contracts/writePassportFacts';
import FactRemover from './contracts/deletePassportFacts';
import Permissions from './contracts/changePermission';
import PassportReader from './contracts/PassportReader';

export default {
  PassportGenerator,
  FactReader,
  FactWriter,
  Permissions,
  FactRemover,
  PassportReader,
};
