"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Makes sure that 0x prefix is added to address
 * @param address
 */
function sanitizeAddress(address) {
    if (!address) {
        return address;
    }
    if (address.indexOf('0x') !== 0) {
        return "0x" + address;
    }
}
exports.sanitizeAddress = sanitizeAddress;
//# sourceMappingURL=sanitizeAddress.js.map