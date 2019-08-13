import BN from 'bn.js';
import { expectSdkError } from 'common/error';
import { advanceTimeAndBlock, revertToSnapshot, takeSnapshot } from 'common/networks/ganache';
import { createTxExecutor, isPrivateTxMode } from 'common/tx';
import { FactWriter, PassportGenerator, PassportOwnership, PrivateDataExchanger, Address, IEthOptions, ext, ExchangeState, ErrorCode } from 'verifiable-data';
import { MockIPFSClient } from 'mocks/MockIPFSClient';
import Web3 from 'web3';
import { getNetworkNodeUrl, getPrivateKey, getAccount, getNetwork, NetworkType, getNodePublicKey } from 'common/network';
import { logVerbose } from 'common/logger';

let monethaOwner: Address;
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
let options: IEthOptions = null;

const privateFactKey = 'privatedata_fact';

let stakeWei = new BN('100000', 10);
const contractCreationParams: any = {};

if (getNetwork() === NetworkType.Quorum) {
  // On quorum we use accounts which does not have money, so stake 0. However, on ganache - each account has eth
  stakeWei = new BN('0', 10);
}

if (isPrivateTxMode) {
  switch (getNetwork()) {
    case NetworkType.Quorum:
      contractCreationParams.privateFor = [getNodePublicKey(1)];
      options = {
        txRetriever: ext.quorum.getPrivateTx,
      };
      break;
    default:
      break;
  }
}

const privateFactValue = [1, 2, 3, 4, 5, 6];

const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(getNetworkNodeUrl()));

const txExecutor = createTxExecutor(web3);

let exchangeData: any = {};

const preparePassport = async () => {

  // Accounts
  monethaOwner = await getAccount(web3, 0);
  passportOwner = await getAccount(web3, 1);
  passportOwnerPrivateKey = getPrivateKey(1);
  factProviderAddress = await getAccount(web3, 2);
  requesterAddress = await getAccount(web3, 3);
  requesterPrivateKey = getPrivateKey(3);
  otherPersonAddress = await getAccount(web3, 4);

  const passportLogic = await PassportLogic.new({ from: monethaOwner, ...contractCreationParams });
  const passportLogicRegistry = await PassportLogicRegistry.new('0.1', passportLogic.address, { from: monethaOwner, ...contractCreationParams });
  const passportFactory = await PassportFactory.new(passportLogicRegistry.address, { from: monethaOwner, ...contractCreationParams });
  passportFactoryAddress = passportFactory.address;

  // Create passport
  const generator = new PassportGenerator(web3, passportFactoryAddress);
  let txData = await generator.createPassport(passportOwner);

  let receipt = await txExecutor(txData);
  passportAddress = PassportGenerator.getPassportAddressFromReceipt(receipt);

  // Claim ownership
  const ownership = new PassportOwnership(web3, passportAddress);
  txData = await ownership.claimOwnership(passportOwner);
  await txExecutor(txData);

  // Write some private fact
  const writer = new FactWriter(web3, passportAddress, options);
  const writeResult = await writer.setPrivateData(privateFactKey, privateFactValue, factProviderAddress, ipfsClient);
  receipt = await txExecutor(writeResult.tx);

  // Create exchanger
  exchanger = new PrivateDataExchanger(web3, passportAddress, null, options);

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

    it('Random user should NOT be able to finish proposal', async () => {
      await expectSdkError(
        () => exchanger.finish(exchangeData.exchangeIndex, otherPersonAddress, txExecutor),
        ErrorCode.OnlyExchangeParticipantsCanClose);
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

  if (getNetwork() === NetworkType.Ganache) {

    describe('Main flow where passport owner finishes', () => {
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

        // Accept
        await exchanger.accept(
          exchangeData.exchangeIndex,
          passportOwnerPrivateKey,
          ipfsClient,
          txExecutor,
        );
      });

      after(async () => {
        await revertToSnapshot(web3, snapshotId);
      });

      it('Passport owner should finish proposal after expiration', async () => {

        exchanger = await advanceTime(30);

        await exchanger.finish(
          exchangeData.exchangeIndex,
          passportOwner,
          txExecutor,
        );
      });

      it('Status should be closed', async () => {
        const status = await exchanger.getStatus(exchangeData.exchangeIndex);
        expect(status.state).to.eq(ExchangeState.Closed);
      });
    });
  }

  // #endregion

  // #region -------------- Timeout -------------------------------------------------------------------

  if (getNetwork() === NetworkType.Ganache) {

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

        exchanger = await advanceTime(30);

        await expectSdkError(
          () => exchanger.accept(exchangeData.exchangeIndex, passportOwnerPrivateKey, ipfsClient, txExecutor),
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
  }

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

  if (getNetwork() === NetworkType.Ganache) {

    describe('Dispute after expiration', () => {
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

        // Accept
        await exchanger.accept(
          exchangeData.exchangeIndex,
          passportOwnerPrivateKey,
          ipfsClient,
          txExecutor,
        );
      });

      after(async () => {
        await revertToSnapshot(web3, snapshotId);
      });

      it('Should NOT open dispute after expiration', async () => {
        exchanger = await advanceTime(30);

        await expectSdkError(
          () => exchanger.dispute(exchangeData.exchangeIndex, exchangeData.exchangeKey, txExecutor),
          ErrorCode.ExchangeExpiredOrExpireSoon,
        );
      });
    });

  }

  // #endregion
});

// #region -------------- Helpers -------------------------------------------------------------------

async function advanceTime(hours: number): Promise<PrivateDataExchanger> {

  // Pass XX hours in blockchain
  await advanceTimeAndBlock(web3, hours * 60 * 60);

  return new PrivateDataExchanger(web3, passportAddress, () => {
    const now = new Date();

    // Now + XXh
    now.setTime(now.getTime() + hours * 60 * 60 * 1000);
    return now;
  },
    options);
}

// #endregion
