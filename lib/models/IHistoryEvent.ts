import { Address } from './Address';

export interface IHistoryEvent {
  blockNumber: number;
  transactionHash: string;

  /**
   * Fact provider which made the change
   */
  factProviderAddress: Address;

  /**
   * Key that was changed
   */
  key: string;
}
