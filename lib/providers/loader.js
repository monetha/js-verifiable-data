
export default loader = function (trxHash) {
  return new Promise((resolve, reject) => {
    let result;
    const timeInterval = setInterval(async function () {
      try {
        result = await performAsync(window.web3.eth.getTransactionReceipt.bind(null, trxHash));
      } catch (err) {
        reject(err);
      }
      if (result) {
        clearInterval(timeInterval);
        resolve(result);
      }
    }, 1000);
  })
}