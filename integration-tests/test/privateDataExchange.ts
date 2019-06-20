import BN from 'bn.js';
import { use } from 'chai';
import chaiMoment from 'chai-moment';
import { ethereumNetworkUrl, privateKeys } from 'common/ganache';
import { createTxExecutor } from 'common/tx';
import { Address } from 'lib/models/Address';
import { FactWriter, PassportGenerator, PassportOwnership, PrivateDataExchanger } from 'lib/proto';
import { MockIPFSClient } from 'mocks/MockIPFSClient';
import Web3 from 'web3';
use(chaiMoment);

let accounts;

let monethaOwner: Address;
let passportOwner: Address;
let passportOwnerPrivateKey: string;
let passportFactoryAddress;
let requesterAddress: Address;
let otherPersonAddress: Address;

let passportAddress: Address;
let factProviderAddress: Address;
let privateDataFactTxHash: string;
let privateDataFactSecretKey: string;
let exchanger: PrivateDataExchanger;
const mockIPFSClient = new MockIPFSClient();

const privateFactKey = 'privatedata_fact';
const stakeWei = new BN('100000', 10);

const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

const txExecutor = createTxExecutor(web3);

let exchangeData = {
  exchangeKey: null,
  exchangeIndex: null,
  exchangeKeyHash: null,
};

before(async () => {
  accounts = await web3.eth.getAccounts();

  // Accounts
  monethaOwner = accounts[0];
  passportOwner = accounts[1];
  passportOwnerPrivateKey = privateKeys[1];
  factProviderAddress = accounts[2];
  requesterAddress = accounts[3];
  otherPersonAddress = accounts[4];

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
  const writeResult = await writer.setPrivateData(privateFactKey, [1, 2, 3, 4, 5, 6], factProviderAddress, mockIPFSClient);
  receipt = await txExecutor(writeResult.tx);
  privateDataFactTxHash = receipt.transactionHash;
  privateDataFactSecretKey = Buffer.from(writeResult.dataKey).toString('hex');

  // Create exchanger
  exchanger = new PrivateDataExchanger(web3, passportAddress);
});

describe('Private data exchange', () => {
  it('Should propose retrieval', async () => {
    const result = await exchanger.propose(
      privateFactKey,
      factProviderAddress,
      stakeWei,
      requesterAddress,
      txExecutor,
    );

    exchangeData = {
      ...exchangeData,
      ...result,
    };

    expect(result.exchangeIndex).to.be.not.null.and.not.undefined;
    expect(result.exchangeKey).to.have.length(32);
    expect(result.exchangeKeyHash).to.have.length(32);
  });
});
