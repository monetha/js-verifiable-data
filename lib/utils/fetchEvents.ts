import axios from 'axios';
import { Hex } from '../models/Hex';
import { Address } from '../models/Address';
import { IEvent } from '../models/IEvent';

/**
 * Fetches all the events corresponding to specific address from block 0 to latest
 *
 * @param ethNetworkUrl network url ot use
 * @param fromBlock starting block
 * @param toBlock ending block
 * @param address address to fetch events for
 */
export const fetchEvents = async (ethNetworkUrl: string, fromBlock: Hex, toBlock: Hex, address: Address) => {
  const requestData = {
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_getLogs',
    params: [
      {
        fromBlock,
        toBlock,
        address,
      },
    ],
  };

  const response = await axios.post(ethNetworkUrl, requestData);

  if (response.data && response.data.error) {
    throw response.data.error;
  }

  return response.data.result as IEvent[];
};
