import BN from 'bn.js';
import { expectSdkError } from 'common/error';
import { createTxExecutor } from 'common/tx';
import {
  Address,
  ErrorCode,
  ExchangeState,
  FactWriter,
  ISKM,
  PassportGenerator,
  PassportOwnership,
  PrivateDataExchanger,
} from 'verifiable-data';
import { MockIPFSClient } from 'mocks/MockIPFSClient';
import {
  getAccount,
  getNetworkNodeUrl,
  getPrivateKey,
  addAccountsFromPrivateKeys,
} from 'common/network';
import { logVerbose } from 'common/logger';
import { Contract, deployContract } from '../common/deployContracts';
import { Harmony } from '@harmony-js/core';
import { ChainType } from '@harmony-js/utils';

let passportOwner: Address;
let passportOwnerPrivateKey: string;
let passportFactoryAddress;
let requesterAddress: Address;
let requesterPrivateKey: Address;
let otherPersonAddress: Address;

let passportAddress: Address;
let factProviderAddress: Address;
let exchanger: PrivateDataExchanger;
const ipfsClient = new MockIPFSClient();

const privateFactKey = 'privatedata_fact';

const stakeWei = new BN('100000', 10);
const contractCreationParams: any = {};

const privateFactValue = [1, 2, 3, 4, 5, 6];

const harmony = new Harmony(getNetworkNodeUrl(), {
  chainType: ChainType.Harmony,
  chainId: 2,
  shardID: 0,
});

addAccountsFromPrivateKeys(harmony);

const txExecutor = createTxExecutor();

let exchangeData: any = {};

const preparePassport = async () => {

  // Accounts
  passportOwner = await getAccount(harmony, 0); // 1
  passportOwnerPrivateKey = getPrivateKey(0); // 1
  factProviderAddress = await getAccount(harmony, 0); // 2
  requesterAddress = await getAccount(harmony, 0); // 3
  requesterPrivateKey = getPrivateKey(0); // 3
  otherPersonAddress = await getAccount(harmony, 0); // 4

  const passportLogic = await deployContract(harmony, Contract.PassportLogic, contractCreationParams);
  const passportLogicRegistry = await deployContract(harmony, Contract.PassportLogicRegistry, contractCreationParams);
  const passportFactory = await deployContract(harmony, Contract.PassportFactory, contractCreationParams);
  passportFactoryAddress = passportFactory.address;

  // Create passport
  const generator = new PassportGenerator(harmony, passportFactoryAddress);
  let cfgMethod = await generator.createPassport(passportOwner);

  const receipt = await txExecutor(cfgMethod);
  passportAddress = PassportGenerator.getPassportAddressFromReceipt(receipt);

  // Claim ownership
  const ownership = new PassportOwnership(harmony, passportAddress);
  cfgMethod = await ownership.claimOwnership(passportOwner);
  await txExecutor(cfgMethod);

  // Write some private fact
  const writer = new FactWriter(harmony, passportAddress);
  const writeResult = await writer.setPrivateData(privateFactKey, privateFactValue, factProviderAddress, ipfsClient);
  await txExecutor(writeResult.tx);

  // Create exchanger
  exchanger = new PrivateDataExchanger(harmony, passportAddress, null);

  logVerbose('----------------------------------------------------------');
  logVerbose('PASSPORT LOGIC:'.padEnd(30), passportLogic.address);
  logVerbose('PASSPORT REGISTRY:'.padEnd(30), passportLogicRegistry.address);
  logVerbose('PASSPORT FACTORY:'.padEnd(30), passportFactory.address);
  logVerbose('PASSPORT:'.padEnd(30), passportAddress);
  logVerbose('PASSPORT OWNER:'.padEnd(30), passportOwner);
  logVerbose('PASSPORT OWNER PRIVATE KEY:'.padEnd(30), passportOwnerPrivateKey);
  logVerbose('REQUESTER:'.padEnd(30), requesterAddress);
  logVerbose('REQUESTER PRIVATE KEY:'.padEnd(30), requesterPrivateKey);
  logVerbose('----------------------------------------------------------');
};

describe('Private data exchange', () => {

  // #region -------------- Main flow -------------------------------------------------------------------

  describe('Main flow where requester finishes', () => {
    before(async () => {
      exchangeData = {};
      await preparePassport();
    });

    it('Should propose retrieval', async () => {
      let exchangeKeyFromCallback: ISKM;

      const onExchangeKey = (key: ISKM) => {
        exchangeKeyFromCallback = key;
      };

      const result = await exchanger.propose(
        privateFactKey,
        factProviderAddress,
        stakeWei,
        requesterAddress,
        txExecutor,
        null,
        onExchangeKey,
      );

      exchangeData = {
        ...exchangeData,
        ...result,
      };

      expect(result.exchangeIndex).to.be.not.null.and.not.undefined;
      expect(result.exchangeKey).to.have.length(32);
      expect(result.exchangeKeyHash).to.have.length(32);
      expect(exchangeKeyFromCallback).to.be.not.empty;
      expect(result.exchangeKey).to.eq(exchangeKeyFromCallback.skm);
      expect(result.exchangeKeyHash).to.eq(exchangeKeyFromCallback.skmHash);
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
          ipfsClient,
          txExecutor,
        ),
        ErrorCode.InvalidPassportOwnerKey);
    });

    it('Should accept proposal', async () => {
      await exchanger.accept(
        exchangeData.exchangeIndex,
        passportOwnerPrivateKey,
        ipfsClient,
        txExecutor,
      );
    });

    it('Status should be accepted', async () => {
      const status = await exchanger.getStatus(exchangeData.exchangeIndex);
      expect(status.state).to.eq(ExchangeState.Accepted);
      expect(status.passportOwnerStaked.toNumber()).to.eq(stakeWei.toNumber());
    });

    it('Should be able to decrypt fact with exchange key', async () => {
      const data = await exchanger.getPrivateData(exchangeData.exchangeIndex, exchangeData.exchangeKey, ipfsClient);
      expect(data).to.deep.eq(privateFactValue);
    });

    it('Should NOT be able to decrypt fact with invalid exchange key', async () => {
      await expectSdkError(
        () => exchanger.getPrivateData(exchangeData.exchangeIndex, [1, 2, 3, 4], ipfsClient),
        ErrorCode.InvalidExchangeKey);
    });

    it('Passport owner should NOT be able to finish proposal before expiration', async () => {
      await expectSdkError(
        () => exchanger.finish(exchangeData.exchangeIndex, passportOwner, txExecutor),
        ErrorCode.PassOwnerCanCloseOnlyAfterExpiration);
    });

    // TODO: 3 tests below are disabled because we have only 1 Harmony address with balance
    // but these tests require other address.
    // it('Random user should NOT be able to finish proposal', async () => {
    //   await expectSdkError(
    //     () => exchanger.finish(exchangeData.exchangeIndex, otherPersonAddress, txExecutor),
    //     ErrorCode.OnlyExchangeParticipantsCanClose);
    // });

    // it('Requester should finish proposal', async () => {
    //   await exchanger.finish(
    //     exchangeData.exchangeIndex,
    //     requesterAddress,
    //     txExecutor,
    //   );
    // });

    // it('Status should be closed', async () => {
    //   const status = await exchanger.getStatus(exchangeData.exchangeIndex);
    //   expect(status.state).to.eq(ExchangeState.Closed);
    // });
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
        ipfsClient,
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
