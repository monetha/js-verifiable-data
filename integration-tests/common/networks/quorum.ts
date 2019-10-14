import quorumjs from 'quorum-js';
import Web3 from 'web3';
import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { toBN } from 'verifiable-data';
import { getNetworkConfig } from '../network'

export function getAccounts(): string[] {
  return [
    // First entry matches first node account
    '0xed9d02e382b34818e88B88a309c7fe71E65f419d',

    // Other entries are random addresses
    '0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e',
    '0x0fBDc686b912d7722dc86510934589E0AAf3b55A',
    '0x9186eb3d20Cbd1F5f992a950d808C4495153ABd5',
    '0x0638E1574728b6D862dd5d3A3E0942c3be47D996',
    '0xe4d94A0A519E8700822Af7c757728FF9D3fb5895',
    '0x17282874ecfeeda9c89c19ab8fcec934127a58a6',
    '0xfab9de7e3de2f1dc41aa076c8acc6928f46c2bcb',
    '0xc08ae943e3bb31f4c650804973a1d8543b65a334',
    '0x68680847be452d6d6f5392a624b10d4e6beec3cf',
  ];
}

export function getPrivateKeys(): string[] {
  return [
    // First entry matches first node account
    '0xe6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1',

    // Other entries are random addresses
    '0x4762e04d10832808a0aebdaa79c12de54afbe006bfffd228b3abcc494fe986f9',
    '0x61dced5af778942996880120b303fc11ee28cc8e5036d2fdff619b5675ded3f0',
    '0x794392ba288a24092030badaadfee71e3fa55ccef1d70c708baf55c07ed538a8',
    '0x30bee17b2b8b1e774115f785e92474027d45d900a12a9d5d99af637c2d1a61bd',
    '0x4F74BE89C59AF7698A185E611F07AAB68DC9F6768DFE1F429D22862497A3B828',
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

export function getNetworkNodeUrls(): string[] {
  const numberOfNodes = 7;
  let array = [];
  const networkConfig = getNetworkConfig();
  for (let index = 0; index < numberOfNodes; index++) {
    array.push(`http://${networkConfig.host}:${Number(networkConfig.port) + index}`)
  }
  return array;
}

export function getNetworkPrivateNodeUrls(): string[] {
  const numberOfNodes = 7;
  let array = [];
  const networkConfig = getNetworkConfig();
  for (let index = 0; index < numberOfNodes; index++) {
    array.push(`http://${networkConfig.host}:${Number(networkConfig.enclavePort) + index}`)
  }
  return array;
}

export async function submitPrivateTransaction(web3: Web3, txData: TransactionConfig): Promise<TransactionReceipt> {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(a => a.toLowerCase() === txData.from.toString().toLowerCase());
  if (accountIndex === -1) {
    throw new Error(`Not possible to execute tx because private key for address ${txData.from} is not known`);
  }

  const privateKeys = getPrivateKeys();
  const privateKey = privateKeys[accountIndex];

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const enclaveOptions = {
    privateUrl: getNetworkPrivateNodeUrls()[0],
  };

  const rawTransactionManager = quorumjs.RawTransactionManager(web3, enclaveOptions);

  const nodePubKeys = getNodePublicKeys();

  const tx = await rawTransactionManager.sendRawTransaction({
    gasPrice: 0,
    gasLimit: txData.gas,
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
