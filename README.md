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
| `PassportLogic` | [`0xEf95422e66761A5a468FE72c1fD3C946884d5E50`](https://ropsten.etherscan.io/address/0xEf95422e66761A5a468FE72c1fD3C946884d5E50) |
| `PassportLogicRegistry`  | [`0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c`](https://ropsten.etherscan.io/address/0x11C96d40244d37ad3Bb788c15F6376cEfA28CF7c) |
| `PassportFactory` | [`0x5FD962855e9b327262F47594949fd6d742FE2A01`](https://ropsten.etherscan.io/address/0x5FD962855e9b327262F47594949fd6d742FE2A01) |

The contract addresses deployed on Mainnet:

| Contract      | Address                                      |
|---------------|----------------------------------------------|
| `PassportLogic` | [`0x76E2fe5C37c47Fe09DCFa55Bec9Fd34318922F27`](https://etherscan.io/address/0x76E2fe5C37c47Fe09DCFa55Bec9Fd34318922F27) |
| `PassportLogicRegistry`  | [`0x41c32A8387ff178659ED9B04190613623F545657`](https://etherscan.io/address/0x41c32A8387ff178659ED9B04190613623F545657) |
| `PassportFactory` | [`0xdbf780f836D8a22b56AcF9Fd266171fAFf31F521`](https://etherscan.io/address/0xdbf780f836D8a22b56AcF9Fd266171fAFf31F521) |

Consider the process of deploying your own set of auxiliary repoutation layer contracts to experiment with our implementation. If you are going to deploy your contracts, then you will have to support them yourself.

This means that if the reputation layer logic of the passport is updated by Monetha developers, you'll need to deploy a new `PassportLogic` contract, register it
in an existing `PassportLogicRegistry` contract (by calling `addPassportLogic` method) and finally make it active (by calling `setCurrentPassportLogic`).

If you use a set of Monetha deployed reputation layer contracts, then the reputation passport logic is always up-to-date with latest fixes and features.

Prepare in advance the address that will be the owner of the deployed contracts. Make sure that it has enough funds to deploy contracts (1 ETH should be enough).

## Usage

```js
import sdk from 'reputation-sdk'
const generator = new sdk.PassportGenerator(web3, passportFactoryAddress)
```

In order to create a passport and start using it, you need to use auxiliary reputation layer contracts: PassportLogic, PassportLogicRegistry, PassportFactory.

### Deploying passport

Before creating a passport for a specific Ethereum address, unlock the MetaMask.
Make sure that the passport owner has enough money to create a passport contract. Usually passport contract deployment takes `425478` gas.

To create a passport contract you need to know address of the `PassportFactory` contract. Let's try to create a passport in Ropsten
using the `PassportFactory` contract deployed by Monetha ([`0x5FD962855e9b327262F47594949fd6d742FE2A01`](https://ropsten.etherscan.io/address/0x5FD962855e9b327262F47594949fd6d742FE2A01)):

```js
import sdk from 'reputation-sdk'
const generator = new sdk.PassportGenerator(web3, passportFactoryAddress)
generator.createPassport(walletAddress)
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in walletAddress and broadcast it on the network.

### Passport ownership

After the passport is created, the owner must call the `claimOwnership` method to become a full owner:

```js
import sdk from 'reputation-sdk'
const generator = new sdk.PassportOwnership(web3, passportAddress)
generator.claimOwnership(ownerAddress)
```

### Passport list

The passport factory allows you to get a list of all the passports that have been created.

Let's try to get a list of all passports using the address of `PassportFactory` contract deployed by Monetha ([`0x5FD962855e9b327262F47594949fd6d742FE2A01`](https://ropsten.etherscan.io/address/0x5FD962855e9b327262F47594949fd6d742FE2A01))
in Ropsten network:

```js
import sdk from 'reputation-sdk'
const reader = new sdk.PassportReader(web3, ethereumNetworkUrl)
reader.getPassportsList("0x5FD962855e9b327262F47594949fd6d742FE2A01")
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
import sdk from 'reputation-sdk'
const writer = new sdk.FactWriter(web3, passportAddress)
writer.setString("greetings", "hello", factProviderAddress)
```

Also user can delete the data stored from the passport.

Let's try to delete string  `hello` under the key `greetings` as `string` in passport
`<passportAddress>`:

```js
import sdk from 'reputation-sdk'
const remover = new sdk.FactRemover(web3, passportAddress)
remover.deleteString("greetings", factProviderAddress)
```

You will get the transaction info (raw unsigned transaction) in output of the function, sign the transaction using the private key of address given in factProviderAddress and broadcast it on the network.

### Reading facts

After the fact provider has written the public data to the passport, the data can be read by anyone.
To read the data you need to know: the address of the passport, the address of the fact provider who stored the data,
the key under which the data was stored and the type of data.

Let's try to retrieve string from passport `<passportAddress>` that was stored by the fact provider
`<factProviderAddress>` under the key `greetings` as `string` data type:

```js
import sdk from 'reputation-sdk'
const reader = new sdk.FactReader(web3, ethereumNetworkAddress, passportAddress)
reader.getString(factProviderAddress, "greetings")
```

### Changing passport permissions

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
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(web3, passportAddress)
Permissions.removeFactProviderFromWhitelist(factProviderAddress, passportOwnerAddress)
```

Please note that the passport owner only can call this method.

After executing the command, any fact provider is still allowed to store the facts in the passport. Let's fix it!

Owner of a passport `<ownerAddress>` may allow to store the facts only to fact providers
from the whitelist by running the command:

```js
import sdk from 'reputation-sdk'
const Permissions = new sdk.Permissions(web3, passportAddress)
Permissions.setWhitelistOnlyPermission(true, passportOwnerAddress)
```

### Reading facts history

The SDK allows you to see the history of absolutely all changes of facts in the passport.

Let's try to retrieve the entire change history for the passport [`0x1C3A76a9A27470657BcBE7BfB47820457E4DB682`](https://ropsten.etherscan.io/address/0x1C3A76a9A27470657BcBE7BfB47820457E4DB682)
in `Ropsten` block-chain :

```js
import sdk from 'reputation-sdk'
const reader = new sdk.PassportReader(web3, ethereumNetworkUrl)
reader.readPassportHistory(passportAddress)
```

| factProviderAddress | key | blockNumber | transactionHash |
|---------------|-----|--------------|---------|
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 0x4FDCFA | 0xd43201d6b23a18b90a53bf7ef1fffad0b04af603c039b6617601a225a129c632 |
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | monetha.jpg | 0x4FDCFD | 0xf069012520c55d293595654805f3f2b1ff032c1395ddd37cd1366fc1ac67114e |
| 0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d | Monetha_WP.pdf | 0x4FDD0A | 0xbc8a86f54a467edbec32fbf27c08e7077221dd69bbea79707889ac6f787fe0ca |

As we can see, there were only three fact updates by the same data provider `0x5b2AE3b3A801469886Bb8f5349fc3744cAa6348d`.
The `blockNumber` and `transactionHash` columns allow us to understand in which block and in which transaction the changes were made.
Even if the value of a fact has been deleted or changed, we can read its value as it was before the deletion.

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
