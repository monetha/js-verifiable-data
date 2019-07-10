import Web3 from 'web3';
import { Transaction, RLPEncodedTransaction } from 'web3-core';
import { toBN } from 'lib/utils/conversion';

/**
 * Gets transaction by hash and converts tx to a form, which was just after signing the tx with private key.
 * This includes modifying transaction's `v` field to its original value (because Quorum SDK modifies it for private transactions)
 * so that it would be possible to recover sender's public key from transaction data.
 */
export async function getSignedPrivateTx(txHash: string, web3: Web3): Promise<Transaction> {
  const tx: RLPEncodedTransaction['tx'] = await web3.eth.getTransaction(txHash) as any;

  const v = toBN(tx.v);
  const privateV1 = toBN('0x25');
  const privateV2 = toBN('0x26');

  if (v.eq(privateV1) || v.eq(privateV2)) {
    tx.v = `0x${v.sub(toBN('0xa')).toString(16)}`;
  }

  return tx as any as Transaction;
}

/**
 * Decodes Quorum's private transaction.
 *
 * It uses private data hash from "input" field and replaces it
 * with decoded data that comes from calling `eth_getQuorumPayload` RPC method.
 * Provided web3 object must use provider which is connected to Quorum node which is a party to this private tx.
 */
export async function decodePrivateTx(tx: Transaction, web3: Web3): Promise<Transaction> {

  const decodedTx = {
    ...tx,

    // Input is only a hash. Decode it using `eth_getQuorumPayload`
    input: await web3.currentProvider.send('eth_getQuorumPayload', [tx.input]),
  };

  return decodedTx;
}
