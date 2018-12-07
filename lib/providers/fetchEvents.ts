import axios from 'axios';
import { INFURA_END_POINT } from '../../config/constants';

const fetchEvents = async function (address, web4) {
  const requestData = {
    id:1,
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "0x6c6174657374",
        address,
      }
    ],
  };

  const response = await axios.post(INFURA_END_POINT, requestData);
 
  return response.data.result;
};

export default fetchEvents;
