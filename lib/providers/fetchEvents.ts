const fetchEvents = async function (address, web4) {

  const filter = web4.eth.filter({
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