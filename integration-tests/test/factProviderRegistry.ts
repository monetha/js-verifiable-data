import { Harmony } from '@harmony-js/core';
import { ChainType } from '@harmony-js/utils';
import { Contract, deployContract } from 'common/deployContracts';
import { logVerbose } from 'common/logger';
import { addAccountsFromPrivateKeys, getAccount, getNetworkNodeUrl, getPrivateKey } from 'common/network';
import { createTxExecutor } from 'common/tx';
import { Address, FactProviderManager, IFactProviderInfo } from 'verifiable-data';

const harmony = new Harmony(getNetworkNodeUrl(), {
  chainType: ChainType.Harmony,
  chainId: 2,
  shardID: 0,
});

addAccountsFromPrivateKeys(harmony);

const contractCreationParams: any = {};
const txExecutor = createTxExecutor();

let registryOwner: string;
let registryOwnerPrivateKey: string;
let registryAddress: string;
let factProvider1: Address;
let factProvider2: Address;
let factProvider3: Address;
let factProvider1Info: IFactProviderInfo;
let factProvider2Info: IFactProviderInfo;

before(async () => {
  registryOwner = await getAccount(harmony, 0);
  factProvider1 = await getAccount(harmony, 1);
  factProvider2 = await getAccount(harmony, 2);
  factProvider3 = await getAccount(harmony, 3);
  registryOwnerPrivateKey = getPrivateKey(0);

  factProvider1Info = {
    name: 'Fact provider 1',
    passport: '0x1111111111111111111111111111111111111111',
    website: 'www.fact-provider1.io',
  };

  factProvider2Info = {
    name: 'Fact provider 2',
  };

  // Deploy contracts
  const registry = await deployContract(harmony, Contract.FactProviderRegistryArtifact, contractCreationParams);
  registryAddress = registry.address;

  logVerbose('----------------------------------------------------------');
  logVerbose('FACT PROVIDER REGISTRY:'.padEnd(45), registryAddress);
  logVerbose('FACT PROVIDER REGISTRY OWNER PRIVATE KEY:'.padEnd(45), registryOwnerPrivateKey);
  logVerbose('----------------------------------------------------------');
});

describe('Fact provider registry CRUD', () => {
  it('Should set initial info', async () => {
    const manager = new FactProviderManager(harmony, registryAddress);

    let txData = await manager.setInfo(factProvider1, factProvider1Info, registryOwner);
    await txExecutor(txData);

    txData = await manager.setInfo(factProvider2, factProvider2Info, registryOwner);
    await txExecutor(txData);
  });

  it('Should read info', async () => {
    const manager = new FactProviderManager(harmony, registryAddress);

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.deep.equal(factProvider1Info);

    const info2 = await manager.getInfo(factProvider2);
    expect(info2).to.deep.equal(factProvider2Info);
  });

  it('Should return null for non-existing info', async () => {
    const manager = new FactProviderManager(harmony, registryAddress);

    const info3 = await manager.getInfo(factProvider3);
    expect(info3).to.equal(null);
  });

  it('Should update info', async () => {
    const manager = new FactProviderManager(harmony, registryAddress);

    factProvider1Info = {
      name: 'MODIFIED NAME',
    };

    const txData = await manager.setInfo(factProvider1, factProvider1Info, registryOwner);
    await txExecutor(txData);

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.deep.equal(factProvider1Info);
  });

  it('Should delete info', async () => {
    const manager = new FactProviderManager(harmony, registryAddress);

    const txData = await manager.deleteInfo(factProvider1, registryOwner);
    await txExecutor(txData);

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.equal(null);
  });
});
