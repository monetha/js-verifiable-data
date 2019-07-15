import { Address } from '../models/Address';
import { IHistoryEvent } from '../models/IHistoryEvent';
import { IPassportHistoryFilter } from '../models/IPassportHistoryFilter';
import { IPassportRef } from '../models/IPassportRef';
import Web3 from 'web3';
/**
 * Class to get passports list and historic events
 */
export declare class PassportReader {
    private web3;
    private ethNetworkUrl;
    constructor(web3: Web3, ethNetworkUrl: string);
    /**
     * Fetches all passport addresses created by a particular passport factory address
     *
     * @param factoryAddress address of passport factory to get passports for
     * @param startBlock block nr to scan from
     * @param endBlock block nr to scan to
     */
    getPassportsList(factoryAddress: Address, startBlock?: string, endBlock?: string): Promise<IPassportRef[]>;
    /**
     * Fetches all the events (history) of a particular passport address
     *
     * @param passportAddress address of passport to get events for
     * @param filter passport history filter
     */
    readPassportHistory(passportAddress: Address, filter?: IPassportHistoryFilter): Promise<IHistoryEvent[]>;
    /**
     * Returns the address of passport logic registry
     */
    getPassportLogicRegistryAddress(passportAddress: string): Promise<string>;
}
