import { TxRetriever } from './TxRetriever';

export interface IEthOptions {

  /**
   * Custom signed transaction retriever. This method shall be provided if SDK is used with a type of blockchain, which modifies
   * signed transaction in some way before submitting it to blockchain or there is a non-standard way to retrieve transaction.
   *
   * For example, when using Quorum blockchain to submit private transaction - it modifies signed transaction's "v" value to 37 or 38,
   * while originally it was 27 or 28 just after signing. This modification makes it impossible to recover signer's public key from raw transaction
   * which is needed for this SDK to work correctly. Also - transaction payload is encrypted.
   * Therefore this method should be used to get transaction, recover its public key and decrypt payload.
   */
  txRetriever?: TxRetriever;
}
