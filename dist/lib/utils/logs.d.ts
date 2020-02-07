import { Harmony } from '@harmony-js/core';
import { Contract } from '@harmony-js/contract';
import { IEvent } from '../models/IEvent';
export interface IFilterOptions {
    fromBlock?: string | number;
    toBlock?: string | number;
    address?: string;
    filter?: object;
}
export declare function getAllPastEvents(harmony: Harmony, contract: Contract, options?: IFilterOptions): Promise<IEvent[]>;
export declare function getPastEvents(harmony: Harmony, contract: Contract, eventName: string, options?: IFilterOptions): Promise<IEvent[]>;
