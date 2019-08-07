/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

require('ts-node/register');
require('tsconfig-paths/register');

const PrivateKeyProvider = require("truffle-hdwallet-provider");
const pantheonPrivateKeys = [
  "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
  "9AF779C4AE2206F6BA7BBC03D0E9CBFA9D41363586F0171036BF974BB2C7C042",
  "FFEC0D7629E0B403F826679497191C6CBD19F8D6E699F368C4C9FFEB174BACB7"
];

module.exports = {
  mocha: {
    enableTimeouts: false
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      timeoutBlocks: 100,
      network_id: "*"
    },
    quorum: {
      host: "127.0.0.1",
      port: 22000,
      timeoutBlocks: 100,
      network_id: "*",
      gasPrice: 0,
      type: "quorum"
    },
    pantheon: {
      provider: new PrivateKeyProvider(pantheonPrivateKeys, "http://172.17.0.1:22001", 0, pantheonPrivateKeys.length),
      timeoutBlocks: 100,
      network_id: "*",
      gas: "0x1ffffffffffffe",
      gasPrice: 0,
      type: "pantheon"
    },
  },
  compilers: {
    solc: {
      version: "^0.4.24" // A version or constraint - Ex. "^0.4.24"
    }
  }
};
