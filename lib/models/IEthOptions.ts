import { TxRetriever } from './TxRetriever';
import { TxDecoder } from './TxDecoder';

export interface IEthOptions {

  /**
   * Custom signed transaction retriever. This method shall be provided if SDK is used with a type of blockchain, which modifies
   * signed transaction in some way before submitting it to blockchain or there is a non-standard way to retrieve transaction.
   *
   * For example, when using Quorum blockchain to submit private transaction - it modifies signed transaction's "v" value to 37 or 38,
   * while originally it was 27 or 28 just after signing. This modification makes it impossible to recover signer's public key from raw transaction
   * which is needed for this SDK to work correctly. Therefore this method should be used to get transaction and
   * revert its "v" value from 37/38 to 27/28 or similar.
   */
  signedTxRetriever?: TxRetriever;

  /**
   * Custom signed transaction decoder. This method shall be provided if SDK is used with a type of blockchain,
   * which encodes some parts of transaction payload.
   *
   * For example, when using Quorum blockchain to submit private transaction - it replaces input data field with a hash before submitting
   * transaction to blockchain. This makes transaction data unreadable by anyone except for private tx participants. Private tx participants
   * can decode transaction input data by calling `eth_getQuorumPayload` and providing this input hash.
   * Therefore this method should take care of calling `eth_getQuorumPayload` and return transaction with decoded input data field.
   */
  txDecoder?: TxDecoder;
}
