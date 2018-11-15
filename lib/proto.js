import {createPassport} from './contracts/createPassport';
import {readPassportFacts} from './contracts/readPassportFacts';

function IcoSdk(){ }

IcoSdk.createPassport = createPassport;
IcoSdk.readPassportFacts = readPassportFacts;

module.exports = IcoSdk;