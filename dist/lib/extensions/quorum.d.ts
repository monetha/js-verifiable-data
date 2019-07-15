import Web3 from 'web3';
import { Transaction } from 'web3-core';
/**
 * Gets transaction by hash and converts tx to a form, which was just after signing the tx with private key.
 * This includes modifying transaction's `v` field to its original value (because Quorum SDK modifies it for private transactions)
 * so that it would be possible to recover sender's public key from transaction data.
 */
export declare function getSignedPrivateTx(txHash: string, web3: Web3): Promise<Transaction>;
/**
 * Decodes Quorum's private transaction.
 *
 * It uses private data hash from "input" field and replaces it
 * with decoded data that comes from calling `eth_getQuorumPayload` RPC method.
 * Provided web3 object must use provider which is connected to Quorum node which is a party to this private tx.
 */
export declare function decodePrivateTx(tx: Transaction, web3: Web3): Promise<Transaction>;
