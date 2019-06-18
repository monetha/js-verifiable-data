
export interface IIPFSClient {
  add(content: any): Promise<IIPFSAddResult | IIPFSAddResult[]>;
  cat(ipfsPath: string): Promise<Buffer>;
  dag: IIPFSDag;
}

export interface IIPFSAddResult {
  Path: string;
  Hash: string;
  Size: number;
}

export interface IIPFSDag {
  put(dagNode: any, options?: any): Promise<IIPFSLink>;
}

/**
 * Link represents an IPFS Merkle DAG Link between Nodes.
 */
export interface IIPFSLink {

  /**
   * Multihash of the target object
   */
  Cid: {};

  /**
   * Utf string name. should be unique per object
   */
  Name: string;

  /**
   * Cumulative size of target object
   */
  Size: number;
}

export interface IIPLD {
  Data: string;
  Links: IIPFSLink[];
}
