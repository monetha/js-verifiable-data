import { Harmony } from '@harmony-js/core';
import { Contract } from '@harmony-js/contract';
import { eventFilterEncoder } from '@harmony-js/contract/dist/utils/encoder';
import { decode as eventLogDecoder } from '@harmony-js/contract/dist/utils/decoder';
import { RPCMethod } from '@harmony-js/network';
import { ErrorCode } from 'lib/errors/ErrorCode';
import { createSdkError } from 'lib/errors/SdkError';
import { IEvent } from 'lib/models/IEvent';
import { toBN } from './conversion';

export interface IFilterOptions {
  fromBlock?: string | number;
  toBlock?: string | number;
  address?: string;
  filter?: object;
}

export async function getAllPastEvents(harmony: Harmony, contract: Contract, options?: IFilterOptions): Promise<IEvent[]> {

  const finOptions: any = {
    fromBlock: options.fromBlock || 'earliest',
    address: contract.address,
    ...(options || {}),
  };

  if (!finOptions.topics) {
    finOptions.topics = [];
  }

  // Call RPC
  const response = await harmony.messenger.send(RPCMethod.GetPastLogs,
    [finOptions],
    harmony.messenger.chainType,
    harmony.defaultShardID);
  if (response.isError()) {
    throw createSdkError(ErrorCode.RPCFailure, response.error.message);
  }

  // Decode events
  return response.result.map(event => {
    if (!event.topics || event.topics.length === 0) {
      return event;
    }

    const signature = event.topics[0];

    const eventModel = contract.abiModel.getEventBySignature(signature);
    if (!eventModel) {
      return event;
    }

    return eventLogDecoder(contract.abiCoder, eventModel, event);
  });
}

export async function getPastEvents(harmony: Harmony, contract: Contract, eventName: string, options?: IFilterOptions): Promise<IEvent[]> {
  const { filter, ...restOpts } = options || { filter: null };

  const abiItemModel = contract.abiModel.getEvent(eventName);
  if (!abiItemModel) {
    throw createSdkError(ErrorCode.InvalidEventName, `Event "${eventName}" does not exist in contract\'s ${contract.address} ABI file`);
  }

  const finOptions: any = {
    ...restOpts,
    fromBlock: options.fromBlock || 'earliest',
    address: contract.address,
  };

  if (finOptions.fromBlock !== 'earliest') {
    finOptions.fromBlock = `0x${toBN(finOptions.fromBlock).toString('hex')}`;
  }

  if (finOptions.toBlock && finOptions.toBlock !== 'latest') {
    finOptions.toBlock = `0x${toBN(finOptions.toBlock).toString('hex')}`;
  }

  if (!finOptions.topics) {
    finOptions.topics = [];
  }

  // Encode event filters
  if (filter) {
    finOptions.topics = finOptions.topics.concat(eventFilterEncoder(contract.abiCoder, abiItemModel, filter));
  }

  // Event name in topic
  if (!abiItemModel.anonymous) {
    finOptions.topics.unshift(abiItemModel.signature);
  }

  // Call RPC
  const response = await harmony.messenger.send(RPCMethod.GetPastLogs,
    [finOptions],
    harmony.messenger.chainType,
    harmony.defaultShardID);
  if (response.isError()) {
    throw createSdkError(ErrorCode.RPCFailure, response.error.message);
  }

  // Decode events
  return response.result.map(event => eventLogDecoder(contract.abiCoder, abiItemModel, event));
}
