import Web3 from 'web3';
import { TransactionReceipt, TransactionConfig, } from 'web3-core';
import { getNetworkConfig } from '../network'


export function getAccounts(): string[] {
  return [
    '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
    '0xCe77204bFD60cce96A7609013dD2C3be4f56972a',
    '0x58C55B270fafd50A82E4659B50115231465a747D',
  ];
}

export function getPrivateKeys(): string[] {
  return [
    "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
    "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
    "9AF779C4AE2206F6BA7BBC03D0E9CBFA9D41363586F0171036BF974BB2C7C042",
    "FFEC0D7629E0B403F826679497191C6CBD19F8D6E699F368C4C9FFEB174BACB7"
  ];
}

export function getNodePublicKeys(): string[] {
  return [
    '7ILUn2MpEjjEqjgCApeeYTJz77H+H1IBxS54opBcJyA=',
    'Gam/vgKLffGO2+dTyBk4vOVCZB/sNVwd+FbyN9wk0QM=',
    'w6izWwzal61Q8pFAgV59xLv5yPzY3PCgYHXCdbkWOS0=',
    '44Q3cqHfyMCuZa2TNMjbSk6yK2gOvDnGHVsqYiQPokc=',
    'kSrLn2G9NaTm/jTa6J0MB9Wn/+OCQ3S3b3NwHKM7G2k=',
  ];
}

export function getNetworkNodeUrls(): string[] {
  let numberOfNodes = 5;
  const networkConfig = getNetworkConfig();
  let array = [];
  for (let index = 0; index < numberOfNodes; index++) {
    array.push(`http://${networkConfig.host}:${Number(networkConfig.port) + index}`)
  }
  return array;
}

export function getNetworkPrivateNodeUrls(): string[] {
  throw new Error(`You Should not access private transaction manager directly. Use submitPrivateTransaction method for submitting private transactions`);
}

export async function submitPrivateTransaction(web3: Web3, txData: TransactionConfig): Promise<TransactionReceipt> {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(a => a.toLowerCase() === txData.from.toString().toLowerCase());
  if (accountIndex === -1) {
    throw new Error(`Not possible to execute tx because private key for address ${txData.from} is not known`);
  }
  const privateKey = await getPrivateKeys()[accountIndex];
  const nodePubKeys = await getNodePublicKeys();

  const EEAClient = require("web3-eea");
  const web3eea = new EEAClient(web3, await web3.eth.net.getId());

  const raw = {
    gasPrice: txData.gasPrice,
    gasLimit: txData.gas,
    to: txData.to,
    data: txData.data,
    privateFrom: nodePubKeys[0],
    privateFor: [nodePubKeys[1]],
    privateKey: privateKey
  };

  const txHash = await web3eea.eea.sendRawTransaction(raw);
  const receipt = await web3eea.eea.getTransactionReceipt(txHash, [nodePubKeys[0]])
  return receipt;
}
