import Web3 from 'web3';

// Tests assume that they were run using Ganache with '-m' parameter with mnemonic below
// mnemonic: economy sight open cancel father goddess monkey mosquito mule village diet purpose
//
// Private Keys
// ==================
export const privateKeys = [
  '0x15a2afd0ac9e9e51bf608b936e3a9ab8a3a3c4b14504e03d0325ba918c9fa46b',
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

export const ethereumNetworkUrl = 'http://127.0.0.1:8545';

export const advanceTimeAndBlock = async (web3: Web3, time: number) => {
  await advanceTime(web3, time);
  await advanceBlock(web3);

  return Promise.resolve(web3.eth.getBlock('latest'));
};

export const advanceTime = async (web3: Web3, time: number) => {
  await web3.currentProvider.send('evm_increaseTime', [time]);
};

export const advanceBlock = async (web3: Web3) => {
  await web3.currentProvider.send('evm_mine', []);

  return web3.eth.getBlock('latest');
};

export const takeSnapshot = async (web3: Web3): Promise<string> => {
  return web3.currentProvider.send('evm_snapshot', []);
};

export const revertToSnapshot = async (web3: Web3, snapshotId: string) => {
  await web3.currentProvider.send('evm_revert', [snapshotId]);
};
