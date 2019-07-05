import { IIPFSClient } from '../../dist/lib/proto';
import FormData from 'form-data';
import fetch from 'node-fetch';

const IPFS_GATEWAY_URL = 'https://ipfs.infura.io';
const INFURA_IPFS_API_URL = 'https://ipfs.infura.io:5001/api';

export class IPFSClient implements IIPFSClient {
  public dag = new IPFSDagClient();

  public async cat(path) {
    const response = await fetch(`${IPFS_GATEWAY_URL}/ipfs/${path}`);
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  public async add(data) {
    const formData = new FormData();

    formData.append('file', data);

    const response = await fetch(`${INFURA_IPFS_API_URL}/v0/add`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg);
    }

    return response.json();
  }
}

class IPFSDagClient {
  public async put(dagNode: any, options?: any): Promise<any> {
    const formData = new FormData();

    formData.append('file', JSON.stringify(dagNode));

    const queryParams =
      (options.format ? `format=${options.format}&` : '') +
      (options.inputEnc ? `input-enc=${options.inputEnc}&` : '') +
      (options.pin ? `pin=${options.pin}&` : '');

    const response = await fetch(`${INFURA_IPFS_API_URL}/v0/dag/put?${queryParams}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg);
    }

    return response.json();
  }
}