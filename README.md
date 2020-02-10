# verifiable-data

SDK for managing verifiable data of digital identities on Harmony blockchain.

Corresponds to [Verifiable data layer](https://github.com/monetha/reputation-layer) of [Monetha Platform](https://github.com/monetha/decentralized-reputation-framework)

<!-- [![Build Status][1]][2]

[1]: https://travis-ci.org/monetha/js-verifiable-data.svg?branch=master
[2]: https://travis-ci.org/monetha/js-verifiable-data -->

*NOTE*: Terms "Digital identity" and "Passport" has the same meaning and will be used interchangeably in this guide.

- [Verifiable data](#Verifiable-data)
  - [Building the source](#Building-the-source)
    - [Prerequisites](#Prerequisites)
    - [Build](#Build)
  - [Bootstrap](#Bootstrap)
  - [Usage](#Usage)
    - [Deploying digital identity](#Deploying-digital-identity)
    - [Digital identity ownership](#Digital-identity-ownership)
    - [Digital identities list](#Digital-identities-list)
    - [Writing facts](#Writing-facts)
    - [Reading facts](#Reading-facts)
    - [Reading facts from transactions](#Reading-facts-from-transactions)
    - [Deleting facts](#Deleting-facts)
    - [Managing digital identity permissions](#Managing-digital-identity-permissions)
    - [Reading facts history](#Reading-facts-history)
    - [Private data](#Private-data)
      - [Writing private data](#Writing-private-data)
      - [Reading private data](#Reading-private-data)
      - [Reading private data from transaction hash](#Reading-private-data-from-transaction-hash)
  - [Private data exchange](#Private-data-exchange)
    - [Proposing private data exchange](#Proposing-private-data-exchange)
    - [Getting status of private data exchange](#Getting-status-of-private-data-exchange)
    - [Accepting private data exchange](#Accepting-private-data-exchange)
    - [Reading private data after private data exchange acceptance](#Reading-private-data-after-private-data-exchange-acceptance)
    - [Closing private data exchange proposition when timed out](#Closing-private-data-exchange-proposition-when-timed-out)
    - [Closing private data exchange after acceptance](#Closing-private-data-exchange-after-acceptance)
    - [Opening dispute after private data exchange acceptance](#Opening-dispute-after-private-data-exchange-acceptance)
  - [Data source registry](#Data-source-registry)
    - [Setting data source information](#Setting-data-source-information)
    - [Deleting data source information](#Deleting-data-source-information)
    - [Reading data source information](#Reading-data-source-information)

## Building the source

### Prerequisites

* Node.js >= 8.9.*
* npm >= 5.*

### Build

The build process is set to be automatic you just need to install the package using:

`npm install --save verifiable-data`

or

`yarn add verifiable-data`

## Bootstrap

To bootstrap verifiable-data, we need to deploy three contracts:
1. `PassportLogic` - specifies upgradable behaviour of digital identities
1. `PassportLogicRegistry` - responsible for telling digital identities, which behaviour version to use
1. `PassportFactory` - responsible for digital identity creation

Monetha has already deployed this set of contracts on Harmony testnet network.

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0xe7f2E7fbB50C9Ec823c02e14CDaF70B639Faa996`](https://explorer.testnet.harmony.one/#/address/0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE) |
| `PassportLogicRegistry`  | [`0xb4c31c9F4d3adfb89a2855f71A73e6a1AB3F3cbe`](https://explorer.testnet.harmony.one/#/address/0xb4c31c9F4d3adfb89a2855f71A73e6a1AB3F3cbe) |
| `PassportFactory` | [`0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE`](https://explorer.testnet.harmony.one/#/address/0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE) |


Consider the process of deploying your own set of these contracts to experiment with our implementation. If you are going to deploy your contracts, then you will have to support them yourself.

This means that if logic of the digital identity is updated by Monetha developers, you'll need to deploy a new `PassportLogic` contract, register it
in an existing `PassportLogicRegistry` contract (by calling `addPassportLogic` method) and finally make it active (by calling `setCurrentPassportLogic`).

If you use a set of Monetha deployed contracts, then digital identity logic is always up-to-date with latest fixes and features.

Prepare in advance the address that will be the owner of the deployed contracts. Make sure that it has enough funds to deploy contracts.

## Usage

In order to create a digital identity and start using it, you need to use auxiliary verifiable data layer contracts: `PassportLogic`, `PassportLogicRegistry`, `PassportFactory`.

### Deploying digital identity

To create a digital identity contract you need to know the address of the `PassportFactory` contract. Let's try to create a digital identity in Harmony Testnet
using the `PassportFactory` contract deployed by Monetha ([`0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE`](https://explorer.testnet.harmony.one/#/address/0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE)):

```js
import { PassportGenerator } from 'verifiable-data';
const generator = new PassportGenerator(harmony, passportFactoryAddress);

// method must be signed by `passportOwnerAddress` when sending it to network
const method = await generator.createPassport(passportOwnerAddress);
```

You will get the transaction send method `method` in output of the function, which have to be called by using `.send()`. SDK intentionally does not execute `send()` itself because client may want to execute it in a specific way, listen for specific events.

Receipt will contain created digital identity address, which can be easily extracted using a helper utility:

```js
const passportAddress = PassportGenerator.getPassportAddressFromReceipt(receipt);
```

### Digital identity ownership

After the digital identity is created, the owner must call the `claimOwnership` method to become a full owner:

```js
import { PassportOwnership } from 'verifiable-data';
const ownership = new PassportOwnership(harmony, passportAddress);

const method = await ownership.claimOwnership(passportOwnerAddress);
```

To return digital identity owner address call getOwnerAddress():

```js
const passportOwnerAddress = await ownership.getOwnerAddress();
```

### Digital identities list

The digital identity factory allows you to get a list of all digital identities that have been created using this particular identity factory.

Let's try to get a list of all digital identities using the address of `PassportFactory` contract deployed by Monetha ([`0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE`](https://explorer.testnet.harmony.one/#/address/0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE))
in Harmony Testnet network:

```js
import { PassportReader } from 'verifiable-data';
const reader = new PassportReader(harmony);

const passports = await reader.getPassportsList('0xEEB7238dBF55d861986205c83130Ba1d0d4E3ADE');
```

You should get something like this Array of objects:

```js
[
  {
    passportAddress: '0x1C3A76a9A27470657BcBE7BfB47820457E4DB682',
    ownerAddress: '0xDdD9b3Ea9d65cfD12b18ceA4E6f7Df4948ec4C55',
    blockNumber: '5233845',
    blockHash: '0x33e7d5dc34f5e8597859c319c34ef4f613238defbadcc2fda3ae65f508b45884',
    transactionHash: '0x...',
    ...
  },
  ...
]
```

The block number and transaction hash indicate the transaction in which the digital identity was created.

All digital identities use the same `PassportLogic` contract. Once a new logic is added to the logic registry and is
activated, it will be immediately used by all digital identities created by this factory.

### Writing facts

After the digital identity is created, any data source can start writing data to it.

Make sure that the data source has enough funds to write the facts.

**Gas usage**

You can write up to 100KB of data in digital identity under one key when `txdata` data type is used. Supported data types that
can be written to the digital identity: `string`, `bytes`, `address`, `uint`, `int`, `bool`, `txdata`, `ipfshash`. All types except `txdata`
use Ethereum storage to store the data. `txdata` uses Ethereum storage only to save the block number, the data itself
remains in the transaction input data and can be read later using the SDK. Therefore, if you need to save a large amount
of data, it is better to use `txdata` type of data. The disadvantage of the `txdata` type of data is the data can only be read
using the SDK, within the contracts this data is not available.

Data sources (aka fact providers) are ethereum accounts, which write some facts to digital identities. For example data source "Monetha"
writes user rating facts to their digital identities when users make deals in [Monetha's app](https://www.monetha.io/get).

Let's try to store string `hello` under the key `greetings` as `string` in digital identity:

```js
import { FactWriter } from 'verifiable-data';
const writer = new FactWriter(harmony, passportAddress);

const method = await writer.setString('greetings', 'hello', factProviderAddress);
```

**Writing facts examples:**

Writes address type fact to digital identity:

```js
const method = await writer.setAddress('address_1', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', factProviderAddress);
```

Writes boolean type fact to digital identity:

```js
const method = await writer.setBool('barcelona_won_uefa', false, factProviderAddress);
```

Writes bytes type fact to digital identity:

```js
const method = await writer.setBytes('bytes_data', [1, 2, 3], factProviderAddress);
```

Writes IPFS hash data type fact to digital identity:

```js
const method = await writer.setIPFSData('logo', 'QmaSjk86XyXQzeZ5JCVS2scNYiUBsmALyGBUjatEiQuc3q', factProviderAddress, ipfsClient);
```

Writes int type fact to digital identity:

```js
const method = await writer.setInt('lt_population', 2848000, factProviderAddress);
```

Writes TX data type fact to digital identity:

```js
const method = await writer.setTxdata('tx_1', [1, 2, 3], factProviderAddress);
```

Writes uint type fact to digital identity:

```js
const method = await writer.setUint('jonas_rating', 4294100000, factProviderAddress);
```

Writes private data type fact to digital identity (read more about private data in [Private data](#private-data)):

```js
const method = await writer.setPrivateData('secret_message', [1, 2, 3], factProviderAddress, ipfsClient);
```

### Reading facts

After the data source has written the public data to the digital identity, the data can be read by anyone.
To read the data you need to know:
- the address of the digital identity
- the address of the data source who stored the data
- the key under which the data was stored
- the type of data

Let's try to retrieve string from digital identity `<passportAddress>` that was stored by the data source `<factProviderAddress>` under the key `greetings` as `string` data type:

```js
import { FactReader } from 'verifiable-data';
const reader = new FactReader(harmony, passportAddress);

const data = await reader.getString(factProviderAddress, 'greetings');
```

**Reading facts examples:**

Read address type fact from digital identity:

```js
const data = await reader.getAddress(factProviderAddress, 'address_1');
```

Read boolean type fact from digital identity:

```js
const data = await reader.getBool(factProviderAddress, 'barcelona_won_uefa');
```

Deletes byte type fact from digital identity:

```js
const data = await reader.getBytes(factProviderAddress, 'bytes_data');
```

Read IPFS hash type fact from digital identity:

```js
const data = await reader.getIPFSData(factProviderAddress, 'logo', ipfsClient);
```

Read int type fact from digital identity:

```js
const data = await reader.getInt(factProviderAddress, 'lt_population');
```

Read TX data type fact from digital identity:

```js
const data = await reader.getTxdata(factProviderAddress, 'tx_1');
```

Read uint type fact from digital identity:

```js
const data = await reader.getUint(factProviderAddress, 'jonas_rating');
```

Reads private data type fact from digital identity using digital identity owner's private key (read more about private data in [Private data](#private-data)):

```js
const data = await reader.getPrivateData(factProviderAddress, 'secret_message', passOwnerPrivateKey, ipfsClient);
```

Reads private data type fact from digital identity using secret key, generated at the time of writing the fact (read more about private data in [Private data](#private-data)):

```js
const data = await reader.getPrivateDataUsingSecretKey(factProviderAddress, 'secret_message', secretKey, ipfsClient);
```

### Reading facts from transactions

It is possible to read fact values from fact writing transactions. Use `FactHistoryReader` to read facts from transactions.

Let's read a string fact from transaction hash `0x123456789...`:

```js
import { FactHistoryReader } from 'verifiable-data';
const historyReader = new FactHistoryReader(harmony);

const factInfo = await historyReader.getString('0x123456789...');
```

Returned object contains such data:

```js
{
  factProviderAddress: '0x123456...', // Address of data source
  passportAddress: '0x321654...',  // Address of digital identity that fact was written to
  key: 'greetings', // Fact key
  value: 'hello' // Fact value
}
```

**Reading facts from transaction examples:**

Read address type fact from transaction:

```js
const factInfo = await historyReader.getAddress('0x123456789...');
```

Read boolean type fact from transaction:

```js
const factInfo = await historyReader.getBool('0x123456789...');
```

Deletes byte type fact from transaction:

```js
const factInfo = await historyReader.getBytes('0x123456789...');
```

Read IPFS hash type fact from transaction:

```js
const factInfo = await historyReader.getIPFSData('0x123456789...', IIPFSClient);
```

Read int type fact from transaction:

```js
const factInfo = await historyReader.getInt('0x123456789...');
```

Read TX data type fact from transaction:

```js
const factInfo = await historyReader.getTxdata('0x123456789...');
```

Read uint type fact from transaction:

```js
const factInfo = await historyReader.getUint('0x123456789...');
```

Reads private data type fact from transaction using digital identity owner's private key (read more about private data in [Private data](#private-data)):

```js
const factInfo = await historyReader.getPrivateData('0x123456789...', passOwnerPrivateKey, ipfsClient);
```

Reads private data type fact from transaction using secret key, generated at the time of writing the fact (read more about private data in [Private data](#private-data)):

```js
const factInfo = await historyReader.getPrivateDataUsingSecretKey('0x123456789...', secretKey, ipfsClient);
```

### Deleting facts

User can delete the data stored from the digital identity. Deleting a fact will result in `null` when you try to read it after deletion, however, fact itself is not really deleted from blockchain, since it is an immutable storage.

Let's try to delete fact under the key `greetings` as `string` from digital identity:

```js
import { FactRemover } from 'verifiable-data';
const remover = new FactRemover(harmony, passportAddress);

const method = await remover.deleteString('greetings', factProviderAddress);
```

**Deleting facts examples:**

Deletes address type fact from digital identity:

```js
const method = await remover.deleteAddress(factProviderAddress, 'address_1');
```

Deletes bool type fact from digital identity:

```js
const method = await remover.deleteBool(factProviderAddress, 'barcelona_won_uefa');
```

Deletes byte type fact from digital identity:

```js
const method = await remover.deleteBytes(factProviderAddress, 'bytes_data');
```

Deletes IPFS hash type fact from digital identity:

```js
const method = await remover.deleteIPFSHash(factProviderAddress, 'logo', IIPFSClient);
```

Deletes int type fact from digital identity:

```js
const method = await remover.deleteInt(factProviderAddress, 'lt_population');
```

Deletes txdata type fact from digital identity:

```js
const method = await remover.deleteTxdata(factProviderAddress, 'tx_1');
```

Deletes uint type fact from digital identity:

```js
const method = await remover.deleteUint(factProviderAddress, 'jonas_rating');
```

Deletes private data type fact from digital identity (read more about private data in [Private data](#private-data)):

```js
const method = await remover.deletePrivateDataHashes('secret_message', factProviderAddress);
```

### Managing digital identity permissions

By default any data source can write to a digital identity, but digital identity's owner can change permissions that allow only data sources from the whitelist to write to a digital identity. To do this, the owner must enable fact writing only for whitelisted data sources and add authorized data sources to the whitelist.

*NOTE*: Permissions can only be manipulated by digital identity owner.

Consider an example of how owner `<passportOwnerAddress>` of a digital identity `<passportAddress>` enables whitelist-only permissions and adds data source `<factProviderAddress>` to the whitelist.

```js
import { Permissions } from 'verifiable-data';
const permissions = new Permissions(harmony, passportAddress);

let method = await permissions.setWhitelistOnlyPermission(true, passportOwnerAddress);

// Sign and submit method
// ...

method = await permissions.addFactProviderToWhitelist(factProviderAddress, passportOwnerAddress);
```

Also the digital identity owner can delete the data source from the list:

```js
const method = await permissions.removeFactProviderFromWhitelist(factProviderAddress, passportOwnerAddress);
```

Checks if factProvider is allowed:

```js
const isAllowed = await permissions.isAllowedFactProvider(factProviderAddress);
```

Checks if fact provider is whitelisted:

```js
const isWhitelisted = await permissions.isFactProviderInWhitelist(factProviderAddress);
```

Checks if whitelist only permission is set:

```js
const isWhitelistEnabled = await permissions.isWhitelistOnlyPermissionSet();
```

### Reading facts history

The SDK allows you to see the history of absolutely all changes of facts in the digital identity.

Let's try to retrieve the entire change history for the digital identity [`0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`](https://explorer.testnet.harmony.one/#/address/0x1fba90b6cfec428e23143d5f2b94548d8200c5ef)
in Harmony Testnet network :

```js
import { PassportReader } from 'verifiable-data';
const reader = new PassportReader(harmony);
const history = await reader.readPassportHistory(passportAddress);
```

`history` will contain a list of audit trace:

```js
[
  {
    eventType: 'Updated', // 'Updated' or 'Deleted'
    dataType: 'IPFSHash', // Fact type - 'String', 'Bool', ...
    factProviderAddress: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98', // Data source address

    // TX hash where change has occurred. Can be used with `FactHistoryReader` to read fact value
    transactionHash: '0x123456...',
    blockNumber: ‭5233914‬, // Block nr where change has occurred
    key: 'monetha.jpg', // Fact key
  },
  ...
]
```

Even if the value of a fact has been deleted or changed, we can read its value of previous versions prior the deletion.

### Private data

Private data is stored in encrypted form in IPFS, only the IPFS hash and hash of data encryption key are saved in the blockchain.

Reading/writing private data is as simple as reading/writing public data. The differences are:

- Only digital identity owner can read the private data
- The private data source can read private data only if it saved the data encryption key
- The digital identity owner does not need to know the data encryption key, as he can decrypt all private data using his Ethereum private key

#### Writing private data

To store private data, use `FactWriter.setPrivateData` method.

Let's try storing this data:

- data source address: `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98` (your address)
- fact key: `secret_message`
- fact value: `[1, 2, 3]` (value must be array of bytes)

To this digital identity: `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98`

```js
import { FactWriter } from 'verifiable-data';
import IPFS from 'ipfs';

...

const writer = new FactWriter(harmony, `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`);

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'verifiable-data'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  const result = await writer.setPrivateData('secret_message', [1, 2, 3], '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98', ipfsClient);

  ...
})

```

result variable will contain such object (with different values):

```js
{
  // IPFS hash of directory where the encrypted data with it's metadata is stored. This data will be stored in digital identity after transaction execution
  dataIpfsHash: 'Qmabcde.....',

  // Byte array of secret encryption key, that is able to decrypt the data
  dataKey: [255, 1, 45, ...],

  // Byte array of secret encryption key's hash. This data will be stored in digital identity after transaction execution
  dataKeyHash: [16, 5, 214, ...],

  // Generated transaction information, which is to be executed in blockchain
  tx: {
    from: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98',
    to: '0x1fba90b6cfec428e23143d5f2b94548d8200c5ef',
    nonce: 12,
    gasPrice: '0x1',
    gasLimit: 21000,
    value: 0,

    // Encoded transaction data. Ready to be signed and sent to ethereum network
    data: 'c421da14510...',
  }
}
```

As we can see, data is stored publicly in IPFS at address `result.dataIpfsHash`. However, it can only be decrypted using digital identity owner's private key (only known by digital identity owner) or generated secret encryption key `result.dataKey` (only known by data source).

At this stage data is stored to IPFS, but not yet in blockchain digital identity. To complete this - execute the transaction in blockchain using the transaction config provided in `result.tx`, which provides properties `method` - a method to call `send()` on and `txConfig` - mandatory parameters to provide to `send(txConfig)`. SDK only generates information about transaction, but execution is left up to SDK consumer, because the ways how transaction can be submitted to blockchain can vary.

#### Reading private data

After the data source has written the private data to the digital identity, the data can be read either by digital identity owner or by data source (only if he's saved the secret encryption key). To read private data, the following data should be provided:

- digital identity address
- data source address
- fact key
- if the data is read by the data source, he needs to specify secret encryption key
- if the data is read by the owner of the digital identity, he needs to specify his private key

Let's try retrieving private data using:
- digital identity `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`:
- data source address: `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98`
- fact key: `secret_message`

```js
import { FactReader } from 'verifiable-data';
import IPFS from 'ipfs';

...

const reader = new FactReader(harmony, `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`);

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'verifiable-data'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  // Read data as a DIGITAL IDENTITY OWNER using owner's Ethereum wallet private key
  const passportOwnerPrivateKey = '<digital identity owner private key>';
  let result = await reader.getPrivateData('0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98', 'secret_message', passportOwnerPrivateKey, ipfsClient);

  ...

  // Read data as a DATA SOURCE using secret encryption key (from variable result.dataKey after fact writing)
  const secretEncryptionKey = '0x...';
  result = await reader.getPrivateDataUsingSecretKey('0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98', 'secret_message', secretEncryptionKey, ipfsClient);

  ...
})

```

`result` variable will now contain decrypted value `[1, 2, 3]`.

In order to read hashes which are only stored in blockchain (not data in IPFS), we can use:

```js
result = await reader.getPrivateDataHashes('0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98', 'secret_message');
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

#### Reading private data from transaction hash

There is a possibility to read private data from blockchain transaction as well. Using same conditions as in previous example, we can retrieve private data from transaction using `FactHistoryReader` like this:

```js
import { FactHistoryReader } from 'verifiable-data';
...

const historyReader = new FactHistoryReader(harmony, `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`);

...

// This is hash of transaction which stored fact data to blockchain
const txHash = '0x123...';

// Read data as a DIGITAL IDENTITY OWNER using owner's Ethereum wallet private key
const passportOwnerPrivateKey = '<digital identity owner private key>';
let result = await historyReader.getPrivateData(txHash, passportOwnerPrivateKey, ipfsClient);

...

// Read data as a DATA SOURCE using secret encryption key (from variable result.dataKey after fact writing)
const secretEncryptionKey = '0x...';
result = await historyReader.getPrivateDataUsingSecretKey(txHash, secretEncryptionKey, ipfsClient);

...
```

`result` variable will now contain information about fact as well as decrypted value:

```js
{
  factProviderAddress: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98',
  passportAddress: '0x1fba90b6cfec428e23143d5f2b94548d8200c5ef',
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
  factProviderAddress: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98',
  passportAddress: '0x1fba90b6cfec428e23143d5f2b94548d8200c5ef',
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

Private data exchange engine enables participants to exchange private data via digital identities in a secure manner. Anyone can
request private data from the digital identity of user. This is achieved by running an interactive protocol between the digital identity
owner and the data requester.

How it works:

1. The data requester initiates retrieval of private data from a digital identity by calling `PrivateDataExchanger.propose()` method. When executing this
   method, the data requester specifies which data source data he wants to read, encrypts exchange key with the digital identity
   owner's public key and transfers to the digital identity the funds that he is willing to pay for the private data.

2. The digital identity owner receives an event from the Ethereum blockchain or directly from the data requester for the data
   exchange proposition. If he is satisfied with the proposal, he executes the `PrivateDataExchanger.accept()` method. When executing this method,
   the digital identity owner encrypts the data encryption key with the exchange key of data requester and
   transfers the same amount of funds as the data requester to the digital identity as a guarantee of the validity of the data encryption key.

   The digital identity owner has 24 hours to accept private data exchange. 24 hours after the exchange proposition, the data
   requester can close the proposition and return staked funds back by calling `PrivateDataExchanger.timeout()` method.

3. The data requester receives an event from the Ethereum blockchain or directly from the digital identity owner about accepted
   private data exchange. It decrypts the data access key using exchange key and reads private data using `PrivateDataExchanger.getPrivateData()` method.
   After that `PrivateDataExchanger.finish()` method is called, which returns all staked funds to the digital identity owner.

   During the first 24 hours, the `PrivateDataExchanger.finish()` method can only be called by the data requester, after 24 hours - digital identity owner can call this method as well.

4. If it is not possible to decrypt the data, the data requester calls the `PrivateDataExchanger.dispute()` method, revealing the exchange key.
   The Ethereum contract code identifies the cheater and transfers all staked funds to the party who behaved honestly.
   The data requester has 24 hours to open a dispute, otherwise the exchange is considered valid and the digital identity owner
   can get all staked funds.

This is how it looks in the state diagram:

![PlantUML model](http://www.plantuml.com/plantuml/png/jPF1JWCX48RlFCKSTqtRW_7KWwbH4prfZ3VZWSBiGheB28DjtzujbLGQgscgUmAopFzz0ym2SK-nxvZI4W5xHskG68JNZhGrZBsSlS9uV0cFtZeRKC8Kt7POrSnOGl2wLGJMGAVDWWdUTIXXlfw2vCJ1url4GEXPEPqo6CEGli00jyzt3D_HK5hCIHMkXEAcnNkv6gLYJtdp21mFmLbF3qk3lcPe96nW6Ckx4_IL4EWeGVCq_9KvrmMxASoAwM7c7FGNpDVTPvj9zsZZW0oy8VHmVg4c9tUyHGfR1RbHW3aNYvr72Yyjld9covApqKO7TUHjW4f6hqqxM86Qr0nsd_N0pTeQX2g9vr-AipXiyzswRVRYJrIMEhX8MDMGBKuy6wYM2WsKYY0KSa9P7-dwuoNEKNlvEUfVspeitwJExJ-K48N049hOZROavVkO3SFOTny0)

At any time, the `PrivateDataExchanger.getStatus()` method can be used to get detailed information about the private data exchange.

### Proposing private data exchange

To initiate the exchange of private data, the data requester must use `PrivateDataExchanger.propose()` method with these arguments:
- `factKey` - fact key name to request data for
- `factProviderAddress` - data source address
- `exchangeStakeWei` - amount in WEI to stake
- `requesterAddress` - data requester address (the one who will submit the transaction)
- `txExecutor` - transaction executor function

Let's try proposing exchange for private fact using following parameters:
- digital identity address: `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`,
- data source address: `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98`
- fact key: `secret_message`
- wei to stake: `10000000000000000 wei` (which is equal to `0.01 ETH`).
- requester address: `0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951` (the one who will execute transaction)

```js
import { PrivateDataExchanger } from 'verifiable-data';
import BN from 'bn.js';
import IPFS from 'ipfs';

...

const exchanger = new PrivateDataExchanger(harmony, `0x1fba90b6cfec428e23143d5f2b94548d8200c5ef`);

// txExecutor must be function which takes TransactionConfig object as a parameter (transaction configuration to execute),
// executes it and returns transaction receipt.
const txExecutor = async ({ method, txConfig }) => {

  return new Promise(async (resolve, reject) => {
    try {
      if (txConfig.from) {
        method.wallet.setSigner(txConfig.from);
      }

      await method
        .send(txConfig)
        .on('receipt', receipt => {
          if (receipt.status === '0x0') {
            reject(new Error(`Transaction ${receipt.transactionHash} failed and has been reverted`));
            return;
          }

          resolve(receipt);
        })
        .on('error', error => {
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
};

// ipfsClient can be any object that is able to communicate with IPFS as long as it implements
// interface IIPFSClient in 'verifiable-data'
const ipfsClient = new IPFS();

ipfsClient.on('ready', async () => {

  const result = await exchanger.propose(
    `secret_message`,
    `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98`,
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

  // A generated exchanged key, which will be used to decrypt private data after digital identity owner accepts the exchange
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

  // Data source address
  factProviderAddress: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98',

  // Digital identity owner address
  passportOwnerAddress: '0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98',

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

To accept the private data exchange after proposition, digital identity owner should execute `PrivateDataExchanger.accept()` method providing the following parameters:
- `exchangeindex` - index of private data exchange to accept
- `passportOwnerPrivateKey` - digital identity owner's Ethereum wallet private key
- `ipfsClient` - IPFS client
- `txExecutor` - transaction executor function

Let's accept data exchange with index `1` which we proposed previously:
```js
...

await exchanger.accept(new BN(1), '<digital identity owner private key>', ipfsClient, txExecutor);

...
```

### Reading private data after private data exchange acceptance

After a private data exchange proposition is accepted, the data requester can read the private data by calling `PrivateDataExchanger.getPrivateData()` and providing the following parameters:
- `exchangeindex` - index of private data exchange to read data from
- `exchangeKey` - exchange key, which is generated and known by data requester after proposition
- `ipfsClient` - IPFS client

Let's read private data for exchange index `1` which was accepted in previous step:
```js
...

const data = await exchanger.getPrivateData(new BN(1), [72, 16, 88, ...], ipfsClient);

...
```

`data` will contain byte array of decrypted private data.

### Closing private data exchange proposition when timed out

If the digital identity owner ignored the request for the private data exchange, then after 24 hours, the data requester may close the request and return the staked funds by calling `PrivateDataExchanger.timeout()` method.

Here is how data requester can close the private data exchange with index `1`:

```js
...

await exchanger.timeout(new BN(1), txExecutor);

...
```

### Closing private data exchange after acceptance

After the data requester successfully read the private data, he can confirm this by invoking the `PrivateDataExchanger.finish()` method.
When executing this method, the funds staked by the data requester and digital identity owner will be transferred to the digital identity owner.
If the data requester does not send the finalization request withing a predefined timespan (24 hours), the digital identity owner is allowed to finalize private data exchange, preventing the escrow being locked-up indefinitely.

Here is how data requester or digital identity owner can finish the private data exchange with index `1`:

```js
...

// For data requester
await exchanger.finish(new BN(1), `0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951`, txExecutor);

// OR for digital identity owner after 24h
await exchanger.finish(new BN(1), `0x3aea49553ce2e478f1c0c5acc304a84f5f4d1f98`, txExecutor);

...
```

### Opening dispute after private data exchange acceptance

If it is not possible to decrypt the data, the data requester calls the `PrivateDataExchanger.dispute()` command within 24 hours after acceptance,
revealing the exchange key. The logic of the digital identity is the arbitrator who determines who the cheater is.
This is possible due to the fact that in the digital identity the hashes of both the data encryption key and the exchange key are saved, and the data encryption key is XORed with the exchange key during the private data exchange acceptance by the digital identity owner.

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
  // it means data requester has cheated and all staked funds is transferred to digital identity owner (and vice-versa)
  success: false,

  // Address of side who cheated (digital identity owner or data requester)
  cheaterAddress: '0xd2Bb3Aa3F2c0bdA6D8020f3228EabD4A89d8B951',
}
```

As we can see data requester has been decided as as cheater and all staked funds were transferred to digital identity owner.

Using this SDK it is not possible to cheat as a digital identity owner. However, this possibility still remains in case fraudulent digital identity owner would call digital identity contract methods directly by providing incorrectly encrypted data.

## Data source registry

A written fact to the passport always has the address of data source which has provided the fact. However, sometimes it is desirable to know more information about data source, like its name, website, etc. This is where `FactProviderRegistry` contract comes into the play - it keeps that information about data sources.

Information about data sources can be written only by data source registry owner, but can be read by anyone.

To manage your own list of data sources' info - deploy [`FactProviderRegistry`](https://github.com/monetha/reputation-contracts/blob/master/contracts/FactProviderRegistry.sol) contract.

Monetha has already deployed this contract to Harmony Testnet: [`0xD5E89D998Ec151a8549fDEeEe776165Ce8237b24`](https://explorer.testnet.harmony.one/#/address/0xD5E89D998Ec151a8549fDEeEe776165Ce8237b24)

SDK provides a `FactProviderManager` class, which allows easy creation, update, delection and reading of data source info from registry. For all operations you will have to know `registryAddress`, which is an address of data source registry contract.

### Setting data source information

Write data source information to registry using `FactProviderManager.setInfo` as in example:

```js
import { FactProviderManager } from 'verifiable-data';
const manager = new FactProviderManager(harmony, registryAddress);

// method must be signed by `registryOwnerAddress` when sending it to network
const method = await manager.setInfo(factProviderAddress, {
  name: 'Data source display name',

  // passport is an optional property which specifies data source's own digital identity
  // if it has any
  passport: '0x1234567890123456789012345678901234567890',
  website: 'https://www.data-source-website.io',
}, registryOwnerAddress);

// ... submit method in your code
```

The same method can be used for initial information writing as well as updating. Info can only be written by registry owner.

### Deleting data source information

Delete data source information from registry using `FactProviderManager.deleteInfo` as in example:

```js
import { FactProviderManager } from 'verifiable-data';
const manager = new FactProviderManager(harmony, registryAddress);

// method must be signed by `registryOwnerAddress` when sending it to network
const method = await manager.deleteInfo(factProviderAddress, registryOwnerAddress);

// ... submit method in your code
```

NOTE: this is not real deletion, since it is impossible to delete anything from blockchain. This method just makes sure that if anyone tries to read info about this data source using `getInfo` - it will return `null`. However, historical info could still be reached through transaction history. Info can only be deleted by registry owner.

### Reading data source information

Read data source information from registry using `FactProviderManager.getInfo` as in example:

```js
import { FactProviderManager } from 'verifiable-data';
const manager = new FactProviderManager(harmony, registryAddress);

const info = await manager.getInfo(factProviderAddress);

```

where `info` will be like

```js
{
  name: 'Data source display name',

  // property which specifies data source's own digital identity, if it has any
  passport: '0x123456...',
  website: 'https://www.data-source-website.io',
},
```

Info can be read by anyone.
