import axios from 'axios';

//method to fetch all the vents corresponding to specific address from block 0 to latest
const fetchEvents = async function (fromBlock: string, toBlock: string,  address: string, url: string) {
  const requestData = {
    id:1,
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: fromBlock,
        toBlock: toBlock,
        address,
      }
    ],
  };

  const response = await axios.post(url, requestData);
 
  return response.data.result;
};

export default fetchEvents;
