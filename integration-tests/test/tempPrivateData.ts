import { expect, use } from 'chai';
import chaiMoment from 'chai-moment';
use(chaiMoment);

import Web3 from 'web3';
import { PrivateFactReader, PrivateFactWriter } from '../../dist/lib/proto';
import fetch from 'node-fetch';

const ethereumNetworkUrl = 'https://ropsten.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90';
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

const passportAddress = '0x9e9f284eec140f312a225648de41e110f69ad50e';
const factProviderAddr = '0xd84083bBaEa544d446b081B7DEe2c9Fd1e5b4463';
const passportOwnerKey = 'e8b43cd0fdaab9453039659e9d772c34594fda0feed8a5b327adc4682ea3ac18';
const factKey = 'secret_message';
const factValue = 'my secret';
const INFURA_IPFS_API_URL = 'https://ipfs.monetha.io';

/*
FACT WRITE LOG

echo -n 'my secret' | ./write-fact -ownerkey pass_owner.key -fkey secret_message -ftype privatedata -passportaddr 0x9e9f284eec140f312a225648de41e110f69ad50e -datakeyfile data_enc.key -backendurl https://ropsten.infura.io
WARN [06-11|09:49:35.578] Loaded configuration                     fact_provider=0xd84083bBaEa544d446b081B7DEe2c9Fd1e5b4463 backend_url=https://ropsten.infura.io passport=0x9e9f284eEc140F312A225648DE41E110f69AD50E
WARN [06-11|09:49:36.430] Filtering OwnershipTransferred           newOwner=0xd84083bBaEa544d446b081B7DEe2c9Fd1e5b4463
WARN [06-11|09:49:36.564] Getting transaction by hash              tx_hash=0xfac429e56e031b0ec13944c74c6306d48432942f8a5c653ea103b286ecbe44b7
WARN [06-11|09:49:36.694] Writing ephemeral public key to IPFS...
WARN [06-11|09:49:37.905] Ephemeral public key added to IPFS       hash=QmeLMiNJ66Uwqu6EEVhWVvRqiq8jcEgSuuyunTPyqusCZF size=73
WARN [06-11|09:49:37.906] Writing encrypted message to IPFS...
WARN [06-11|09:49:40.280] Encrypted message added to IPFS          hash=QmaBwpxyCL3ZYLGAsXuBAFrmdoCtLAPWrirAKscq6kAqzK size=33
WARN [06-11|09:49:40.281] Writing message HMAC to IPFS...
WARN [06-11|09:49:41.300] Message HMAC added to IPFS               hash=QmfYaNu696BtoE5xWP1pD1fKja2bbGRe24TzGTeW7KaFek size=40
WARN [06-11|09:49:41.303] Creating directory in IPFS...
WARN [06-11|09:49:43.647] Directory created in IPFS                hash=Qmf1b8M3XpnBnN4wMK5bagLmTd7BGjzPMyCoogG6K2zgyB
WARN [06-11|09:49:43.649] Writing private data hashes to Ethereum  passport=0x9e9f284eEc140F312A225648DE41E110f69AD50E fact_key="[115 101 99 114 101 116 95 109 101 115 115 97 103 101 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]" ipfs_hash=Qmf1b8M3XpnBnN4wMK5bagLmTd7BGjzPMyCoogG6K2zgyB data_key_hash=0xf07927f3a119baaff41e24bb87fd2e7eb93142c42fe1033800625b3ec7a15359
WARN [06-11|09:49:43.783] Writing IPFS private data hashes to passport fact_provider=0xd84083bBaEa544d446b081B7DEe2c9Fd1e5b4463 key="[115 101 99 114 101 116 95 109 101 115 115 97 103 101 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]"
WARN [06-11|09:49:44.391] Waiting for transaction                  hash=0x8c1abab144ec5e04e22ce2627090815d53f86dd287ec40b6f70edc977f16cfed
WARN [06-11|09:50:05.204] Transaction successfully mined           tx_hash=0x8c1abab144ec5e04e22ce2627090815d53f86dd287ec40b6f70edc977f16cfed gas_used=135967
WARN [06-11|09:50:05.206] Writing data encryption key to file      file_name=data_enc.key
WARN [06-11|09:50:05.209] Done.
*/

describe('Private data tests', () => {
  it('Should read fact', async () => {
    const reader = new PrivateFactReader(web3, passportAddress);
    const ipfsClient = new IPFSClient();

    const data = await reader.getPrivateData(passportOwnerKey, factProviderAddr, factKey, ipfsClient);
    const dataStr = Buffer.from(data).toString('utf8');

    expect(dataStr).to.eq(factValue);
  });

  it('Should write fact', async () => {
    const writer = new PrivateFactWriter(web3, passportAddress);
    const ipfsClient = new IPFSClient();

    const data = await writer.setPrivateData(factProviderAddr, factKey, Array.from(Buffer.from(factValue, 'utf8')), ipfsClient);

    expect(data).to.not.eq(null);
  });
});

// #region -------------- IPFS Client -------------------------------------------------------------------

class IPFSClient {
  public async cat(path) {
    const response = await fetch(`${INFURA_IPFS_API_URL}/ipfs/${path}`);
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg);
    }

    return response.arrayBuffer();
  }

  public async add(data) {
    throw new Error('not implemented');

    return null;
  }
}

// #endregion
