import BN from 'bn.js';
import { expectSdkError } from 'common/error';
import { advanceTimeAndBlock, ethereumNetworkUrl, privateKeys, revertToSnapshot, takeSnapshot } from 'common/ganache';
import { createTxExecutor } from 'common/tx';
import { ErrorCode } from 'lib/errors/ErrorCode';
import { Address } from 'lib/models/Address';
import { FactWriter, PassportGenerator, PassportOwnership, PrivateDataExchanger } from 'lib/proto';
import { MockIPFSClient } from 'mocks/MockIPFSClient';
import Web3 from 'web3';
import { ExchangeState } from 'lib/passport/PrivateDataExchanger';

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
const privateFactValue = [1, 2, 3, 4, 5, 6];

const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

const txExecutor = createTxExecutor(web3);

let exchangeData: any = {};

const preparePassport = async () => {
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
  const writeResult = await writer.setPrivateData(privateFactKey, privateFactValue, factProviderAddress, mockIPFSClient);
  receipt = await txExecutor(writeResult.tx);
  privateDataFactTxHash = receipt.transactionHash;
  privateDataFactSecretKey = Buffer.from(writeResult.dataKey).toString('hex');

  // Create exchanger
  exchanger = new PrivateDataExchanger(web3, passportAddress);
};

describe('Private data exchange', () => {

  // #region -------------- Main flow -------------------------------------------------------------------

  describe('Main flow', () => {
    before(async () => {
      exchangeData = {};
      await preparePassport();
    });

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

    it('Status should be proposed', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Proposed);
      expect(status.requesterAddress.toLowerCase()).to.eq(requesterAddress.toLowerCase());
      expect(status.requesterStaked.toNumber()).to.eq(stakeWei.toNumber());
    });

    it('Should NOT accept proposal with invalid private key', async () => {
      await expectSdkError(
        () => exchanger.accept(
          exchangeData.exchangeIndex,
          `${passportOwnerPrivateKey}111111`,
          mockIPFSClient,
          txExecutor,
        ),
        ErrorCode.InvalidPassportOwnerKey);
    });

    it('Should accept proposal', async () => {
      await exchanger.accept(
        exchangeData.exchangeIndex,
        passportOwnerPrivateKey,
        mockIPFSClient,
        txExecutor,
      );
    });

    it('Status should be accepted', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Accepted);
      expect(status.passportOwnerStaked.toNumber()).to.eq(stakeWei.toNumber());
    });

    it('Should be able to decrypt fact with exchange key', async () => {
      const data = await exchanger.getPrivateData(exchangeData.exchangeIndex, exchangeData.exchangeKey, mockIPFSClient);
      expect(data).to.deep.eq(privateFactValue);
    });

    it('Requester should finish proposal', async () => {
      await exchanger.finish(
        exchangeData.exchangeIndex,
        requesterAddress,
        txExecutor,
      );
    });

    it('Status should be closed', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Closed);
    });
  });

  // #endregion

  // #region -------------- Timeout -------------------------------------------------------------------

  describe('Acceptance timeout', () => {
    let snapshotId: string;

    before(async () => {
      exchangeData = {};

      await preparePassport();
      snapshotId = await takeSnapshot(web3);

      // Propose
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
    });

    after(async () => {
      await revertToSnapshot(web3, snapshotId);
    });

    it('Requester should not be able to call timeout before proposal expiration', async () => {
      await expectSdkError(
        () => exchanger.timeout(exchangeData.exchangeIndex, txExecutor),
        ErrorCode.CanOnlyCloseAfterExpiration);
    });

    it('Passport owner should not be able to accept 24+ after proposal', async () => {

      // Pass 30 hours in blockchain
      await advanceTimeAndBlock(web3, 60 * 60 * 30);

      exchanger = new PrivateDataExchanger(web3, passportAddress, () => {
        const now = new Date();

        // Now + 30h
        now.setTime(now.getTime() + 60 * 60 * 30 * 1000);
        return now;
      });

      await expectSdkError(
        () => exchanger.accept(exchangeData.exchangeIndex, passportOwnerPrivateKey, mockIPFSClient, txExecutor),
        ErrorCode.ExchangeExpiredOrExpireSoon);
    });

    it('Requester should be able to call timeout 24h+ after proposal', async () => {
      await exchanger.timeout(exchangeData.exchangeIndex, txExecutor);
    });

    it('Status should be closed', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Closed);
    });
  });

  // #endregion

  // #region -------------- Dispute -------------------------------------------------------------------

  describe('Dispute when requester is cheater', () => {
    before(async () => {
      exchangeData = {};

      await preparePassport();

      // Propose
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

      // Accept
      await exchanger.accept(
        exchangeData.exchangeIndex,
        passportOwnerPrivateKey,
        mockIPFSClient,
        txExecutor,
      );
    });

    it('Requester should open dispute and be marked as cheater', async () => {
      const result = await exchanger.dispute(
        exchangeData.exchangeIndex,
        exchangeData.exchangeKey,
        txExecutor,
      );

      expect(result.success, 'Dispute result should be unsuccessful').to.be.false;
      expect(result.cheaterAddress.toLowerCase()).to.eq(requesterAddress.toLowerCase());
    });

    it('Status should be closed', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Closed);
    });
  });

  // #endregion

});
