require('ts-node/register');
require('tsconfig-paths/register');

const PrivateKeyProvider = require("truffle-hdwallet-provider");
const pantheonPrivateKeys = [
  "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
  "9AF779C4AE2206F6BA7BBC03D0E9CBFA9D41363586F0171036BF974BB2C7C042",
  "FFEC0D7629E0B403F826679497191C6CBD19F8D6E699F368C4C9FFEB174BACB7",
  "4F74BE89C59AF7698A185E611F07AAB68DC9F6768DFE1F429D22862497A3B828",
];

const quorumPrivateKeys = [
    "e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1",
    "4762e04d10832808a0aebdaa79c12de54afbe006bfffd228b3abcc494fe986f9",
    "61dced5af778942996880120b303fc11ee28cc8e5036d2fdff619b5675ded3f0",
    "794392ba288a24092030badaadfee71e3fa55ccef1d70c708baf55c07ed538a8",
    "30bee17b2b8b1e774115f785e92474027d45d900a12a9d5d99af637c2d1a61bd",
    "4F74BE89C59AF7698A185E611F07AAB68DC9F6768DFE1F429D22862497A3B828",
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
      // Gas price in Quorum is always zero, even accounts with no ETH can be used
      provider: new PrivateKeyProvider(quorumPrivateKeys, "http://127.0.0.1:22000", 0, quorumPrivateKeys.length),
      host: "127.0.0.1",
      port: 22000,
      enclavePort: 9081,
      timeoutBlocks: 100,
      network_id: "*",
      gasPrice: 0,
      type: "quorum"
    },
    pantheon: {
      provider: new PrivateKeyProvider(pantheonPrivateKeys, "http://127.0.0.1:22001", 0, pantheonPrivateKeys.length),
      host: "127.0.0.1",
      port: "22001",
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
