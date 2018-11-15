import {createPassport} from './contracts/createPassport';
import {readPassportFacts} from './contracts/readPassportFacts';
import { getPassportLists } from './contracts/getPassportLists';

function IcoSdk(){ }

IcoSdk.createPassport = createPassport;
IcoSdk.readPassportFacts = readPassportFacts;
IcoSdk.getPassportLists = getPassportLists;

module.exports = IcoSdk;