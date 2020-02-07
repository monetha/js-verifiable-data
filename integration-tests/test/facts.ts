import { logVerbose } from 'common/logger';
import {
  getAccount,
  getNetworkNodeUrl,
  getPrivateKey,
  addAccountsFromPrivateKeys,
} from 'common/network';
import { createTxExecutor } from 'common/tx';
import {
  PassportGenerator, PassportOwnership, PassportReader, FactWriter, FactReader, FactHistoryReader,
} from 'verifiable-data';
import { MockIPFSClient } from '../mocks/MockIPFSClient';
import { deployContract, Contract } from 'common/deployContracts';
import { Harmony } from '@harmony-js/core';
import { ChainType, ChainID } from '@harmony-js/utils';
import * as cr from '@harmony-js/crypto';

let passportLogic;
let passportLogicRegistry;
let passportFactory;
let passportLogicAddress;
let passportLogicRegistryAddress;
let passportFactoryAddress;
let passportOwner;
let passportOwnerPrivateKey;
let passportAddress = '0x49de616ea9b4127c8ec729d0d99c42e4b3865fb2';
let factProviderAddress;
let factProviderPrivateKey;
let privateDataFactSecretKey;
const mockIPFSClient = new MockIPFSClient();

const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const PassportFactory = artifacts.require('PassportFactory');

const harmony = new Harmony(getNetworkNodeUrl(), {
  chainType: ChainType.Harmony,
  chainId: 2,
  shardID: 0,
});

addAccountsFromPrivateKeys(harmony);

const contractCreationParams: any = {};

const txHashes: any = {};
const txExecutor = createTxExecutor(harmony);

// padded hex of "FAKE_KEY_HASH"
const dataKeyHash = '0x46414b455f4b45595f4841534800000000000000000000000000000000000000';

before(async () => {
  passportOwner = await getAccount(harmony, 0); // 1
  passportOwnerPrivateKey = getPrivateKey(0); // 1
  factProviderAddress = await getAccount(harmony, 0); // 2
  factProviderPrivateKey = getPrivateKey(0); // 2

  // deploy contracts
  // passportLogic = await deployContract(harmony, Contract.PassportLogic, contractCreationParams);
  passportLogicAddress = '0x53E021076B1818568f754905ec13a2d74bF4b864'; // passportLogic.address;
  // passportLogicRegistry = await deployContract(harmony, Contract.PassportLogicRegistry, contractCreationParams);
  passportLogicRegistryAddress = '0xCB7d7674977eD106cF18a0AbF0924E31Bf448e9e'; // passportLogicRegistry.address;
  // passportFactory = await deployContract(harmony, Contract.PassportFactory, contractCreationParams);
  passportFactoryAddress = '0x84cb13DAFD3cab824473E1a5a8a456c843437B94'; // passportFactory.address;

  logVerbose('----------------------------------------------------------');
  logVerbose('PASSPORT LOGIC:'.padEnd(30), passportLogicAddress);
  logVerbose('PASSPORT REGISTRY:'.padEnd(30), passportLogicRegistryAddress);
  logVerbose('PASSPORT FACTORY:'.padEnd(30), passportFactoryAddress);
  logVerbose('PASSPORT OWNER:'.padEnd(30), passportOwner);
  logVerbose('PASSPORT OWNER PRIVATE KEY:'.padEnd(30), passportOwnerPrivateKey);
  logVerbose('FACT PROVIDER:'.padEnd(30), factProviderAddress);
  logVerbose('FACT PROVIDER PRIVATE KEY:'.padEnd(30), factProviderPrivateKey);
  logVerbose('----------------------------------------------------------');
});

describe('Passport creation and facts', () => {
  // it('Should be able to create passport', async () => {
  //   const generator = new PassportGenerator(harmony, passportFactoryAddress);

  //   const cfgMethod = await generator.createPassport(passportOwner);
  //   const receipt = await txExecutor(cfgMethod);

  //   passportAddress = PassportGenerator.getPassportAddressFromReceipt(receipt);
  //   expect(passportAddress).to.not.be.empty;
  //   expect(cr.getAddress(receipt.from).basicHex).to.equal(cr.getAddress(passportOwner).basicHex);
  //   expect(receipt).to.have.property('to');

  //   logVerbose('----------------------------------------------------------');
  //   logVerbose('PASSPORT:'.padEnd(30), passportAddress);
  //   logVerbose('----------------------------------------------------------');
  // });

  // it('Should be able to claim ownership', async () => {
  //   const ownership = new PassportOwnership(harmony, passportAddress);

  //   const method = await ownership.claimOwnership(passportOwner);
  //   const receipt = await txExecutor(method);

  //   expect(cr.getAddress(receipt.from).basicHex).to.equal(cr.getAddress(passportOwner).basicHex);
  //   expect(receipt).to.have.property('to');
  // });

  // it('Should be able to get a list of all created passports', async () => {
  //   const reader = new PassportReader(harmony);

  //   const passports = await reader.getPassportsList(passportFactoryAddress);

  //   expect(passports[0]).to.have.property('passportAddress');
  //   expect(passports[0]).to.have.property('ownerAddress');
  // });

  // // #region -------------- Fact writing -------------------------------------------------------------------

  // it('Should be able to write String fact', async () => {
  //   txHashes.string_fact = await writeAndValidateFact(writer => writer.setString('string_fact', 'hello', factProviderAddress));
  //   txHashes.second_fact = await writeAndValidateFact(writer => writer.setString('second_fact', 'world', factProviderAddress));
  //   txHashes.second_fact_update = await writeAndValidateFact(writer => writer.setString('second_fact', 'bar', factProviderAddress));
  // });

  // it('Should be able to write Address fact', async () => {
  //   txHashes.address_fact =
  //     await writeAndValidateFact(writer => writer.setAddress('address_fact', '0xab46F39e60f495d46856C972fEde6220cFab0d70', factProviderAddress));
  // });

  // it('Should be able to write Int fact', async () => {
  //   txHashes.int_fact = await writeAndValidateFact(writer => writer.setInt('int_fact', -321, factProviderAddress));
  // });

  // it('Should be able to write Uint fact', async () => {
  //   txHashes.uint_fact = await writeAndValidateFact(writer => writer.setUint('uint_fact', 123, factProviderAddress));
  // });

  // it('Should be able to write Bool fact', async () => {
  //   txHashes.bool_fact = await writeAndValidateFact(writer => writer.setBool('bool_fact', true, factProviderAddress));
  // });

  // it('Should be able to write Bytes fact', async () => {
  //   txHashes.bytes_fact = await writeAndValidateFact(writer => writer.setBytes('bytes_fact', [1, 2, 3], factProviderAddress));
  // });

  // it('Should be able to write TxData fact', async () => {
  //   txHashes.txdata_fact = await writeAndValidateFact(writer => writer.setTxdata('txdata_fact', [1, 2, 3, 4, 5], factProviderAddress));
  // });

  // it('Should be able to write IPFSData fact', async () => {
  //   txHashes.ipfs_fact = await writeAndValidateFact(writer => writer.setIPFSData('ipfs_fact', 'Value in IPFS', factProviderAddress, mockIPFSClient));
  // });

  // it('Should be able to write PrivateDataHashes fact', async () => {
  //   txHashes.privatedatahashes_fact = await writeAndValidateFact(writer => writer.setPrivateDataHashes('privatedatahashes_fact', {
  //     dataIpfsHash: 'FAKE_IPFS_HASH',
  //     dataKeyHash,
  //   }, factProviderAddress));
  // });

  it('Should be able to write PrivateData fact', async () => {
    const writer = new FactWriter(harmony, passportAddress);
    const writeResult = await writer.setPrivateData('privatedata_fact', [1, 2, 3, 4, 5, 6], factProviderAddress, mockIPFSClient);

    txHashes.privatedata_fact = await writeAndValidateFact(_ => writeResult.tx);
    privateDataFactSecretKey = Buffer.from(writeResult.dataKey).toString('hex');

    logVerbose('----------------------------------------------------------');
    logVerbose('PRIVATE FACT SECRET KEY:'.padEnd(30), privateDataFactSecretKey.toString('hex'));
    logVerbose('----------------------------------------------------------');
  });

  // // #endregion

  // // #region -------------- Fact reading -------------------------------------------------------------------

  // it('Should be able to read String fact', async () => {
  //   await readAndValidateFact(reader => reader.getString(factProviderAddress, 'string_fact'), 'hello');
  // });

  // it('Should be able to read Address fact', async () => {
  //   await readAndValidateFact(reader => reader.getAddress(factProviderAddress, 'address_fact'), '0xab46F39e60f495d46856C972fEde6220cFab0d70');
  // });

  // it('Should be able to read Int fact', async () => {
  //   await readAndValidateFact(reader => reader.getInt(factProviderAddress, 'int_fact'), -321);
  // });

  // it('Should be able to read Uint fact', async () => {
  //   await readAndValidateFact(reader => reader.getUint(factProviderAddress, 'uint_fact'), 123);
  // });

  // it('Should be able to read Bool fact', async () => {
  //   await readAndValidateFact(reader => reader.getBool(factProviderAddress, 'bool_fact'), true);
  // });

  // it('Should be able to read Bytes fact', async () => {
  //   await readAndValidateFact(reader => reader.getBytes(factProviderAddress, 'bytes_fact'), [1, 2, 3]);
  // });

  // it('Should be able to read IPFSData fact', async () => {
  //   await readAndValidateFact(reader => reader.getIPFSData(factProviderAddress, 'ipfs_fact', mockIPFSClient), 'Value in IPFS');
  // });

  // it('Should be able to read TxData fact', async () => {
  //   await readAndValidateFact(reader => reader.getTxdata(factProviderAddress, 'txdata_fact'), [1, 2, 3, 4, 5]);
  // });

  // it('Should be able to read PrivateDataHashes fact', async () => {
  //   await readAndValidateFact(reader => reader.getPrivateDataHashes(factProviderAddress, 'privatedatahashes_fact'), {
  //     dataIpfsHash: 'FAKE_IPFS_HASH',
  //     dataKeyHash,
  //   });
  // });

  // it('Should be able to read PrivateData fact using owner private key', async () => {
  //   await readAndValidateFact(reader => reader.getPrivateData(
  //     factProviderAddress, 'privatedata_fact', passportOwnerPrivateKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  // });

  // it('Should be able to read PrivateData fact using secret key', async () => {
  //   await readAndValidateFact(reader => reader.getPrivateDataUsingSecretKey(
  //     factProviderAddress, 'privatedata_fact', privateDataFactSecretKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  // });

  // // #endregion

  // // #region -------------- Fact reading from TX -------------------------------------------------------------------

  // it('Should be able to read String fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getString(txHashes.string_fact), 'hello');
  // });

  // it('Should be able to read Address fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getAddress(txHashes.address_fact), '0xab46f39e60f495d46856c972fede6220cfab0d70');
  // });

  // it('Should be able to read Int fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getInt(txHashes.int_fact), -321);
  // });

  // it('Should be able to read Uint fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getUint(txHashes.uint_fact), 123);
  // });

  // it('Should be able to read Bool fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getBool(txHashes.bool_fact), true);
  // });

  // it('Should be able to read Bytes fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getBytes(txHashes.bytes_fact), [1, 2, 3]);
  // });

  // it('Should be able to read TxData fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getTxdata(txHashes.txdata_fact), [1, 2, 3, 4, 5]);
  // });

  // it('Should be able to read IPFSData fact from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getIPFSData(txHashes.ipfs_fact, mockIPFSClient), 'Value in IPFS');
  // });

  // it('Should be able to read PrivateDataHashes from TX', async () => {
  //   await readAndValidateTxFact(reader => reader.getPrivateDataHashes(txHashes.privatedatahashes_fact), {
  //     dataIpfsHash: 'FAKE_IPFS_HASH',
  //     dataKeyHash,
  //   });
  // });

  it('Should be able to read PrivateFact from TX using owner private key', async () => {
    await readAndValidateTxFact(reader =>
      reader.getPrivateData(txHashes.privatedata_fact, passportOwnerPrivateKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  it('Should be able to read PrivateFact from TX using secret key', async () => {
    await readAndValidateTxFact(reader =>
      reader.getPrivateDataUsingSecretKey(txHashes.privatedata_fact, privateDataFactSecretKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  // // #endregion

  // // #region -------------- Fact deletion -------------------------------------------------------------------

  // it('Should be able to delete String fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteString('string_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getString(factProviderAddress, 'string_fact'), null);
  // });

  // it('Should be able to delete Address fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteAddress('address_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getAddress(factProviderAddress, 'address_fact'), null);
  // });

  // it('Should be able to delete Int fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteInt('int_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getInt(factProviderAddress, 'int_fact'), null);
  // });

  // it('Should be able to delete Uint fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteUint('uint_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getUint(factProviderAddress, 'uint_fact'), null);
  // });

  // it('Should be able to delete Bool fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteBool('bool_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getBool(factProviderAddress, 'bool_fact'), null);
  // });

  // it('Should be able to delete Bytes fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteBytes('bytes_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getBytes(factProviderAddress, 'bytes_fact'), null);
  // });

  // it('Should be able to delete TxData fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteTxdata('txdata_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getTxdata(factProviderAddress, 'txdata_fact'), null);
  // });

  // it('Should be able to delete IPFSData fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deleteIPFSHash('ipfs_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getIPFSData(factProviderAddress, 'ipfs_fact', mockIPFSClient), null);
  // });

  // it('Should be able to delete PrivateDataHashes fact', async () => {
  //   await deleteAndValidateFact(remover => remover.deletePrivateDataHashes('privatedatahashes_fact', factProviderAddress));
  //   await readAndValidateFact(reader => reader.getPrivateDataHashes(factProviderAddress, 'privatedatahashes_fact'), null);
  // });

  // // #endregion

  // // #region -------------- Reading fact history -------------------------------------------------------------------

  // it('Should be able read facts history.', async () => {
  //   // Given
  //   const reader = new PassportReader(web3);

  //   // When
  //   let response = await reader.readPassportHistory(passportAddress);

  //   const dataSource = factProviderAddress.toLowerCase();

  //   // Then
  //   expect(response[1].factProviderAddress.toLowerCase()).to.equal(dataSource);
  //   expect(response[1]).to.have.property('blockNumber');
  //   expect(response[1]).to.have.property('transactionHash');
  //   expect(JSON.stringify(response)).to.contains('string_fact');

  //   // When filtering by fact key and data source address
  //   response = await reader.readPassportHistory(passportAddress, {
  //     key: 'second_fact',
  //     factProviderAddress: dataSource,
  //   });

  //   // Then
  //   expect(response.length).to.equal(2);

  //   expect(response[0].factProviderAddress.toLowerCase()).to.equal(dataSource);
  //   expect(response[1].factProviderAddress.toLowerCase()).to.equal(dataSource);

  //   expect(response[0].transactionHash).to.equal(txHashes.second_fact);
  //   expect(response[1].transactionHash).to.equal(txHashes.second_fact_update);

  //   expect(response[0].key).to.equal('second_fact');
  //   expect(response[1].key).to.equal('second_fact');
  // });

  // // #endregion

  // // #region -------------- Adding FactProvider to Whitelist -------------------------------------------------------------------

  // it('Should be able to whitelist fact provider.', async () => {
  //   // Given
  //   const permissions = new Permissions(web3, passportAddress);

  //   // When
  //   const txData = await permissions.addFactProviderToWhitelist(factProviderAddress, passportOwner);
  //   const receipt = await txExecutor(txData);

  //   // Then
  //   expect(receipt.from.toLowerCase()).to.equal(passportOwner.toLowerCase());
  //   expect(receipt).to.have.property('to');
  // });

  // // #endregion
});

// // #region -------------- Helpers -------------------------------------------------------------------

async function writeAndValidateFact(writeFact: (writer: FactWriter) => any) {
  const writer = new FactWriter(harmony, passportAddress);

  const method = await writeFact(writer);
  const receipt = await txExecutor(method);

  expect(cr.getAddress(receipt.from).basicHex).to.equal(cr.getAddress(factProviderAddress).basicHex);
  expect(receipt).to.have.property('to');
  return receipt.transactionHash;
}

async function readAndValidateFact(readFact: (reader: FactReader) => any, expectedValue) {
  const reader = new FactReader(harmony, passportAddress);

  const response = await readFact(reader);

  expect(response).to.deep.equal(expectedValue);
}

async function readAndValidateTxFact(readFact: (reader: FactHistoryReader) => any, expectedValue) {
  const reader = new FactHistoryReader(harmony);

  const response = await readFact(reader);

  expect(response).to.have.property('factProviderAddress');
  expect(response).to.have.property('key');
  expect(response).to.have.property('value');
  expect(response.value).to.deep.equal(expectedValue);
}

// async function deleteAndValidateFact(deleteFact: (remover: FactRemover) => any) {
//   // Given
//   const remover = new FactRemover(web3, passportAddress);

//   // When
//   const txData = await deleteFact(remover);
//   const transaction = await txExecutor(txData);

//   // Then
//   expect(transaction.from.toLowerCase()).to.equal(factProviderAddress.toLowerCase());
//   expect(transaction).to.have.property('to');
// }

// // #endregion
