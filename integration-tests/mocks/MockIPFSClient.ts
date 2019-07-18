
import { sha256 } from 'hash.js';
import { IIPFSClient, IIPFSAddResult, IIPFSDag, IIPFSLink, IIPLD } from 'verifiable-data';

export class MockIPFSClient implements IIPFSClient {
  public dag: MockIPFSDag;

  private db = {};

  public constructor() {
    this.dag = new MockIPFSDag(this.db);
  }

  public add = async (data): Promise<IIPFSAddResult | IIPFSAddResult[]> => {
    const dataBuf = Buffer.from(data);
    const dataArr = Array.from(dataBuf);
    const hash = sha256().update(dataArr).digest('hex');

    this.db[hash] = data;

    return {
      Path: hash,
      Hash: hash,
      Size: dataArr.length,
    };
  }

  public cat = async (path): Promise<Buffer> => {
    return this.db[path];
  }
}

class MockIPFSDag implements IIPFSDag {
  private db;

  public constructor(db: any) {
    this.db = db;
  }

  public async put(dagNode): Promise<IIPFSLink> {
    const dagBuf = Buffer.from(JSON.stringify(dagNode));
    const dagArr = Array.from(dagBuf);
    const hash = sha256().update(dagArr).digest('hex');

    const ipldNode: IIPLD = dagNode;

    if (ipldNode.Data && ipldNode.Links) {
      this.db[hash] = ipldNode;

      ipldNode.Links.forEach(link => {
        this.db[`${hash}/${link.Name}`] = this.db[link.Cid['/']];
      });
    }

    return {
      Cid: {
        '/': hash,
      },
    };
  }
}
