import {createPassport} from './contracts/createPassport';
import {readPassportFacts} from './contracts/readPassportFacts';
import { getPassportLists } from './contracts/getPassportLists';
import { writePassportFacts } from './contracts/writePassportFacts';

function IcoSdk(){ }

IcoSdk.createPassport = createPassport;
IcoSdk.readPassportFacts = readPassportFacts;
IcoSdk.getPassportLists = getPassportLists;
IcoSdk.writePassportFacts = writePassportFacts;

module.exports = IcoSdk;