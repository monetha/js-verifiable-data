
const globalWindow: any = window;

const fetchEvents = async function (address) {

  const filter = globalWindow.web3.eth.filter({
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

  const events = await getAsync();
 
  return events;
};

export default fetchEvents;