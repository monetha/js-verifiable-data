import { use } from 'chai';
import chaiMoment from 'chai-moment';
import { MockIPFSClient } from 'mocks/MockIPFSClient';
import { privateKeys, ethereumNetworkUrl } from 'common/ganache';
import Web3 from 'web3';
import { PassportGenerator, PassportOwnership, FactWriter } from 'lib/proto';
import { createTxExecutor } from 'common/tx';
use(chaiMoment);

let accounts;
let monethaOwner;
let passportOwner;
let passportOwnerPrivateKey;
let passportFactoryAddress;
let passportAddress;
let factProviderAddress;
let privateDataFactTxHash;
let privateDataFactSecretKey;
const mockIPFSClient = new MockIPFSClient();

const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

const txExecutor = createTxExecutor(web3);

before(async () => {
  accounts = await web3.eth.getAccounts();

  monethaOwner = accounts[0];
  passportOwner = accounts[1];
  passportOwnerPrivateKey = privateKeys[1];
  factProviderAddress = accounts[2];

  const passportLogic = await PassportLogic.new({ from: monethaOwner });
  const passportLogicRegistry = await PassportLogicRegistry.new('0.1', passportLogic.address, { from: monethaOwner });
  const passportFactory = await PassportFactory.new(passportLogicRegistry.address, { from: monethaOwner });
  passportFactoryAddress = passportFactory.address;

  // Create passport
  const generator = new PassportGenerator(web3, passportFactoryAddress);
  let txData = await generator.createPassport(passportOwner);
  let receipt = await txExecutor(txData);
  passportAddress = `0x${receipt.logs[0].topics[1].slice(26)}`;

  // Claim ownership
  const ownership = new PassportOwnership(web3, passportAddress);
  txData = await ownership.claimOwnership(passportOwner);
  await txExecutor(txData);

  // Write some private fact
  const writer = new FactWriter(web3, passportAddress);
  const writeResult = await writer.setPrivateData('privatedata_fact', [1, 2, 3, 4, 5, 6], factProviderAddress, mockIPFSClient);
  receipt = await txExecutor(writeResult.tx);
  privateDataFactTxHash = receipt.transactionHash;
  privateDataFactSecretKey = Buffer.from(writeResult.dataKey).toString('hex');
});

describe('Private data exchange', () => {
  it('Should propose retrieval', async () => {

  });
});
