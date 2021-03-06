/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractOptions, Options } from "web3-eth-contract";
import { Block } from "web3-eth";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import { Callback, TransactionObject } from "./types";

export class PassportLogicRegistry extends Contract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  );
  methods: {
    tokenFallback(
      _from: string,
      _value: number | string,
      _data: (string | number[])[]
    ): TransactionObject<void>;

    getPassportLogic(_version: string): TransactionObject<string>;

    reclaimToken(_token: string): TransactionObject<void>;

    renounceOwnership(): TransactionObject<void>;

    reclaimEther(): TransactionObject<void>;

    transferOwnership(_newOwner: string): TransactionObject<void>;

    addPassportLogic(
      _version: string,
      _implementation: string
    ): TransactionObject<void>;

    setCurrentPassportLogic(_version: string): TransactionObject<void>;

    owner(): TransactionObject<string>;
    getCurrentPassportLogicVersion(): TransactionObject<string>;
    getCurrentPassportLogic(): TransactionObject<string>;
  };
  events: {
    OwnershipRenounced(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    OwnershipTransferred(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    PassportLogicAdded(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    CurrentPassportLogicSet(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    allEvents: (
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}
