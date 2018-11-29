export default {
  "PassportLogic": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getTxDataBlockNumber",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "isAllowedFactProvider",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_onlyWhitelist",
            "type": "bool"
          }
        ],
        "name": "setWhitelistOnlyPermission",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteBool",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "bytes"
          }
        ],
        "name": "setBytes",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "int256"
          }
        ],
        "name": "setInt",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "claimOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "setTxDataBlockNumber",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteBytes",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "isWhitelistOnlyPermissionSet",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getBytes",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "bytes"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "removeFactProviderFromWhitelist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "string"
          }
        ],
        "name": "setString",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getUint",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getAddress",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "isFactProviderInWhitelist",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteInt",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getInt",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "int256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getBool",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteTxDataBlockNumber",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "bool"
          }
        ],
        "name": "setBool",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "addFactProviderToWhitelist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "address"
          }
        ],
        "name": "setAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "setUint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteUint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "pendingOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_factProvider",
            "type": "address"
          },
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "getString",
        "outputs": [
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_key",
            "type": "bytes32"
          }
        ],
        "name": "deleteString",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "TxDataUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "TxDataDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "BytesUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "BytesDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "StringUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "StringDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "BoolUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "BoolDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "IntUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "IntDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "UintUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "UintDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "AddressUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "key",
            "type": "bytes32"
          }
        ],
        "name": "AddressDeleted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "onlyWhitelist",
            "type": "bool"
          }
        ],
        "name": "WhitelistOnlyPermissionSet",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          }
        ],
        "name": "WhitelistFactProviderAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "factProvider",
            "type": "address"
          }
        ],
        "name": "WhitelistFactProviderRemoved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipRenounced",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      }
    ]
  },
  "PassportFactory": {
    "at": "0x816447ba7a187159f29a7a374313bba2a77d91f8",
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_token",
            "type": "address"
          }
        ],
        "name": "reclaimToken",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "reclaimEther",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "tokenFallback",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_registry",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "passport",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "PassportCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "oldRegistry",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newRegistry",
            "type": "address"
          }
        ],
        "name": "PassportLogicRegistryChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipRenounced",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_registry",
            "type": "address"
          }
        ],
        "name": "setRegistry",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getRegistry",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "createPassport",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  "PassportLogicRegistry": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_token",
            "type": "address"
          }
        ],
        "name": "reclaimToken",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "reclaimEther",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          },
          {
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "tokenFallback",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_version",
            "type": "string"
          },
          {
            "name": "_implementation",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipRenounced",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "version",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "PassportLogicAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "version",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "CurrentPassportLogicSet",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_version",
            "type": "string"
          },
          {
            "name": "_implementation",
            "type": "address"
          }
        ],
        "name": "addPassportLogic",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_version",
            "type": "string"
          }
        ],
        "name": "getPassportLogic",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_version",
            "type": "string"
          }
        ],
        "name": "setCurrentPassportLogic",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getCurrentPassportLogicVersion",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getCurrentPassportLogic",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  "PaymentProcessor": {
    "at": "0x0C80e0C594E2BBb14ad17ca37D33451aa6709582",
    "abi": [
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "isMonethaAddress",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "contactInformation",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "merchantHistory",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          }
        ],
        "name": "securePay",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_merchantHistory",
            "type": "address"
          }
        ],
        "name": "setMerchantDealsHistory",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "monethaGateway",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "destroy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          },
          {
            "name": "_clientReputation",
            "type": "uint32"
          },
          {
            "name": "_merchantReputation",
            "type": "uint32"
          },
          {
            "name": "_dealHash",
            "type": "uint256"
          },
          {
            "name": "_refundReason",
            "type": "string"
          }
        ],
        "name": "refundPayment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          }
        ],
        "name": "secureTokenPay",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          },
          {
            "name": "_price",
            "type": "uint256"
          },
          {
            "name": "_paymentAcceptor",
            "type": "address"
          },
          {
            "name": "_originAddress",
            "type": "address"
          },
          {
            "name": "_fee",
            "type": "uint256"
          },
          {
            "name": "_tokenAddress",
            "type": "address"
          }
        ],
        "name": "addOrder",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          }
        ],
        "name": "withdrawRefund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "orders",
        "outputs": [
          {
            "name": "state",
            "type": "uint8"
          },
          {
            "name": "price",
            "type": "uint256"
          },
          {
            "name": "fee",
            "type": "uint256"
          },
          {
            "name": "paymentAcceptor",
            "type": "address"
          },
          {
            "name": "originAddress",
            "type": "address"
          },
          {
            "name": "tokenAddress",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          },
          {
            "name": "_clientReputation",
            "type": "uint32"
          },
          {
            "name": "_merchantReputation",
            "type": "uint32"
          },
          {
            "name": "_dealHash",
            "type": "uint256"
          }
        ],
        "name": "processPayment",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          },
          {
            "name": "_clientReputation",
            "type": "uint32"
          },
          {
            "name": "_merchantReputation",
            "type": "uint32"
          },
          {
            "name": "_dealHash",
            "type": "uint256"
          },
          {
            "name": "_cancelReason",
            "type": "string"
          }
        ],
        "name": "cancelOrder",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newGateway",
            "type": "address"
          }
        ],
        "name": "setMonethaGateway",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "info",
            "type": "string"
          }
        ],
        "name": "setContactInformation",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "merchantWallet",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_address",
            "type": "address"
          },
          {
            "name": "_isMonethaAddress",
            "type": "bool"
          }
        ],
        "name": "setMonethaAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newWallet",
            "type": "address"
          }
        ],
        "name": "setMerchantWallet",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "FEE_PERMILLE",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_orderId",
            "type": "uint256"
          }
        ],
        "name": "withdrawTokenRefund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "merchantIdHash",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_recipient",
            "type": "address"
          }
        ],
        "name": "destroyAndSend",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_merchantId",
            "type": "string"
          },
          {
            "name": "_merchantHistory",
            "type": "address"
          },
          {
            "name": "_monethaGateway",
            "type": "address"
          },
          {
            "name": "_merchantWallet",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "_address",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_isMonethaAddress",
            "type": "bool"
          }
        ],
        "name": "MonethaAddressSet",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "Pause",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "Unpause",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      }
    ]
  }
}