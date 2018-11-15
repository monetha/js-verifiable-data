
export default fetchEvents = async function (address) {

  var filter = window.web3.eth.filter({
    fromBlock: 0,
    toBlock: 'latest',
    address: address
  });

  const getAsync = () => new Promise((resolve, reject) => {
    filter.get((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })

  var events = await getAsync();
 
  return events;
};