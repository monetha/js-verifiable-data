import performAsync from './performAsync';

const globalWindow: any = window;
interface IReturn {
  "res": any;
  "err": any;
}
const loader = function (trxHash: string): Promise<IReturn> {
  return new Promise((resolve, reject) => {
    let txResult;
    let result: IReturn = {"res": null, "err": null};

    const timeInterval = setInterval(async function () {
      try {
        txResult = await performAsync(globalWindow.web3.eth.getTransactionReceipt.bind(null, trxHash));
      } catch (err) {
        clearInterval(timeInterval);
        result.err = err;
        reject(result);
      }
      if (txResult) {
        clearInterval(timeInterval);
        result.res = txResult;
        resolve(result);
      }
    }, 1000);
  })
}

export default loader