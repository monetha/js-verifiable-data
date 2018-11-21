import performAsync from './performAsync';

const globalWindow: any = window;

const loader = function (trxHash: string) {
  return new Promise((resolve, reject) => {
    let result;
    const timeInterval = setInterval(async function () {
      try {
        result = await performAsync(globalWindow.web3.eth.getTransactionReceipt.bind(null, trxHash));
      } catch (err) {
        clearInterval(timeInterval);
        reject(err);
      }
      if (result) {
        clearInterval(timeInterval);
        resolve(result);
      }
    }, 1000);
  })
}

export default loader