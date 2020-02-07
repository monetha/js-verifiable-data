require('ts-node/register');
require('tsconfig-paths/register');

const { TruffleProvider } = require('@harmony-js/core');

const harmonyTestnetPrivateKey = '01F903CE0C960FF3A9E68E80FF5FFC344358D80CE1C221C3F9711AF07F83A3BD';
const harmonyTestnetMnemonic = 'urge clog right example dish drill card maximum mix bachelor section select';

module.exports = {
  mocha: {
    enableTimeouts: false
  },
  networks: {
    harmony_testnet: {
      network_id: '2', // Any network (default: none)
      provider: () => {
        const truffleProvider = new TruffleProvider(
          'https://api.s0.b.hmny.io',
          { memonic: harmonyTestnetMnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: '6721900', gasPrice: '1000000000' },
        );
        const newAcc = truffleProvider.addByPrivateKey(harmonyTestnetPrivateKey);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24" // A version or constraint - Ex. "^0.4.24"
    }
  }
};
