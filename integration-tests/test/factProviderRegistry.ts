import { logVerbose } from 'common/logger';
import { getAccount, getNetwork, getNetworkNodeUrl, getNodePublicKey, getPrivateKey, NetworkType } from 'common/network';
import { isPrivateTxMode, createTxExecutor } from 'common/tx';
import { FactProviderRegistry } from 'lib/types/web3-contracts/FactProviderRegistry';
import { Address, FactProviderManager, IFactProviderInfo } from 'verifiable-data';
import Web3 from 'web3';

const FactProviderRegistryArtifact = artifacts.require('FactProviderRegistry');

const web3 = new Web3(new Web3.providers.HttpProvider(getNetworkNodeUrl()));
const contractCreationParams: any = {};
const txExecutor = createTxExecutor(web3);

let registryOwner: string;
let registryOwnerPrivateKey: string;
let registry: FactProviderRegistry;
let registryAddress: string;
let factProvider1: Address;
let factProvider2: Address;
let factProvider3: Address;
let factProvider1Info: IFactProviderInfo;
let factProvider2Info: IFactProviderInfo;

before(async () => {
  registryOwner = await getAccount(web3, 0);
  factProvider1 = await getAccount(web3, 1);
  factProvider2 = await getAccount(web3, 2);
  factProvider3 = await getAccount(web3, 3);
  registryOwnerPrivateKey = getPrivateKey(0);

  factProvider1Info = {
    name: 'Fact provider 1',
    passport: '0x1111111111111111111111111111111111111111',
    website: 'www.fact-provider1.io',
  };

  factProvider2Info = {
    name: 'Fact provider 2',
  };

  if (isPrivateTxMode) {
    switch (getNetwork()) {
      case NetworkType.Quorum:
        contractCreationParams.privateFor = [getNodePublicKey(1)];
        break;
      default:
        break;
    }
  }

  // Deploy contracts
  registry = await FactProviderRegistryArtifact.new({ from: registryOwner, ...contractCreationParams });
  registryAddress = registry.address;

  logVerbose('----------------------------------------------------------');
  logVerbose('FACT PROVIDER REGISTRY:'.padEnd(45), registryAddress);
  logVerbose('FACT PROVIDER REGISTRY OWNER PRIVATE KEY:'.padEnd(45), registryOwnerPrivateKey);
  logVerbose('----------------------------------------------------------');
});

describe('Fact provider registry CRUD', () => {
  it('Should set initial info', async () => {
    const manager = new FactProviderManager(web3, registryAddress);

    let txData = await manager.setInfo(factProvider1, factProvider1Info, registryOwner);
    let receipt = await txExecutor(txData);
    expect(receipt.status).to.be.true;

    txData = await manager.setInfo(factProvider2, factProvider2Info, registryOwner);
    receipt = await txExecutor(txData);
    expect(receipt.status).to.be.true;
  });

  it('Should read info', async () => {
    const manager = new FactProviderManager(web3, registryAddress);

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.deep.equal(factProvider1Info);

    const info2 = await manager.getInfo(factProvider2);
    expect(info2).to.deep.equal(factProvider2Info);
  });

  it('Should return null for non-existing info', async () => {
    const manager = new FactProviderManager(web3, registryAddress);

    const info3 = await manager.getInfo(factProvider3);
    expect(info3).to.equal(null);
  });

  it('Should update info', async () => {
    const manager = new FactProviderManager(web3, registryAddress);

    factProvider1Info = {
      name: 'MODIFIED NAME',
    };

    const txData = await manager.setInfo(factProvider1, factProvider1Info, registryOwner);
    const receipt = await txExecutor(txData);
    expect(receipt.status).to.be.true;

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.deep.equal(factProvider1Info);
  });

  it('Should delete info', async () => {
    const manager = new FactProviderManager(web3, registryAddress);

    const txData = await manager.deleteInfo(factProvider1, registryOwner);
    const receipt = await txExecutor(txData);
    expect(receipt.status).to.be.true;

    const info1 = await manager.getInfo(factProvider1);
    expect(info1).to.equal(null);
  });
});
