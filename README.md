# Monetha: Decentralized Reputation Framework

# Reputation Layer: js-sdk

- [Monetha: Decentralized Reputation Framework](#monetha-decentralized-reputation-framework)
- [Reputation Layer: js-sdk](#reputation-layer-js-sdk)
  - [Building the source](#building-the-source)
    - [Prerequisites](#prerequisites)
    - [Build](#build)
  - [Bootstrap reputation layer](#bootstrap-reputation-layer)
  - [Usage](#usage)
    - [Deploying passport](#deploying-passport)
    - [Passport list](#passport-list)
    - [Writing facts](#writing-facts)
    - [Reading facts](#reading-facts)
    - [Changing passport permissions](#changing-passport-permissions)
    - [Reading facts history](#reading-facts-history)

## Building the source

### Prerequisites

* Node.js > 5.*
* npm > 3.*

### Build

The build process is set to be automatic you just need to install the package using:

`npm install --save git+https://github.com/monetha/reputation-js-sdk.git`

or

`yarn add git+https://github.com/monetha/reputation-js-sdk.git`

## Bootstrap reputation layer

Monetha has already deployed this set of auxiliary reputation layer contracts on Ropsten test network. The contract addresses deployed on Ropsten:

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0x0361a024040E7020251fF0756Bb40B8e136B9c9f`](https://ropsten.etherscan.io/address/0x0361a024040E7020251fF0756Bb40B8e136B9c9f) |
| `PassportLogicRegistry`  | [`0xabA015Fc83E9B88e8334bD9b536257db75e05295`](https://ropsten.etherscan.io/address/0xabA015Fc83E9B88e8334bD9b536257db75e05295) |
| `PassportFactory` | [`0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2`](https://ropsten.etherscan.io/address/0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2) |

Consider the process of deploying your own set of auxiliary repoutation layer contracts to experiment with our implementation. If you are going to deploy your contracts, then you will have to support them yourself.

This means that if the reputation layer logic of the passport is updated by Monetha developers, you'll need to deploy a new `PassportLogic` contract, register it
in an existing `PassportLogicRegistry` contract (by calling `addPassportLogic` method) and finally make it active (by calling `setCurrentPassportLogic`).

If you use a set of Monetha deployed reputation layer contracts, then the reputation passport logic is always up-to-date with latest fixes and features.

Prepare in advance the address that will be the owner of the deployed contracts. Make sure that it has enough funds to deploy contracts (1 ETH should be enough).

## Usage

```js
import sdk from 'reputation-sdk'
const generator = new sdk.PassportGenerator(network url, passportFactoryAddress)
```

In order to create a passport and start using it, you need to use auxiliary reputation layer contracts: PassportLogic, PassportLogicRegistry, PassportFactory.

### Deploying passport

Before creating a passport for a specific Ethereum address, unlock the MetaMask.
Make sure that the passport owner has enough money to create a passport contract. Usually passport contract deployment takes `425478` gas.

To create a passport contract you need to know address of the `PassportFactory` contract. Let's try to create a passport in Ropsten
using the `PassportFactory` contract deployed by Monetha ([`0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2`](https://ropsten.etherscan.io/address/0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2)):

```js
import sdk from 'reputation-sdk'
const generator = new sdk.PassportGenerator(network url, passportFactoryAddress)
generator.createPassport(address of user creating passport)
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in userAddress and broadcast it on the network.

### Passport list

The passport factory allows you to get a list of all the passports that have been created.

Let's try to get a list of all passports using the address of `PassportFactory` contract deployed by Monetha ([`0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2`](https://ropsten.etherscan.io/address/0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2))
in Ropsten network:

```js
import sdk from 'reputation-sdk'
const reader = new sdk.PassportReader(network url)
reader.getPassportLists("0x87b7Ec2602Da6C9e4D563d788e1e29C064A364a2")
```

You should get something like this Array of objects:

|passport_address|first_owner|block_number|tx_hash|
|----------------|-----------|------------|-------|
|0x9CfabB3172DFd5ED740c3b8A327BF573226c5064|0xDdD9b3Ea9d65cfD12b18ceA4E6f7Df4948ec4C55|4105235|0x5a26791f5404f7d26c9c75e4fa006d851162f4bbaacc49372ce45d89db8fd967|
|0x2ff877C92458F995332bc189F258eF8fB8458050|0xA12eB9Cde44664B6513D66f1fc4d43c951d4594e|4276542|0x639262c4abf2868e376e6b08baa5663a2449b18fc668836b5451d07f24c04db5|
|0x86eEb0D360D286BcF9211780878fe0D0c0e3fF00|0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d|4292633|0x96f4c583994c2d1c033a0722f7cbe8d85c636b62d1f5fcd8bb0b32346c61c4a9|

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

*: *js sdk doesn't support IPFS yet.*

You can write up to 100KB of data in passport under one key when `txdata` data type is used. Supported data types that
can be written to the passport: `string`, `bytes`, `address`, `uint`, `int`, `bool`, `txdata`. All types except `txdata`
use Ethereum storage to store the data. `txdata` uses Ethereum storage only to save the block number, the data itself
remains in the transaction input data and can be read later using the SDK. Therefore, if you need to save a large amount
of data, it is better to use `txdata` type of data. The disadvantage of the `txdata` type of data is the data can only be read
using the SDK, within the contracts this data is not available.

Let's try to store string  `hello` under the key `greetings` as `string` in passport
`<passportAddress>`:


```js
import sdk from 'reputation-sdk'
const writer = new sdk.FactWriter(network url, <passportAddress>)
writer.setString("greetings", "hello", transaction signer userAddress)
```

Also user can delete the data stored from the passport.

Let's try to delete string  `hello` under the key `greetings` as `string` in passport
`<passportAddress>`:

```js
import sdk from 'reputation-sdk'
const remover = new sdk.FactRemover(network url, <passportAddress>)
remover.deleteString("greetings", transaction signer userAddress)
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in userAddress and broadcast it on the network.

### Reading facts

After the fact provider has written the public data to the passport, the data can be read by anyone.
To read the data you need to know: the address of the passport, the address of the fact provider who stored the data,
the key under which the data was stored and the type of data.

Let's try to retrieve string from passport `<passportAddress>` that was stored by the fact provider
`<factProviderAddress>` under the key `greetings` as `string` data type:

```js
import sdk from 'reputation-sdk'
const reader = new sdk.FactReader(network url)
reader.setContract(<passportAddress>)
reader.getString(<factProviderAddress>, "greetings")
```

### Changing passport permissions

By default any fact provider can write to a passport, but a passport owner can change permissions that allow only
fact providers from the whitelist to write to a passport. To do this, the passport owner must add the authorized fact providers
to the whitelist and then allow to store the facts only to fact providers from the whitelist.

Consider an example of how owner of a passport `<ownerAddress>` adds fact provider
`<factProviderAddress>` to the whitelist in Ropsten network:

```js
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(<passportAddress>, network url)
Permissions.addFactProviderToWhitelist(<factProvider>, user addres of transaction signer)
```

Also the passportOwner can delete the factProvider from the list.
Consider an example of how owner of a passport `<ownerAddress>` deletes fact provider
`<factProviderAddress>` to the whitelist in Ropsten network:

```js
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(<passportAddress>, network url)
Permissions.removeFactProviderFromWhitelist(<factProvider>, user addres of transaction signer)
```

Please note that the passport owner only can call this method.

After executing the command, any fact provider is still allowed to store the facts in the passport. Let's fix it!

Owner of a passport `<ownerAddress>` may allow to store the facts only to fact providers
from the whitelist by running the command:

```js
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(<passportAddress>, network url)
Permissions.changePermission(true/false, user addres of transaction signer)
```

### Reading facts history

The SDK allows you to see the history of absolutely all changes of facts in the passport.

Let's try to retrieve the entire change history for the passport [`0x9CfabB3172DFd5ED740c3b8A327BF573226c5064`](https://ropsten.etherscan.io/address/0x9cfabb3172dfd5ed740c3b8a327bf573226c5064)
in `Ropsten` block-chain :

```js
import sdk from 'reputation-sdk'
const passportReader = new sdk.PassportReader(network url)
passportReader.readPassportHistory(<passportAddress>)
```

| fact_provider | key | block_number | tx_hash |
|---------------|-----|--------------|---------|
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 4177015 | 0x627913f620990ec12360a6f1fda4887ea837b41e2f6cbae90e24322dc8cf8b1a |
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 4337297 | 0x31e06af4e04450333d468835c995fc02622c1b07ae0feeb4c7afe73c5a2e3ed8 |

As we can see, there were only two fact updates under the same key `monetha.jpg` by the same data provider `0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d`.
The `block_number` and `tx_hash` columns allow us to understand in which block and in which transaction the changes were made.
Even if the value of a fact has been deleted or changed, we can read its value as it was before the deletion.

Let's read what the value of the fact was during the first update. To do this, we need to specify the transaction hash `0x627913f620990ec12360a6f1fda4887ea837b41e2f6cbae90e24322dc8cf8b1a`:

```js
passportReader.getTrxData(<transaction Hash from the above>)
```
