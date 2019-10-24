/**
 * A convenient function which sends a command to web3 provider and returns response, stripped of rpc request/response structure
 */
export function send(provider, method: string, params: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      provider.send({
        jsonrpc: '2.0',
        method,
        params,
      }, (err, resp) => {
        if (err) {
          reject(err);
          return;
        }

        if (resp.error) {
          reject(resp.error);
          return;
        }

        resolve(resp.result);
      });
    } catch (e) {
      reject(e);
    }
  });
}
