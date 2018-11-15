import {createPassport} from './contracts/createPassport';
import {readPassportFacts} from './contracts/readPassportFacts';
import { getPassportLists } from './contracts/getPassportLists';
import { writePassportFacts } from './contracts/writePassportFacts';
import { addFactProviderToWhitelist, changePermission } from './contracts/changePermission';

function IcoSdk(){ }

IcoSdk.createPassport = createPassport;
IcoSdk.readPassportFacts = readPassportFacts;
IcoSdk.getPassportLists = getPassportLists;
IcoSdk.writePassportFacts = writePassportFacts;
IcoSdk.addFactProviderToWhitelist = addFactProviderToWhitelist;
IcoSdk.changePermission = changePermission;

module.exports = IcoSdk;