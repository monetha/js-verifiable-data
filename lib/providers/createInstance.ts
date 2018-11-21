import baseContract from './Ethereum';

const createInstance = function (abi: any, atAddress: string) {
  const contract = new baseContract( abi).getContract();
  const contractInstance = contract.at(atAddress);

  return contractInstance;
}

export default createInstance;