# Monetha: Decentralized Reputation Framework

# Reputation Layer: js-sdk [![Build Status][1]][2]

[1]: https://travis-ci.org/monetha/reputation-js-sdk.svg?branch=master
[2]: https://travis-ci.org/monetha/reputation-js-sdk

- [Monetha: Decentralized Reputation Framework](#monetha-decentralized-reputation-framework)
- [Reputation Layer: js-sdk](#reputation-layer-js-sdk)
  - [Building the source](#building-the-source)
    - [Prerequisites](#prerequisites)
    - [Build](#build)
  - [Bootstrap reputation layer](#bootstrap-reputation-layer)
  - [Usage](#usage)
    - [Deploying passport](#deploying-passport)
    - [Passport ownership](#passport-ownership)
    - [Passport list](#passport-list)
    - [Writing facts](#writing-facts)
    - [Reading facts](#reading-facts)
    - [Managing passport permissions](#managing-passport-permissions)
    - [Reading facts history](#reading-facts-history)
    - [Private facts](#private-data)
      - [Writing private data](#writing-private-data)
      - [Reading private data](#reading-private-data)
    - [Private data exchange](#private-data-exchange)
      - [Proposing private data exchange](#proposing-private-data-exchange)
      - [Getting status of private data exchange](#getting-status-of-private-data-exchange)
      - [Accepting private data exchange](#accepting-private-data-exchange)
      - [Reading private data after private data exchange acceptance](#reading-private-data-after-private-data-exchange-acceptance)
      - [Closing private data exchange proposition when timed out](#closing-private-data-exchange-proposition-when-timed-out)
      - [Closing private data exchange after acceptance](#closing-private-data-exchange-after-acceptance)
      - [Opening dispute after private data exchange acceptance](#opening-dispute-after-private-data-exchange-acceptance)
  - [Permissioned blockchains support](#permissioned-blockchains-support)
    - [Quorum](#quorum)

## Building the source

### Prerequisites

* Node.js >= 8.9.*
* npm >= 5.*

### Build

The build process is set to be automatic you just need to install the package using:

`npm install --save git+https://github.com/monetha/reputation-js-sdk.git`

or

`yarn add git+https://github.com/monetha/reputation-js-sdk.git`

## Bootstrap reputation layer

Monetha has already deployed this set of auxiliary reputation layer contracts on Ropsten test network and Mainnet network.

The contract addresses deployed on Ropsten:

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0xaa8e71D8Fb521eaEdE9F11d8fd5182920Cb03229`](https://ropsten.etherscan.io/address/0xaa8e71D8Fb521eaEdE9F11d8fd5182920Cb03229) |
| `PassportLogicRegistry`  | [`0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c`](https://ropsten.etherscan.io/address/0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c) |
| `PassportFactory` | [`0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2`](https://ropsten.etherscan.io/address/0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2) |

The contract addresses deployed on Mainnet:

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0xA9068B8E0D0a5B2c77dF601be3bB3d168c7fc3e2`](https://etherscan.io/address/0xA9068B8E0D0a5B2c77dF601be3bB3d168c7fc3e2) |
| `PassportLogicRegistry`  | [`0x41c32A8387ff178659ED9B04190613623F545657`](https://etherscan.io/address/0x41c32A8387ff178659ED9B04190613623F545657) |
| `PassportFactory` | [`0x53b21DC502b163Bcf3bD9a68d5db5e8E6110E1CC`](https://etherscan.io/address/0x53b21DC502b163Bcf3bD9a68d5db5e8E6110E1CC) |

Consider the process of deploying your own set of auxiliary repoutation layer contracts to experiment with our implementation. If you are going to deploy your contracts, then you will have to support them yourself.

This means that if the reputation layer logic of the passport is updated by Monetha developers, you'll need to deploy a new `PassportLogic` contract, register it
in an existing `PassportLogicRegistry` contract (by calling `addPassportLogic` method) and finally make it active (by calling `setCurrentPassportLogic`).

If you use a set of Monetha deployed reputation layer contracts, then the reputation passport logic is always up-to-date with latest fixes and features.

Prepare in advance the address that will be the owner of the deployed contracts. Make sure that it has enough funds to deploy contracts (1 ETH should be enough).

## Usage

```js
import sdk from 'reputation-sdk';
const generator = new sdk.PassportGenerator(web3, passportFactoryAddress);
```

In order to create a passport and start using it, you need to use auxiliary reputation layer contracts: PassportLogic, PassportLogicRegistry, PassportFactory.

### Deploying passport

Before creating a passport for a specific Ethereum address, unlock the MetaMask.
Make sure that the passport owner has enough money to create a passport contract. Usually passport contract deployment takes `425478` gas.

To create a passport contract you need to know the address of the `PassportFactory` contract. Let's try to create a passport in Ropsten
using the `PassportFactory` contract deployed by Monetha ([`0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2`](https://ropsten.etherscan.io/address/0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2)):

```js
import sdk from 'reputation-sdk';
const generator = new sdk.PassportGenerator(web3, passportFactoryAddress);
generator.createPassport(walletAddress);
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in walletAddress and broadcast it on the network.

### Passport ownership

After the passport is created, the owner must call the `claimOwnership` method to become a full owner:

```js
import sdk from 'reputation-sdk';
const generator = new sdk.PassportOwnership(web3, passportAddress);
generator.claimOwnership(ownerAddress);
```

To returns passport owner address call getOwnerAddress():

```js
generator.getOwnerAddress();
```

### Passport list

The passport factory allows you to get a list of all the passports that have been created.

Let's try to get a list of all passports using the address of `PassportFactory` contract deployed by Monetha ([`0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2`](https://ropsten.etherscan.io/address/0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2))
in Ropsten network:

```js
import sdk from 'reputation-sdk';
const reader = new sdk.PassportReader(web3, ethereumNetworkUrl);
reader.getPassportsList('0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2');
```

You should get something like this Array of objects:

|passportAddress|ownerAddress|blockNumber|blockHash|
|----------------|-----------|------------|-------|
|0x1C3A76a9A27470657BcBE7BfB47820457E4DB682|0xDdD9b3Ea9d65cfD12b18ceA4E6f7Df4948ec4C55|5233845|0x33e7d5dc34f5e8597859c319c34ef4f613238defbadcc2fda3ae65f508b45884|

The block number and transaction hash indicate the transaction in which the passport was created.

All passports use the same passport logic contract. Once a new passport logic is added to the passport logic registry and is
activated, it will be immediately used by all passports created by this factory. How cool is that!

### Writing facts

After the passport is created, any fact provider can start writing data to the passport.

Make sure that the fact provider has enough funds to write the facts.

**Gas usage**

Cumulative gas usage in simulated backend to store number of character of `a` under the key
`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` using different data types:

| Number of characters |     `ipfs*`, gas used    |     `txdata`, gas used    |  `bytes`, gas used |  `string`, gas used |
|---------------------:|--------------------------:|--------------------------:|-------------------:|-------------------:|
| 10 | 114245 | 70436 | 71079 | 71211 |
| 100 | 114245 | 76598 | 157571 | 157703 |
| 500 | 114245 | 103870 | 425756 | 425888 |
| 1000 | 114245 | 138016 | 781119 | 781251 |
| 5000 | 114245 | 410814 | 3563467 | 3563599 |
| 10000 | 114245 | 751864 | 7036521 | 7036653 |
| 50000 | 114245 | 3483963 | - | - |
| 100000 | 114245 | 6907662 | - | - |
| 110000 | 114245 | 7593621 | - | - |
| 120000 | 114245 | 8279814 | - | - |
| 130000 | 114245 | 8966537 | - | - |

You can write up to 100KB of data in passport under one key when `txdata` data type is used. Supported data types that
can be written to the passport: `string`, `bytes`, `address`, `uint`, `int`, `bool`, `txdata`, `ipfshash`. All types except `txdata`
use Ethereum storage to store the data. `txdata` uses Ethereum storage only to save the block number, the data itself
remains in the transaction input data and can be read later using the SDK. Therefore, if you need to save a large amount
of data, it is better to use `txdata` type of data. The disadvantage of the `txdata` type of data is the data can only be read
using the SDK, within the contracts this data is not available.

Let's try to store string  `hello` under the key `greetings` as `string` in passport
`<passportAddress>`:


```js
import sdk from 'reputation-sdk';
const writer = new sdk.FactWriter(web3, passportAddress);
writer.setString('greetings', 'hello', factProviderAddress);
```

Also user can delete the data stored from the passport.

Let's try to delete string  `hello` under the key `greetings` as `string` in passport
`<passportAddress>`:

```js
import sdk from 'reputation-sdk';
const remover = new sdk.FactRemover(web3, passportAddress);
remover.deleteString('greetings', factProviderAddress);
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in factProviderAddress and broadcast it on the network.

**Writing facts examples:**

Writes address type fact to passport:

```js
writer.setAddress('address_1', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', factProviderAddress);
```

Writes boolean type fact to passport:

```js
writer.setBool('barcelona_won_uefa', false, factProviderAddress);
```

Writes bytes type fact to passport:

```js
writer.setBytes('bytes_data', [1, 2, 3], factProviderAddress);
```

Writes IPFS hash data type fact to passport:

```js
writer.setIPFSData('logo', 'QmaSjk86XyXQzeZ5JCVS2scNYiUBsmALyGBUjatEiQuc3q', factProviderAddress, ipfsClient);
```

Writes int type fact to passport:

```js
writer.setInt('lt_population', 2848000, factProviderAddress);
```

Writes TX data type fact to passport:

```js
writer.setTxdata('tx_1', [1, 2, 3], factProviderAddress);
```

Writes uint type fact to passport:

```js
writer.setUint('jonas_rating', 4294100000, factProviderAddress);
```

Writes private data type fact to passport (read more about private data in [Private data](#private-data)):

```js
writer.setPrivateData('secret_message', [1, 2, 3], factProviderAddress, ipfsClient);
```

Sign the transaction using the private key of address given in factProviderAddress and broadcast it on the network.

**Deleting facts examples:**

Deletes address type fact from passport:

```js
remover.deleteAddress(factProviderAddress, 'address_1');
```

Deletes bool type fact from passport:

```js
remover.deleteBool(factProviderAddress, 'barcelona_won_uefa');
```

Deletes byte type fact from passport:

```js
remover.deleteBytes(factProviderAddress, 'bytes_data');
```

Deletes IPFS hash type fact from passport:

```js
remover.deleteIPFSHash(factProviderAddress, 'logo', IIPFSClient);
```

Deletes int type fact from passport:

```js
remover.deleteInt(factProviderAddress, 'lt_population');
```

Deletes txdata type fact from passport:

```js
remover.deleteTxdata(factProviderAddress, 'tx_1');
```

Deletes uint type fact from passport:

```js
remover.deleteUint(factProviderAddress, 'jonas_rating');
```

Deletes private data type fact from passport (read more about private data in [Private data](#private-data)):

```js
remover.deletePrivateDataHashes('secret_message', factProviderAddress);
```

Sign the transaction using the private key of address given in factProviderAddress and broadcast it on the network.

### Reading facts

After the fact provider has written the public data to the passport, the data can be read by anyone.
To read the data you need to know: the address of the passport, the address of the fact provider who stored the data,
the key under which the data was stored and the type of data.

Let's try to retrieve string from passport `<passportAddress>` that was stored by the fact provider
`<factProviderAddress>` under the key `greetings` as `string` data type:

```js
import sdk from 'reputation-sdk';
const reader = new sdk.FactReader(web3, ethereumNetworkAddress, passportAddress);
reader.getString(factProviderAddress, 'greetings');
```

**Reading facts examples:**

Read address type fact from passport:

```js
reader.getAddress(factProviderAddress, 'address_1');
```

Read boolean type fact from passport:

```js
reader.getBool(factProviderAddress, 'barcelona_won_uefa');
```

Deletes byte type fact from passport:

```js
reader.getBytes(factProviderAddress, 'bytes_data');
```

Read IPFS hash type fact from passport:

```js
reader.getIPFSData(factProviderAddress, 'logo', ipfsClient);
```

Read int type fact from passport:

```js
reader.getInt(factProviderAddress, 'lt_population');
```

Read TX data type fact from passport:

```js
reader.getTxdata(factProviderAddress, 'tx_1');
```

Read uint type fact from passport:

```js
reader.getUint(factProviderAddress, 'jonas_rating');
```

Reads private data type fact from passport using passport owner's private key (read more about private data in [Private data](#private-data)):

```js
reader.getPrivateData(factProviderAddress, 'secret_message', passOwnerPrivateKey, ipfsClient);
```

Reads private data type fact from passport using secret key, generated at the time of writing the fact (read more about private data in [Private data](#private-data)):

```js
reader.getPrivateDataUsingSecretKey(factProviderAddress, 'secret_message', secretKey, ipfsClient);
```

**Reading facts from transaction examples:**

It is possible to read fact values from fact writing transactions. Use `FactHistoryReader` to read facts from transactions:

```js
import sdk from 'reputation-sdk';
const historyReader = new sdk.FactHistoryReader(web3);

historyReader.getString('0x123456789...');
```

Read methods returns `Promise<IFactValue>` object, which contains such information:
```js
{
  factProviderAddress: '0x123456...', // Address of fact provider
  key: 'fact_key', // Fact key
  value: 'fact value' // Fact value
}
```

Read address type fact from transaction:

```js
historyReader.getAddress('0x123456789...');
```

Read boolean type fact from transaction:

```js
historyReader.getBool('0x123456789...');
```

Deletes byte type fact from transaction:

```js
historyReader.getBytes('0x123456789...');
```

Read IPFS hash type fact from transaction:

```js
historyReader.getIPFSData('0x123456789...', IIPFSClient);
```

Read int type fact from transaction:

```js
historyReader.getInt('0x123456789...');
```

Read TX data type fact from transaction:

```js
historyReader.getTxdata('0x123456789...');
```

Read uint type fact from transaction:

```js
historyReader.getUint('0x123456789...');
```

Reads private data type fact from transaction using passport owner's private key (read more about private data in [Private data](#private-data)):

```js
historyReader.getPrivateData('0x123456789...', passOwnerPrivateKey, ipfsClient);
```

Reads private data type fact from transaction using secret key, generated at the time of writing the fact (read more about private data in [Private data](#private-data)):

```js
historyReader.getPrivateDataUsingSecretKey('0x123456789...', secretKey, ipfsClient);
```

### Managing passport permissions

By default any fact provider can write to a passport, but a passport owner can change permissions that allow only
fact providers from the whitelist to write to a passport. To do this, the passport owner must add the authorized fact providers
to the whitelist and then allow to store the facts only to fact providers from the whitelist.

Consider an example of how owner of a passport `<ownerAddress>` adds fact provider
`<factProviderAddress>` to the whitelist in Ropsten network:

```js
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(web3, passportAddress)
Permissions.addFactProviderToWhitelist(factProviderAddress, passportOwnerAddress)
```

Also the passportOwner can delete the factProvider from the list.
Consider an example of how owner of a passport `<ownerAddress>` deletes fact provider
`<factProviderAddress>` to the whitelist in Ropsten network:

```js
import sdk from 'reputation-sdk';
const Permissions = new sdk.Permissions(web3, passportAddress);
Permissions.removeFactProviderFromWhitelist(factProviderAddress, passportOwnerAddress);
```

Please note that the passport owner only can call this method.

After executing the command, any fact provider is still allowed to store the facts in the passport. Let's fix it!

Owner of a passport `<ownerAddress>` may allow to store the facts only to fact providers
from the whitelist by running the command:

```js
import sdk from 'reputation-sdk';
const permissions = new sdk.Permissions(web3, passportAddress);
permissions.setWhitelistOnlyPermission(true, passportOwnerAddress);
```

Checks if factProvider is allowed:

```js
permissions.isAllowedFactProvider(factProviderAddress);
```

Checks if fact provider is whitelisted:

```js
permissions.isFactProviderInWhitelist(factProviderAddress);
```

Checks if whitelist only permission is set:

```js
permissions.isWhitelistOnlyPermissionSet();
```

### Reading facts history

The SDK allows you to see the history of absolutely all changes of facts in the passport.

Let's try to retrieve the entire change history for the passport [`0x1C3A76a9A27470657BcBE7BfB47820457E4DB682`](https://ropsten.etherscan.io/address/0x1C3A76a9A27470657BcBE7BfB47820457E4DB682)
in `Ropsten` block-chain :

```js
import sdk from 'reputation-sdk';
const reader = new sdk.PassportReader(web3, ethereumNetworkUrl);
reader.readPassportHistory(passportAddress);
```

| factProviderAddress | key | blockNumber | transactionHash |
|---------------|-----|--------------|---------|
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 0x4FDCFA | 0xd43201d6b23a18b90a53bf7ef1fffad0b04af603c039b6617601a225a129c632 |
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 0x4FDCFD | 0xf069012520c55d293595654805f3f2b1ff032c1395ddd37cd1366fc1ac67114e |
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | Monetha_WP.pdf | 0x4FDD0A | 0xbc8a86f54a467edbec32fbf27c08e7077221dd69bbea79707889ac6f787fe0ca |

As we can see, there were only three fact updates by the same data provider `0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d`.
The `blockNumber` and `transactionHash` columns allow us to understand in which block and in which transaction the changes were made.
Even if the value of a fact has been deleted or changed, we can read its value as it was before the deletion.

### Private data

Private data is stored in encrypted form in IPFS, only the IPFS hash and hash of data encryption key are saved in the
blockchain.

Reading/writing private data is as simple as reading/writing public data. The only difference is that only the person
who is the passport owner at the time of writing private data can read the
private data. The private data provider can read private data only if it has saved the data encryption key.
The passport owner does not need to know the data encryption key, as he can decrypt all private data using his Ethereum
private key.

#### Writing private data

To store private data, use `FactWriter.setPrivateData` method.

Let's try storing this data:
- fact provider address: `0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E` (your address)
- fact key: `secret_message`
- fact value: `[1, 2, 3]` (value must be array of bytes)

To this passport: `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`

```js
import { FactWriter } from 'reputation-sdk';
import IPFS from 'ipfs';

// Prepare web3 object
...

const writer = new FactWriter(web3, `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`);

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'reputation-sdk'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  const result = await writer.setPrivateData('secret_message', [1, 2, 3], '0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E', ipfsClient);

  ...
})

```

result variable will contain such object (with different values):
```js
{
  // IPFS hash of directory where the encrypted data with it's metadata is stored. This data will be stored in passport after transaction execution
  dataIpfsHash: 'Qmabcde.....',

  // Byte array of secret encryption key, that is able to decrypt the data
  dataKey: [255, 1, 45, ...],

  // Byte array of secret encryption key's hash. This data will be stored in passport after transaction execution
  dataKeyHash: [16, 5, 214, ...],

  // Generated transaction information, which is to be executed in blockchain
  tx: {
    from: '0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E',
    to: '0x4026a67a2C4746b94F168bd4d082708f78d7b29f',
    nonce: 12,
    gasPrice: '0x1',
    gasLimit: 21000,
    value: 0,

    // Encoded transaction data. Ready to be signed and sent to ethereum network
    data: 'c421da14510...',
  }
}
```

As we can see, data is stored publicly in IPFS at address `result.dataIpfsHash`. However it can only be decrypted using passport owner's private key (only known by passport owner) or generated secret encryption key `result.dataKey` (only known by fact provider).

At this stage data is stored to IPFS, but not yet in blockchain passport. To complete this - execute the transaction in blockchain using the data provided in `result.tx`. SDK only generates information about transaction, but execution is left up to SDK consumer, because the ways how transaction can be submitted to blockchain can vary. One possibility is to use `web3.eth.sendTransaction({...})`.

#### Reading private data

After the fact provider has written the private data to the passport, the data can be read either by passport owner or by fact provider (only if he's saved the secret encryption key). To read private data, the following data should be provided:
- passport address
- fact provider address
- fact key
- if the data is read by the fact provider, he needs to specify secret encryption key
- if the data is read by the owner of the passport, he needs to specify his private key

Let's try retrieving private data using:
- passport address `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`:
- fact provider address: `0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E`
- fact key: `secret_message`

```js
import { FactReader } from 'reputation-sdk';
import IPFS from 'ipfs';

// Prepare web3 object
...

const reader = new FactReader(web3, `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`);

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'reputation-sdk'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  // Read data as a PASSPORT OWNER using passport owner Ethereum wallet private key
  const passportOwnerPrivateKey = '<passport owner private key>';
  let result = await reader.getPrivateData('0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E', 'secret_message', passportOwnerPrivateKey, ipfsClient);

  ...

  // Read data as a FACT PROVIDER using secret encryption key (from variable result.dataKey after fact writing)
  const secretEncryptionKey = '0x...';
  result = await reader.getPrivateDataUsingSecretKey('0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E', 'secret_message', secretEncryptionKey, ipfsClient);

  ...
})

```

`result` variable will now contain decrypted value `[1, 2, 3]`.

In order to read hashes which are only stored in blockchain (not data in IPFS), we can use:

```js
result = await reader.getPrivateDataHashes('0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E', 'secret_message');
```

This will return:
```js
{
  // IPFS hash of directory where the encrypted data with it's metadata is stored.
  dataIpfsHash: 'Qmabcde...',

  // Byte array of secret encryption key's hash.
  dataKeyHash: '0x1005d6...',
}
```

##### Reading private data from transaction hash

There is a possibility to read private data from blockchain transaction as well. Using same conditions as in previous example, we can retrieve private data from transaction using `FactHistoryReader` like this:

```js
import { FactHistoryReader } from 'reputation-sdk';
...

const historyReader = new FactHistoryReader(web3, `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`);

...

// This is hash of transaction which stored fact data to blockchain
const txHash = '0x123...';

// Read data as a PASSPORT OWNER using passport owner Ethereum wallet private key
const passportOwnerPrivateKey = '<passport owner private key>';
let result = await historyReader.getPrivateData(txHash, passportOwnerPrivateKey, ipfsClient);

...

// Read data as a FACT PROVIDER using secret encryption key (from variable result.dataKey after fact writing)
const secretEncryptionKey = '0x...';
result = await historyReader.getPrivateDataUsingSecretKey(txHash, secretEncryptionKey, ipfsClient);

...
```

`result` variable will now contain information about fact as well as decrypted value:

```js
{
  factProviderAddress: '0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E',
  passportAddress: '0x4026a67a2C4746b94F168bd4d082708f78d7b29f',
  key: 'secret_message',
  value: [1, 2, 3],
}
```

In order to read hashes which are only stored in blockchain (not data in IPFS), we can use:

```js
result = await historyReader.getPrivateDataHashes(txHash);
```

This will return:
```js
{
  factProviderAddress: '0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E',
  passportAddress: '0x4026a67a2C4746b94F168bd4d082708f78d7b29f',
  key: 'secret_message',
  value: {

    // IPFS hash of directory where the encrypted data with it's metadata is stored.
    dataIpfsHash: 'Qmabcde...',

    // Byte array of secret encryption key's hash.
    dataKeyHash: '0x1005d6...',
  }
}
```

## Private data exchange

Private data exchange engine enables participants to exchange private data via Passports in a secure manner. Anyone can
request private data from the passport of user. This is achieved by running an interactive protocol between the passport
owner and the data requester.

How it works:

1. The data requester initiates retrieval of private data from a passport by calling `PrivateDataExchanger.propose()` method. When executing this
   method, the data requester specifies which fact provider data he wants to read, encrypts exchange key with the passport
   owner's public key and transfers to the passport the funds that he is willing to pay for the private data.

1. The passport owner receives an event from the Ethereum blockchain or directly from the data requester for the data
   exchange proposition. If he is satisfied with the proposal, he executes the `PrivateDataExchanger.accept()` method. When executing this method,
   the passport owner encrypts the data encryption key with the exchange key of data requester and
   transfers the same amount of funds as the data requester to the passport as a guarantee of the validity of the data encryption key.

   The passport owner has 24 hours to accept private data exchange. 24 hours after the exchange proposition, the data
   requester can close the proposition and return staked funds back by calling `PrivateDataExchanger.timeout()` method.

1. The data requester receives an event from the Ethereum blockchain or directly from the passport owner about accepted
   private data exchange. It decrypts the data access key using exchange key and reads private data using `PrivateDataExchanger.getPrivateData()` method.
   After that `PrivateDataExchanger.finish()` method is called, which returns all staked funds to the passport owner.

   During the first 24 hours, the `PrivateDataExchanger.finish()` method can only be called by the data requester, after 24 hours - passport owner can call this method as well.

1. If it is not possible to decrypt the data, the data requester calls the `PrivateDataExchanger.dispute()` method, revealing the exchange key.
   The Ethereum contract code identifies the cheater and transfers all staked funds to the party who behaved honestly.
   The data requester has 24 hours to open a dispute, otherwise the exchange is considered valid and the passport owner
   can get all staked funds.

This is how it looks in the state diagram:

![PlantUML model](http://www.plantuml.com/plantuml/png/jPF1JWCX48RlFCKSTqtRW_7KWwbH4prfZ3VZWSBiGheB28DjtzujbLGQgscgUmAopFzz0ym2SK-nxvZI4W5xHskG68JNZhGrZBsSlS9uV0cFtZeRKC8Kt7POrSnOGl2wLGJMGAVDWWdUTIXXlfw2vCJ1url4GEXPEPqo6CEGli00jyzt3D_HK5hCIHMkXEAcnNkv6gLYJtdp21mFmLbF3qk3lcPe96nW6Ckx4_IL4EWeGVCq_9KvrmMxASoAwM7c7FGNpDVTPvj9zsZZW0oy8VHmVg4c9tUyHGfR1RbHW3aNYvr72Yyjld9covApqKO7TUHjW4f6hqqxM86Qr0nsd_N0pTeQX2g9vr-AipXiyzswRVRYJrIMEhX8MDMGBKuy6wYM2WsKYY0KSa9P7-dwuoNEKNlvEUfVspeitwJExJ-K48N049hOZROavVkO3SFOTny0)

At any time, the `PrivateDataExchanger.getStatus()` method can be used to get detailed information about the private data exchange.

### Proposing private data exchange

To initiate the exchange of private data, the data requester must use `PrivateDataExchanger.propose()` method with these arguments:
- `factKey` - fact key name to request data for
- `factProviderAddress` - fact provider address
- `exchangeStakeWei` - amount in WEI to stake
- `requesterAddress` - data requester address (the one who will submit the transaction)
- `txExecutor` - transaction executor function

Let's try proposing exchanged for private fact using following parameters:
- passport address: `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`,
- fact provider address: `0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E`
- fact key: `secret_message`
- wei to stake: `10000000000000000 wei` (which is equal to `0.01 ETH`).
- requester address: `0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951` (the one who will execute transaction)

```js
import { PrivateDataExchanger } from 'reputation-sdk';
import BN from 'bn.js';
import IPFS from 'ipfs';

// Prepare web3 object
...

const exchanger = new PrivateDataExchanger(web3, `0x4026a67a2C4746b94F168bd4d082708f78d7b29f`);

// txExecutor must be function which takes TransactionConfig object as a parameter (transaction configuration to execute),
// executes it and returns transaction receipt.
const txExecutor = async (txConfig) => {

  // This is a simplified example of implementation
  return web3.eth.sendTransaction(txConfig);
};

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'reputation-sdk'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  const result = await exchanger.propose(
    `secret_message`,
    `0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E`,
    new BN('10000000000000000', 10), // Because of long numbers BN library is used
    `0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951`,
    txExecutor,
  );

  ...
})

```

result variable will contain such object (with different values):
```js
{
  // This is a generated index which will be used to reference this data exchange session
  // in later method
  exchangeIndex: /* A BN object, holding an integer like `1` */,

  // A generated exchanged key, which will be used to decrypt private data after passport owner accepts the exchange
  exchangeKey: [72, 16, 88, ...],

  // Hash of exchange key
  exchangeKeyHash: [172, 44, 16, ...],
}
```

### Getting status of private data exchange

To get detailed information about private data exchange session, use `PrivateDataExchanger.getStatus()` and provide exchange index.

Let's get status for exchange index `1` we proposed in previous section:
```js
...

const status = await exchanger.getStatus(new BN(1));

...
```

status variable will contain such object (with different values):
```js
{
  // IPFS hash of directory where the encrypted data with it's metadata is stored.
  dataIpfsHash: 'Qmabcde...',

  // Encrypted exchange key
  encryptedExchangeKey: [211, 41, 28, ...],

  // Hash of exchange key
  exchangeKeyHash: [172, 44, 16, ...],

  // Hash of secret data encryption key
  dataKeyHash: [111, 42, 89, ...],

  // Encrypted secret data encryption key
  encryptedDataKey: [132, 231, 15, ...],

  // Fact key that was requested
  factKey: 'secret_message',

  // Fact provider address
  factProviderAddress: '0xd8CD4f4640D9Df7ae39aDdF08AE2c6871FcFf77E',

  // Passport owner address
  passportOwnerAddress: '0xD101709569D2dEc41f88d874Badd9c7CF1106AF7',

  // Amount in WEI staked by passport owner. Since exchange was not accepted yet - amount will be 0
  passportOwnerStaked: /* BN object with value 0 */,

  // Private data requester address
  requesterAddress: '0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951',

  // Amount in WEI staked by requester
  requesterStaked: /* BN object with value 10000000000000000 */,

  // Current data exchange state. Can be 0 (Closed), 1 (Proposed), 2 (Accepted)
  // Use `ExchangeState` enum for possible values
  state: 1,

  // Date when exchange expires
  stateExpirationTime: /* Date object with value like 2019-06-25 22:10:15 */,
}
```

### Accepting private data exchange

To accept the private data exchange after proposition, passport owner should execute `PrivateDataExchanger.accept()` method providing the following parameters:
- `exchangeindex` - index of private data exchange to accept
- `passportOwnerPrivateKey` - passport owner's Ethereum wallet private key
- `ipfsClient` - IPFS client
- `txExecutor` - transaction executor function

Let's accept data exchange with index `1` which we proposed previously:
```js
...

await exchanger.accept(new BN(1), '<passport owner private key>', ipfsClient, txExecutor);

...
```

### Reading private data after private data exchange acceptance

After a private data exchange proposition is accepted, the data requester can read the private data by calling `PrivateDataExchanger.getPrivateData()` and providing the following parameters:
- `exchangeindex` - index of private data exchange to read data from
- `exchangeKey` - exchange key, which is generated and known by data requester after proposition
- `ipfsClient` - IPFS client

Let's read private data for exchange inde `1` which was accepted in previous step:
```js
...

const data = await exchanger.getPrivateData(new BN(1), [72, 16, 88, ...], ipfsClient);

...
```

`data` will contain byte array of decrypted private data.

### Closing private data exchange proposition when timed out

If the passport owner ignored the request for the private data exchange, then after 24 hours, the data requester may close the request and return the staked funds by calling `PrivateDataExchanger.timeout()` method.

Here is how data requester can close the private data exchange with index `1`:

```js
...

await exchanger.timeout(new BN(1), txExecutor);

...
```

### Closing private data exchange after acceptance

After the data requester successfully read the private data, he can confirm this by invoking the `PrivateDataExchanger.finish()` method.
When executing this method, the funds staked by the data requester and passport owner will be transferred to the passport owner.
If the data requester does not send the finalization request withing a predefined timespan (24 hours), the passport owner is allowed to finalize private data exchange, preventing the escrow being locked-up indefinitely.

Here is how data requester or passport owner can finish the private data exchange with index `1`:

```js
...

// For data requester
await exchanger.finish(new BN(1), `0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951`, txExecutor);

// OR for passport owner after 24h
await exchanger.finish(new BN(1), `0xD101709569D2dEc41f88d874Badd9c7CF1106AF7`, txExecutor);

...
```

### Opening dispute after private data exchange acceptance

If it is not possible to decrypt the data, the data requester calls the `PrivateDataExchanger.dispute()` command within 24 hours after acceptance,
revealing the exchange key. The logic of the passport is the arbitrator who determines who the cheater is.
This is possible due to the fact that in the passport the hashes of both the data encryption key and the exchange key are saved, and the data encryption key is XORed with the exchange key during the private data exchange acceptance by the passport owner.

When resolving a dispute, all staked funds are transferred to the side that behaved honestly.

`dispute` methods takes these parameters:
- `exchangeindex` - index of private data exchange to dispute
- `exchangeKey` - exchange key, which is generated and known by data requester after proposition
- `txExecutor` - transaction executor

Let's simulate a situation where data requester raises a dispute where he pretends that he is not able to decrypt the data. Let's assume that exchange is accepted as in [Accepting private data exchange](#accepting-private-data-exchange). From there if data requester calls `dispute` method using:

```js
...

const disputeResult = await exchanger.dispute(new BN(1), [72, 16, 88, ...], txExecutor);

...
```

`disputeResult` will contain such information:
```js
{
  // Status indicated whether requester succeeded disputing. If result is false then
  // it means data requester has cheated and all staked funds is transferred to passport owner (and vice-versa)
  success: false,

  // Address of side who cheated (passport owner or data requester)
  cheaterAddress: '0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951',
}
```

As we can see data requester has been decided as as cheater and all staked funds were transferred to passport owner.

Using this SDK it is not possible to cheat as a passport owner. However, this possibility still remains in case fraudulent passport owner would call passport contract methods directly by providing incorrectly encrypted data.

## Permissioned blockchains support

### Quorum

[Quorum](https://www.jpmorgan.com/global/Quorum)™ is an enterprise-focused version of [Ethereum](https://ethereum.org/).
It's ideal for any application requiring high speed and high throughput processing of private transactions within a
permissioned group of known participants.

In order to play with our SDK on Quorum network, you need to run Quorum network somewhere. The easiest way to run Quorum
network of 7 nodes locally is by using [example](https://docs.goquorum.com/en/latest/Getting%20Started/Quorum-Examples/) provided by Quorum.

When nodes are up and running, you must deploy  `PassportLogic`, `PassportLogicRegistry` and `PassportFactory` smart contracts. You will find latest versions of those contracts in our contracts Github [repository](https://github.com/monetha/reputation-contracts/tree/master/contracts).