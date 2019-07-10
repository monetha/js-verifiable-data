import quorumjs from 'quorum-js';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { getNetworkConfig } from './network';
import { IRawTX, toBN } from 'reputation-sdk';

export function getAccounts(): string[] {
  return [
    // First entry matches first node account
    '0xed9d02e382b34818e88b88a309c7fe71e65f419d',

    // Other entries are random addresses
    '0xe4e0117ee7dafcc08890ae4b687b82fbb36dad26',
    '0x4bc7938c260517e2a88716b50614cf2ef53887b3',
    '0x5a9ddb4faeff240fd4152cd743d8bed059499e6b',
    '0x29bd6bdd1148d4dd4ff5040a487a9650d45fb393',
    '0xaf25cfe1bdea10f091efc5e041f5d3d6e12e6ac2',
    '0x17282874ecfeeda9c89c19ab8fcec934127a58a6',
    '0xfab9de7e3de2f1dc41aa076c8acc6928f46c2bcb',
    '0xc08ae943e3bb31f4c650804973a1d8543b65a334',
    '0x68680847be452d6d6f5392a624b10d4e6beec3cf',
  ];
}

export function getPrivateKeys(): string[] {
  return [
    // First entry matches first node account
    '0xE6181CAAFFFF94A09D7E332FC8DA9884D99902C7874EB74354BDCADF411929F1',

    // Other entries are random addresses
    '0x4592c4fb70300d888419148844233ae5eae4c73b3d18cfd6952e1e081b06f57c',
    '0xe083b950a6acd10f01af569b5e6cb18ff9ba657a0f6499ddce229cf7c5a78854',
    '0x6d46ff676b00066d02661d937cc659b5bb531be4a8abe5b570d762b2dc954325',
    '0xb60c3d80098c4ee4980067864c0398808e007dbccf00f4521035d0bbc7d62fe6',
    '0x3e0763e8431abf7ca61a1e3330c3be3eb6cdb2b45dc1e34e8fc505e053ef3178',
    '0xc0f7c843fbe2e938f3d3650d4543dc961ac2b11e804047674fc221a61f1693c2',
    '0xda8de30239f609fe2d21d1ce75335604fb79715a9e89ae1baeef05fd75cee154',
    '0x385e61c258ee042debd606bfab24e27aadae3a4acdb07828994d27fe343249c8',
    '0xffc607dafc5568ac460d73384ed06baa72e9268995501d048aea7ed6448a32a1',
  ];
}

export function getNodePublicKeys(): string[] {
  return [
    'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=',
    'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
    '1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=',
    'oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=',
    'R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=',
    'UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y=',
    'ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=',
  ];
}

export async function submitPrivateTransaction(web3: Web3, txData: IRawTX): Promise<TransactionReceipt> {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(a => a.toLowerCase() === txData.from.toLowerCase());
  if (accountIndex === -1) {
    throw new Error(`Not possible to execute tx because private key for address ${txData.from} is not known`);
  }

  const privateKeys = getPrivateKeys();
  const privateKey = privateKeys[accountIndex];

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const networkConfig = getNetworkConfig();

  const enclaveOptions = {
    privateUrl: `http://${networkConfig.host}:${networkConfig.enclavePort}`,
  };

  const rawTransactionManager = quorumjs.RawTransactionManager(web3, enclaveOptions);

  const nodePubKeys = getNodePublicKeys();

  const tx = await rawTransactionManager.sendRawTransaction({
    gasPrice: 0,
    gasLimit: txData.gasLimit,
    to: txData.to,
    value: toBN(txData.value).toNumber(),
    data: txData.data,
    from: account,
    nonce: toBN(txData.nonce).toNumber(),
    isPrivate: true,
    privateFor: [nodePubKeys[1]],
  });

  return tx;
}
