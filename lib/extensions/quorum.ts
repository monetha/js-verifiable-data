import { Transaction, RLPEncodedTransaction } from 'web3-core';
import { toBN } from 'lib/utils/conversion';
import { getSenderPublicKey } from 'lib/utils/tx';
import { ITxWithMeta } from 'lib/models/TxRetriever';
import { IWeb3 } from 'lib/models/IWeb3';
import Web3 from 'web3';

/**
 * Gets transaction by hash and converts tx to a form, which was just after signing the tx with private key.
 * This includes modifying transaction's `v` field to its original value (because Quorum SDK modifies it for private transactions)
 * so that it would be possible to recover sender's public key from transaction data.
 */
export async function getPrivateTx(txHash: string, anyWeb3: IWeb3): Promise<ITxWithMeta> {
  const web3 = new Web3(anyWeb3.eth.currentProvider);
  const tx: RLPEncodedTransaction['tx'] = await web3.eth.getTransaction(txHash) as any;

  // Restore v value
  const v = toBN(tx.v);
  const privateV1 = toBN('0x25');
  const privateV2 = toBN('0x26');

  if (v.eq(privateV1) || v.eq(privateV2)) {
    tx.v = `0x${v.sub(toBN('0xa')).toString(16)}`;
  }

  // Save public key as it is valid after v correction
  const senderPublicKey = getSenderPublicKey(tx);

  // Decode input field
  const decodedTx = {
    ...tx,

    // Input is only a hash. Decode it using `eth_getQuorumPayload`
    input: await web3.currentProvider.send('eth_getQuorumPayload', [tx.input]),
  };

  return {
    senderPublicKey,
    tx: decodedTx as any as Transaction,
  };
}
