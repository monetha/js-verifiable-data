import { IEvent } from '../models/IEvent';
/**
 * Fetches all the events corresponding to specific address from block 0 to latest
 *
 * @param ethNetworkUrl network url ot use
 * @param fromBlock starting block
 * @param toBlock ending block
 * @param address address to fetch events for
 */
export declare const fetchEvents: (ethNetworkUrl: string, fromBlock: string, toBlock: string, address: string) => Promise<IEvent[]>;
