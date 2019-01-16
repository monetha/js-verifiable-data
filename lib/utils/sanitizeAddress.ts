/**
 * Makes sure that 0x prefix is added to address
 * @param address
 */
export function sanitizeAddress(address) {
  if (!address) {
    return address;
  }

  if (address.indexOf('0x') !== 0) {
    return `0x${address}`;
  }
}
