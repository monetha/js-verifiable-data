import { IIPFSLink, IIPFSClient, IIPLD, IIPFSAddResult } from '../models/IIPFSClient';

/**
 * Puts directory containing links and returns Cid of directory
 */
export async function dagPutLinks(links: IIPFSLink[], ipfsClient: IIPFSClient) {
  const node: IIPLD = {
    Data: 'CAE=',
    Links: links,
  };

  return ipfsClient.dag.put(node, {
    format: 'protobuf',
    inputEnc: 'json',
    pin: true,
  });
}

/**
 * Creates link from IIPFSAddResult
 */
export function convertAddResultToLink(result: IIPFSAddResult, name: string) {
  const link: IIPFSLink = {
    Cid: {
      '/': result.Hash,
    },
    Name: name,
    Size: Number(result.Size),
  };

  return link;
}
