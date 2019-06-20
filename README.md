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
| `PassportLogic` | [`0x74C22a5d68E4727029FD906aD73D5F39D9130905`](https://ropsten.etherscan.io/address/0x74C22a5d68E4727029FD906aD73D5F39D9130905) |
| `PassportLogicRegistry`  | [`0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c`](https://ropsten.etherscan.io/address/0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c) |
| `PassportFactory` | [`0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2`](https://ropsten.etherscan.io/address/0x35Cb95Db8E6d56D1CF8D5877EB13e9EE74e457F2) |

The contract addresses deployed on Mainnet:

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0x12b0d242283ce61bEb463b16D485df64A4E3932f`](https://etherscan.io/address/0x12b0d242283ce61bEb463b16D485df64A4E3932f) |
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
  // IPFS hash of directory where the encrypted data with it's metadata is store. This data will be stored in passport after transaction execution
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
  // IPFS hash of directory where the encrypted data with it's metadata is store.
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

    // IPFS hash of directory where the encrypted data with it's metadata is store.
    dataIpfsHash: 'Qmabcde...',

    // Byte array of secret encryption key's hash.
    dataKeyHash: '0x1005d6...',
  }
}
```

## Permissioned blockchains support

### Quorum

[Quorum](https://www.jpmorgan.com/global/Quorum)™ is an enterprise-focused version of [Ethereum](https://ethereum.org/).
It's ideal for any application requiring high speed and high throughput processing of private transactions within a
permissioned group of known participants.

In order to play with our SDK on Quorum network, you need to run Quorum network somewhere. The easiest way to run Quorum
network of 7 nodes locally is by running a preconfigured Vagrant environment. Follow the
instructions below to do this:

1. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

1. Install [Vagrant](https://www.vagrantup.com/downloads.html)

1. Download and start the Vagrant instance (note: running `vagrant up` takes approx 5 mins):
   ```
   $ git clone https://github.com/jpmorganchase/quorum-examples
   $ cd quorum-examples
   $ vagrant up
   $ vagrant ssh
   ```
   After executing these commands, you will be inside a virtual machine with all the tools to start the Quorum network.

   ***NOTE***: To shutdown the Vagrant instance later, run `vagrant suspend`. To delete it, run `vagrant destroy`.
   To start from scratch, run `vagrant up` after destroying the instance. (you should run all `vagrant` commands from
   the host machine, not from the virtual machine)

1. Once inside the virtual machine, run the blockchain nodes using Raft consensus:
   ```
   $ cd quorum-examples/7nodes/
   $ ./raft-init.sh
   $ ./raft-start.sh
   ```
   Make sure 7 processes of `geth` are up and running by executing `ps aux | grep geth` command.

   Genesis block contains 5 addresses, each of which has 1000000000 ETH:

   | Address                                    | Private key                                                      |
   |--------------------------------------------|------------------------------------------------------------------|
   | 0xed9d02e382b34818e88B88a309c7fe71E65f419d | e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1 |
   | 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e | 4762e04d10832808a0aebdaa79c12de54afbe006bfffd228b3abcc494fe986f9 |
   | 0x0fBDc686b912d7722dc86510934589E0AAf3b55A | 61dced5af778942996880120b303fc11ee28cc8e5036d2fdff619b5675ded3f0 |
   | 0x9186eb3d20Cbd1F5f992a950d808C4495153ABd5 | 794392ba288a24092030badaadfee71e3fa55ccef1d70c708baf55c07ed538a8 |
   | 0x0638E1574728b6D862dd5d3A3E0942c3be47D996 | 30bee17b2b8b1e774115f785e92474027d45d900a12a9d5d99af637c2d1a61bd |

1. When all nodes are up and running it's safe to exit from virtual machine and start reputation layer bootstrap. Run `exit`, to leave Vagrant environment:

   ```
   $ exit
   ```

   Now you're on the host machine.
   Vagrant environment exposes ports 22000-22007, on which Ethereum JSON RPC is available.
   You can check it's working by running command:

   ```
   $ curl -H "Content-Type: application/json" \
     -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     http://localhost:22000
   ```

   You should see the output:

   ```
   {"jsonrpc":"2.0","id":1,"result":"0x0"}
   ```

1. Now follow [Building the source](https://github.com/monetha/reputation-go-sdk#building-the-source) steps to build the
   full suite of reputation SDK utilities, if you haven't done it yet. When you've built utilities, you'll need to use
   `deploy-bootstrap` tool to deploy all auxiliary reputation layer contracts to local Quorum network. Please read
   [Bootstrap reputation layer](https://github.com/monetha/reputation-go-sdk#bootstrap-reputation-layer) section and
   [`deploy-bootstrap` README](https://github.com/monetha/reputation-go-sdk/tree/master/cmd/deploy-bootstrap) for details
   on how to deploy contracts. When you deploy contracts using `deploy-bootstrap` utility use private keys from the
   table above and specify one of the Quorum node (like `http://localhost:22000`) as `-backendurl` parameter to make
   transactions.

   Assuming the current directory contains `deploy-bootstrap` utility, here is an example of how you can deploy contracts:
   ```
   $ echo e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1 > bootstrap_owner.key
   $ ./deploy-bootstrap -ownerkey ./bootstrap_owner.key -backendurl http://localhost:22000
   ```

   In the output you should see something like this:
   ```
    WARN [01-25|12:09:32.889] Loaded configuration                     owner_address=0xed9d02e382b34818e88B88a309c7fe71E65f419d backend_url=http://localhost:22000
    WARN [01-25|12:09:32.897] Getting balance                          address=0xed9d02e382b34818e88B88a309c7fe71E65f419d
    WARN [01-25|12:09:32.898] Deploying PassportLogic                  owner_address=0xed9d02e382b34818e88B88a309c7fe71E65f419d
    WARN [01-25|12:09:32.914] Waiting for transaction                  hash=0x6851cf9a96ac4802471bc394010f8a13c732a70a692544da36d0f6e753d63376
    WARN [01-25|12:09:36.920] Transaction successfully mined           tx_hash=0x6851cf9a96ac4802471bc394010f8a13c732a70a692544da36d0f6e753d63376 cumulative_gas_used=1673566
    WARN [01-25|12:09:36.920] PassportLogic deployed                   contract_address=0x1932c48b2bF8102Ba33B4A6B545C32236e342f34
    WARN [01-25|12:09:36.920] Deploying PassportLogicRegistry          owner_address=0xed9d02e382b34818e88B88a309c7fe71E65f419d impl_version=0.1 impl_address=0x1932c48b2bF8102Ba33B4A6B545C32236e342f34
    WARN [01-25|12:09:36.935] Waiting for transaction                  hash=0x07a528bef978bb0ebfe91c6fdf06ccaa264e213784070e18a92180d8cacb10aa
    WARN [01-25|12:09:40.940] Transaction successfully mined           tx_hash=0x07a528bef978bb0ebfe91c6fdf06ccaa264e213784070e18a92180d8cacb10aa cumulative_gas_used=1083763
    WARN [01-25|12:09:40.940] PassportLogicRegistry deployed           contract_address=0x1349F3e1B8D71eFfb47B840594Ff27dA7E603d17
    WARN [01-25|12:09:40.940] Deploying PassportFactory                owner_address=0xed9d02e382b34818e88B88a309c7fe71E65f419d registry=0x1349F3e1B8D71eFfb47B840594Ff27dA7E603d17
    WARN [01-25|12:09:40.952] Waiting for transaction                  hash=0x3ca26d53ad056b4340adab4507b6374345c7a45241a80da09d82206081639a02
    WARN [01-25|12:09:44.959] Transaction successfully mined           tx_hash=0x3ca26d53ad056b4340adab4507b6374345c7a45241a80da09d82206081639a02 cumulative_gas_used=1074733
    WARN [01-25|12:09:44.959] PassportFactory deployed                 contract_address=0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab
    WARN [01-25|12:09:44.959] Done.
   ```
   In the penultimate line you can see `PassportFactory` contract address (address may be different in your case):
   `0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab`.

   Use this address as `passportFactoryAddress` parameter value and `http://localhost:22000` as `ethereumNetworkUrl`
   parameter value to deploy your passport contract.
