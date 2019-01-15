import axios from 'axios';
import { Hex } from '../models/Hex';
import { Address } from '../models/Address';
import { IEvent } from '../models/IEvent';

/**
 * Fetches all the events corresponding to specific address from block 0 to latest
 *
 * @param fromBlock starting block
 * @param toBlock ending block
 * @param address address to fetch events for
 * @param url network url ot use
 */
export const fetchEvents = async (fromBlock: Hex, toBlock: Hex, address: Address, url: string) => {
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

  const response = await axios.post(url, requestData);

  return response.data.result as IEvent[];
};
