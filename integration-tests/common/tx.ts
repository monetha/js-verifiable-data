import EthereumTx from 'ethereumjs-tx';
import Web3 from 'web3';
import { Transaction, TransactionReceipt, TransactionConfig } from 'web3-core';
import { getAccounts, getPrivateKeys, getNetwork, NetworkType, getNetworkConfig } from './network';
import { submitPrivateTransaction } from './networks/quorum';
import { toBN, TxExecutor } from 'verifiable-data';

export const isPrivateTxMode: boolean = process.argv.includes('--private');

export async function submitTransaction(web3: Web3, txData: TransactionConfig) {
  return new Promise<Transaction>(async (success, reject) => {
    try {
      const tx = new EthereumTx({
        nonce: toBN(txData.nonce).toBuffer(),
        gasPrice: toBN(txData.gasPrice).toBuffer(),
        gasLimit: toBN(txData.gas).toBuffer(),
        to: txData.to,
        value: toBN(txData.value).toBuffer(),
        data: Buffer.from(txData.data.replace('0x', ''), 'hex'),
      });

      const accounts = await getAccounts(web3);
      const accountIndex = accounts.findIndex(a => a.toLowerCase() === txData.from.toString().toLowerCase());
      if (accountIndex === -1) {
        throw new Error(`Not possible to execute tx because private key for address ${txData.from} is not known`);
      }

      const privateKeys = getPrivateKeys();
      const privateKey = privateKeys[accountIndex];

      tx.sign(Buffer.from(privateKey.replace('0x', ''), 'hex'));
      const rawTx = `0x${tx.serialize().toString('hex')}`;

      await web3.eth.sendSignedTransaction(rawTx)
        .on('transactionHash', async (hash) => {
          const transaction = await web3.eth.getTransaction(hash);
          success(transaction);
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * waitForTxToFinish waits for transaction to finish for the given txHash,
 * returns a promise which is resolved when transaction finishes.
 * @param {string} txHash a string with transaction hash as value
 */
const waitForTxToFinish = (web3: Web3, txHash: string): Promise<TransactionReceipt> =>
  new Promise((resolve, reject) => {

    const waiter = async () => {
      try {
        const result = await web3.eth.getTransactionReceipt(txHash);

        if (result) {
          if (!result.status) {
            console.error(result);
            throw new Error('Transaction has failed');
          }

          resolve(result);
          return;
        }
      } catch (err) {
        reject(err);
        return;
      }

      setTimeout(waiter, 100);
    };

    waiter();
  });

export const createTxExecutor = (web3: Web3): TxExecutor => {
  return async (txData: TransactionConfig) => {
    const networkConfig = getNetworkConfig();
    if (typeof networkConfig.gas !== 'undefined') {
      txData.gas = networkConfig.gas
    }

    if (isPrivateTxMode && getNetwork() === NetworkType.Quorum) {
      return submitPrivateTransaction(web3, txData);
    }

    const tx = await submitTransaction(web3, txData);

    return waitForTxToFinish(web3, tx.hash);
  };
};
