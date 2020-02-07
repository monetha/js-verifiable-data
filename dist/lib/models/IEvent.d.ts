export interface IEvent {
    address?: string;
    topics?: string[];
    data?: string;
    blockNumber?: string;
    transactionHash?: string;
    transactionIndex?: string;
    blockHash?: string;
    logIndex?: string;
    removed?: boolean;
    event?: string;
    returnValues: {
        [key: string]: any;
    };
    raw: {
        data: string;
        topics: string[];
    };
    signature?: string;
}
