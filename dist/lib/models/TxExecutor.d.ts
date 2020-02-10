import { TransasctionReceipt } from '@harmony-js/transaction';
import { IConfiguredContractMethod } from './Method';
export declare type TxExecutor = (cfgMethod: IConfiguredContractMethod) => Promise<TransasctionReceipt>;
