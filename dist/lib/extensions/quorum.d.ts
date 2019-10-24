import { ITxWithMeta } from '../models/TxRetriever';
import { IWeb3 } from '../models/IWeb3';
/**
 * Gets transaction by hash and converts tx to a form, which was just after signing the tx with private key.
 * This includes modifying transaction's `v` field to its original value (because Quorum SDK modifies it for private transactions)
 * so that it would be possible to recover sender's public key from transaction data.
 */
export declare function getPrivateTx(txHash: string, anyWeb3: IWeb3): Promise<ITxWithMeta>;
