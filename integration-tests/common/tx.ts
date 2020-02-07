import { Harmony } from '@harmony-js/core';
import { TransasctionReceipt } from '@harmony-js/transaction';
import { ContractMethod, IConfiguredContractMethod, ITxConfig } from 'lib/models/Method';
import { createSdkError } from 'lib/errors/SdkError';
import { ErrorCode } from 'verifiable-data';

export async function submitTransaction(harmony: Harmony, method: ContractMethod, txConfig: ITxConfig): Promise<TransasctionReceipt> {
  return new Promise(async (resolve, reject) => {
    try {
      await method
        .send(txConfig)
        .on('receipt', receipt => {
          if (receipt.status === '0x0') {
            reject(createSdkError(ErrorCode.TxReverted, `Transaction ${receipt.transactionHash} failed and has been reverted`));
            return;
          }

          resolve(receipt);
        })
        .on('error', error => {
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
}

export const createTxExecutor = (harmony: Harmony) => {
  return async (cfgMethod: IConfiguredContractMethod): Promise<TransasctionReceipt> => {
    return submitTransaction(harmony, cfgMethod.method, cfgMethod.txConfig);
  };
};
