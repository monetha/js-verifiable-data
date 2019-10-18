import { getAccount } from '../common/network';

const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const PassportFactory = artifacts.require('PassportFactory');
const FactProviderRegistryArtifact = artifacts.require('FactProviderRegistry');

export enum Contract {
  PassportLogic = 'PassportLogic',
  PassportLogicRegistry = 'PassportLogicRegistry',
  PassportFactory = 'PassportFactory',
  FactProviderRegistryArtifact = 'FactProviderRegistryArtifact',
}

const deployedContracts = new Map<Contract, any>();

export const deployContract = async (contract: Contract, contractCreationParams?: any) => {
  const monethaOwner = await getAccount(web3, 0);
  const registryOwner = monethaOwner;

  const deployedContract = deployedContracts.get(contract);
  if (deployedContract) {
    return deployedContract;
  }

  switch (contract) {
    case Contract.PassportLogic:
      const passportLogic = await PassportLogic.new({ from: monethaOwner, ...contractCreationParams });
      deployedContracts.set(Contract.PassportLogic, passportLogic);
      return passportLogic;

    case Contract.PassportLogicRegistry:
      if (!deployedContracts.get(Contract.PassportLogic)) {
        throw new Error(`${Contract.PassportLogic} was not deployed yet.`);
      }

      const passportLogicRegistry = await PassportLogicRegistry.new(
        '0.1',
        deployedContracts.get(Contract.PassportLogic).address,
        { from: monethaOwner, ...contractCreationParams },
      );

      deployedContracts.set(Contract.PassportLogicRegistry, passportLogicRegistry);
      return passportLogicRegistry;

    case Contract.PassportFactory:
      if (!deployedContracts.get(Contract.PassportLogicRegistry)) {
        throw new Error(`${Contract.PassportLogicRegistry} was not deployed yet.`);
      }

      const passportFactory = await PassportFactory.new(
        deployedContracts.get(Contract.PassportLogicRegistry).address,
        { from: monethaOwner, ...contractCreationParams },
      );

      deployedContracts.set(Contract.PassportFactory, passportFactory);
      return passportFactory;

    case Contract.FactProviderRegistryArtifact:
      const factProviderRegistry = await FactProviderRegistryArtifact.new({ from: registryOwner, ...contractCreationParams });
      deployedContracts.set(Contract.FactProviderRegistryArtifact, factProviderRegistry);
      return factProviderRegistry;

    default:
      throw new Error(`Unknown contract: ${contract}`);
  }
};
