
var globalWindow: any = window;

var fetchEvents = async function (address) {

  var filter = globalWindow.web3.eth.filter({
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

export default fetchEvents;