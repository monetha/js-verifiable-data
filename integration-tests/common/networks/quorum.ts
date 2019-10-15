import quorumjs from 'quorum-js';
import Web3 from 'web3';
import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { toBN } from 'verifiable-data';
import { getNetworkConfig } from '../network'

export function getAccounts(): string[] {
  return [
    // First entry matches first node account
    '0xed9d02e382b34818e88b88a309c7fe71e65f419d',

    // Other entries are random addresses
    '0xca843569e3427144cead5e4d5999a3d0ccf92b8e',
    '0x0fbdc686b912d7722dc86510934589e0aaf3b55a',
    '0x9186eb3d20cbd1f5f992a950d808c4495153abd5',
    '0x0638e1574728b6d862dd5d3a3e0942c3be47d996',
    '0xe4d94a0a519e8700822af7c757728ff9d3fb5895',
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
    '0x4762E04D10832808A0AEBDAA79C12DE54AFBE006BFFFD228B3ABCC494FE986F9',
    '0x61DCED5AF778942996880120B303FC11EE28CC8E5036D2FDFF619B5675DED3F0',
    '0x794392BA288A24092030BADAADFEE71E3FA55CCEF1D70C708BAF55C07ED538A8',
    '0x30BEE17B2B8B1E774115F785E92474027D45D900A12A9D5D99AF637C2D1A61BD',
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
