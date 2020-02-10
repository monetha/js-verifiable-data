import { TransasctionReceipt } from '@harmony-js/transaction';
import { createSdkError } from 'lib/errors/SdkError';
import { ContractMethod, IConfiguredContractMethod, ITxConfig } from 'lib/models/Method';
import { ErrorCode } from 'verifiable-data';

export async function submitContractTransaction(method: ContractMethod, txConfig: ITxConfig): Promise<TransasctionReceipt> {
  return new Promise(async (resolve, reject) => {
    try {
      if (txConfig.from) {
        method.wallet.setSigner(txConfig.from);
      }

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

export const createTxExecutor = () => {
  return async (cfgMethod: IConfiguredContractMethod): Promise<TransasctionReceipt> => {
    return submitContractTransaction(cfgMethod.method, cfgMethod.txConfig);
  };
};
