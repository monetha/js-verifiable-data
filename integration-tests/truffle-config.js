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

module.exports = {
  mocha: {
    enableTimeouts: false
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      timeoutBlocks: 100,
      network_id: "*" // Match any network id
    },
    quorum: {
      host: "127.0.0.1",
      port: 22000,
      timeoutBlocks: 100,
      network_id: "*", // Match any network id
      gasPrice: 0,
      type: "quorum"
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24" // A version or constraint - Ex. "^0.4.24"
    }
  }
};
