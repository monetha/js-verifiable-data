import { TransasctionReceipt } from '@harmony-js/transaction';
import { IConfiguredContractMethod } from './Method';

export type TxExecutor = (cfgMethod: IConfiguredContractMethod) => Promise<TransasctionReceipt>;
