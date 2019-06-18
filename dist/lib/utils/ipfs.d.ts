import { IIPFSLink, IIPFSClient, IIPFSAddResult } from '../models/IIPFSClient';
/**
 * Puts directory containing links and returns Cid of directory
 */
export declare function dagPutLinks(links: IIPFSLink[], ipfsClient: IIPFSClient): Promise<IIPFSLink>;
/**
 * Creates link from IIPFSAddResult
 */
export declare function convertAddResultToLink(result: IIPFSAddResult, name: string): IIPFSLink;
