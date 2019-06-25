import { submitTransaction } from 'common/tx';
import { PassportGenerator } from 'lib/passport/PassportGenerator';
import { PassportOwnership } from 'lib/passport/PassportOwnership';
import { FactHistoryReader, FactReader, FactRemover, FactWriter, PassportReader, Permissions } from 'lib/proto';
import Web3 from 'web3';
import { ethereumNetworkUrl, privateKeys } from '../common/ganache';
import { MockIPFSClient } from '../mocks/MockIPFSClient';

let accounts;
let monethaOwner;
let passportOwner;
let passportOwnerPrivateKey;
let passportFactoryAddress;
let passportAddress;
let factProviderAddress;
let privateDataFactSecretKey;
const mockIPFSClient = new MockIPFSClient();

const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

const txHashes: any = {};

before(async () => {
  console.log('Deploy PassportFactory contract and prepare accounts');
  accounts = await web3.eth.getAccounts();

  monethaOwner = accounts[0];
  passportOwner = accounts[1];
  passportOwnerPrivateKey = privateKeys[1];
  factProviderAddress = accounts[2];

  const passportLogic = await PassportLogic.new({ from: monethaOwner });
  const passportLogicRegistry = await PassportLogicRegistry.new('0.1', passportLogic.address, { from: monethaOwner });

  const passportFactory = await PassportFactory.new(passportLogicRegistry.address, { from: monethaOwner });
  passportFactoryAddress = passportFactory.address;
});

describe('Passport creation and facts', () => {
  it('Should be able to create passport', async () => {
    // Given
    const generator = new PassportGenerator(web3, passportFactoryAddress);
    // When
    const tx_data = await generator.createPassport(passportOwner);
    const transaction = await submitTransaction(web3, tx_data);
    const receipt = await web3.eth.getTransactionReceipt(transaction.hash);
    // Then
    passportAddress = `0x${receipt.logs[0].topics[1].slice(26)}`;
    expect(transaction.from).to.equal(passportOwner);
    expect(transaction).to.have.property('to');
    expect(transaction).to.have.property('input');
    expect(transaction.input).to.equal('0x2ec0faad'); // '0x2ec0faad' is createPassport() method id
  });

  it('Should be able to claim ownership', async () => {
    // Given
    const generator = new PassportOwnership(web3, passportAddress);
    // When
    const response = await generator.claimOwnership(passportOwner);
    const transaction = await submitTransaction(web3, response);
    // Then
    expect(transaction.from).to.equal(passportOwner);
    expect(transaction).to.have.property('to');
    expect(transaction).to.have.property('input');
    expect(transaction.input).to.equal('0x4e71e0c8'); // '0x2ec0faad' is claimOwnership() method id
  });

  it('Should be able to get a list of all created passports', async () => {
    // Given
    const reader = new PassportReader(web3, ethereumNetworkUrl);

    // When
    const response = await reader.getPassportsList(passportFactoryAddress);
    // Then
    expect(response[0]).to.have.property('passportAddress');
    expect(response[0]).to.have.property('ownerAddress');
  });

  // #region -------------- Fact writing -------------------------------------------------------------------

  it('Should be able to write String fact', async () => {
    txHashes.string_fact = await writeAndValidateFact(writer => writer.setString('string_fact', 'hello', factProviderAddress));
  });

  it('Should be able to write Address fact', async () => {
    txHashes.address_fact =
      await writeAndValidateFact(writer => writer.setAddress('address_fact', '0xab46F39e60f495d46856C972fEde6220cFab0d70', factProviderAddress));
  });

  it('Should be able to write Int fact', async () => {
    txHashes.int_fact = await writeAndValidateFact(writer => writer.setInt('int_fact', -321, factProviderAddress));
  });

  it('Should be able to write Uint fact', async () => {
    txHashes.uint_fact = await writeAndValidateFact(writer => writer.setUint('uint_fact', 123, factProviderAddress));
  });

  it('Should be able to write Bool fact', async () => {
    txHashes.bool_fact = await writeAndValidateFact(writer => writer.setBool('bool_fact', true, factProviderAddress));
  });

  it('Should be able to write Bytes fact', async () => {
    txHashes.bytes_fact = await writeAndValidateFact(writer => writer.setBytes('bytes_fact', [1, 2, 3], factProviderAddress));
  });

  it('Should be able to write TxData fact', async () => {
    txHashes.txdata_fact = await writeAndValidateFact(writer => writer.setTxdata('txdata_fact', [1, 2, 3, 4, 5], factProviderAddress));
  });

  it('Should be able to write IPFSData fact', async () => {
    txHashes.ipfs_fact = await writeAndValidateFact(writer => writer.setIPFSData('ipfs_fact', 'Value in IPFS', factProviderAddress, mockIPFSClient));
  });

  it('Should be able to write PrivateDataHashes fact', async () => {
    txHashes.privatedatahashes_fact = await writeAndValidateFact(writer => writer.setPrivateDataHashes('privatedatahashes_fact', {
      dataIpfsHash: 'FAKE_IPFS_HASH',
      dataKeyHash: web3.utils.fromAscii('FAKE_KEY_HASH'),
    }, factProviderAddress));
  });

  it('Should be able to write PrivateData fact', async () => {
    const writer = new FactWriter(web3, passportAddress);
    const writeResult = await writer.setPrivateData('privatedata_fact', [1, 2, 3, 4, 5, 6], factProviderAddress, mockIPFSClient);

    txHashes.privatedata_fact = await writeAndValidateFact(_ => writeResult.tx);
    privateDataFactSecretKey = Buffer.from(writeResult.dataKey).toString('hex');
  });

  // #endregion

  // #region -------------- Fact reading -------------------------------------------------------------------

  it('Should be able to read String fact', async () => {
    await readAndValidateFact(reader => reader.getString(factProviderAddress, 'string_fact'), 'hello');
  });

  it('Should be able to read Address fact', async () => {
    await readAndValidateFact(reader => reader.getAddress(factProviderAddress, 'address_fact'), '0xab46F39e60f495d46856C972fEde6220cFab0d70');
  });

  it('Should be able to read Int fact', async () => {
    await readAndValidateFact(reader => reader.getInt(factProviderAddress, 'int_fact'), -321);
  });

  it('Should be able to read Uint fact', async () => {
    await readAndValidateFact(reader => reader.getUint(factProviderAddress, 'uint_fact'), 123);
  });

  it('Should be able to read Bool fact', async () => {
    await readAndValidateFact(reader => reader.getBool(factProviderAddress, 'bool_fact'), true);
  });

  it('Should be able to read Bytes fact', async () => {
    await readAndValidateFact(reader => reader.getBytes(factProviderAddress, 'bytes_fact'), [1, 2, 3]);
  });

  it('Should be able to read IPFSData fact', async () => {
    await readAndValidateFact(reader => reader.getIPFSData(factProviderAddress, 'ipfs_fact', mockIPFSClient), 'Value in IPFS');
  });

  it('Should be able to read TxData fact', async () => {
    await readAndValidateFact(reader => reader.getTxdata(factProviderAddress, 'txdata_fact'), [1, 2, 3, 4, 5]);
  });

  it('Should be able to read PrivateDataHashes fact', async () => {
    await readAndValidateFact(reader => reader.getPrivateDataHashes(factProviderAddress, 'privatedatahashes_fact'), {
      dataIpfsHash: 'FAKE_IPFS_HASH',
      dataKeyHash: web3.utils.fromAscii('FAKE_KEY_HASH'),
    });
  });

  it('Should be able to read PrivateData fact using owner private key', async () => {
    await readAndValidateFact(reader => reader.getPrivateData(
      factProviderAddress, 'privatedata_fact', passportOwnerPrivateKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  it('Should be able to read PrivateData fact using secret key', async () => {
    await readAndValidateFact(reader => reader.getPrivateDataUsingSecretKey(
      factProviderAddress, 'privatedata_fact', privateDataFactSecretKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  // #endregion

  // #region -------------- Fact reading from TX -------------------------------------------------------------------

  it('Should be able to read String fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getString(txHashes.string_fact), 'hello');
  });

  it('Should be able to read Address fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getAddress(txHashes.address_fact), '0xab46f39e60f495d46856c972fede6220cfab0d70');
  });

  it('Should be able to read Int fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getInt(txHashes.int_fact), -321);
  });

  it('Should be able to read Uint fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getUint(txHashes.uint_fact), 123);
  });

  it('Should be able to read Bool fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getBool(txHashes.bool_fact), true);
  });

  it('Should be able to read Bytes fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getBytes(txHashes.bytes_fact), [1, 2, 3]);
  });

  it('Should be able to read TxData fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getTxdata(txHashes.txdata_fact), [1, 2, 3, 4, 5]);
  });

  it('Should be able to read IPFSData fact from TX', async () => {
    await readAndValidateTxFact(reader => reader.getIPFSData(txHashes.ipfs_fact, mockIPFSClient), 'Value in IPFS');
  });

  it('Should be able to read PrivateDataHashes from TX', async () => {
    await readAndValidateTxFact(reader => reader.getPrivateDataHashes(txHashes.privatedatahashes_fact), {
      dataIpfsHash: 'FAKE_IPFS_HASH',
      dataKeyHash: web3.utils.fromAscii('FAKE_KEY_HASH'),
    });
  });

  it('Should be able to read PrivateFact from TX using owner private key', async () => {
    await readAndValidateTxFact(reader =>
      reader.getPrivateData(txHashes.privatedata_fact, passportOwnerPrivateKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  it('Should be able to read PrivateFact from TX using secret key', async () => {
    await readAndValidateTxFact(reader =>
      reader.getPrivateDataUsingSecretKey(txHashes.privatedata_fact, privateDataFactSecretKey, mockIPFSClient), [1, 2, 3, 4, 5, 6]);
  });

  // #endregion

  // #region -------------- Fact deletion -------------------------------------------------------------------

  it('Should be able to delete String fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteString('string_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getString(factProviderAddress, 'string_fact'), null);
  });

  it('Should be able to delete Address fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteAddress('address_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getAddress(factProviderAddress, 'address_fact'), null);
  });

  it('Should be able to delete Int fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteInt('int_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getInt(factProviderAddress, 'int_fact'), null);
  });

  it('Should be able to delete Uint fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteUint('uint_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getUint(factProviderAddress, 'uint_fact'), null);
  });

  it('Should be able to delete Bool fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteBool('bool_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getBool(factProviderAddress, 'bool_fact'), null);
  });

  it('Should be able to delete Bytes fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteBytes('bytes_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getBytes(factProviderAddress, 'bytes_fact'), null);
  });

  it('Should be able to delete TxData fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteTxdata('txdata_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getTxdata(factProviderAddress, 'txdata_fact'), null);
  });

  it('Should be able to delete IPFSData fact', async () => {
    await deleteAndValidateFact(remover => remover.deleteIPFSHash('ipfs_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getIPFSData(factProviderAddress, 'ipfs_fact', mockIPFSClient), null);
  });

  it('Should be able to delete PrivateDataHashes fact', async () => {
    await deleteAndValidateFact(remover => remover.deletePrivateDataHashes('privatedatahashes_fact', factProviderAddress));
    await readAndValidateFact(reader => reader.getPrivateDataHashes(factProviderAddress, 'privatedatahashes_fact'), null);
  });

  // #endregion

  // #region -------------- Reading fact history -------------------------------------------------------------------

  it('Should be able read facts history.', async () => {
    // Given
    const reader = new PassportReader(web3, ethereumNetworkUrl);
    // When
    const response = await reader.readPassportHistory(passportAddress);
    // Then
    expect(response[1].factProviderAddress).to.equal(factProviderAddress.toLowerCase());
    expect(response[1]).to.have.property('blockNumber');
    expect(response[1]).to.have.property('transactionHash');
    expect(JSON.stringify(response)).to.contains('string_fact');
  });

  // #endregion

  // #region -------------- Adding FactProvider to Whitelist -------------------------------------------------------------------

  it('Should be able to whitelist fact provider.', async () => {
    // Given
    const permissions = new Permissions(web3, passportAddress);
    // When
    const response = await permissions.addFactProviderToWhitelist(factProviderAddress, passportOwner);
    const transaction = await submitTransaction(web3, response);
    // Then
    expect(transaction.from).to.equal(passportOwner);
    expect(transaction).to.have.property('to');
    expect(transaction).to.have.property('input');
  });

  // #endregion
});

// #region -------------- Helpers -------------------------------------------------------------------

async function writeAndValidateFact(writeFact: (writer: FactWriter) => any) {
  // Given
  const writer = new FactWriter(web3, passportAddress);

  // When
  const response = await writeFact(writer);
  const transaction = await submitTransaction(web3, response);

  // Then
  expect(transaction.from).to.equal(factProviderAddress);
  expect(transaction).to.have.property('to');
  expect(transaction).to.have.property('input');
  return transaction.hash;
}

async function readAndValidateFact(readFact: (reader: FactReader) => any, expectedValue) {
  // Given
  const reader = new FactReader(web3, ethereumNetworkUrl, passportAddress);

  // When
  const response = await readFact(reader);

  // Then
  expect(response).to.deep.equal(expectedValue);
}

async function readAndValidateTxFact(readFact: (reader: FactHistoryReader) => any, expectedValue) {
  // Given
  const reader = new FactHistoryReader(web3);

  // When
  const response = await readFact(reader);

  // Then
  expect(response).to.have.property('factProviderAddress');
  expect(response).to.have.property('key');
  expect(response).to.have.property('value');
  expect(response.value).to.deep.equal(expectedValue);
}

async function deleteAndValidateFact(deleteFact: (remover: FactRemover) => any) {
  // Given
  const remover = new FactRemover(web3, passportAddress);

  // When
  const response = await deleteFact(remover);
  const transaction = await submitTransaction(web3, response);

  // Then
  expect(transaction.from).to.equal(factProviderAddress);
  expect(transaction).to.have.property('to');
  expect(transaction).to.have.property('input');
}

// #endregion
