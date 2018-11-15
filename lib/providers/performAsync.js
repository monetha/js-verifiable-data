
export default performAsync = function (promise) {
  return new Promise((resolve, reject) => {
    promise((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
}
