"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hash_js_1 = require("hash.js");
/**
 * computes the MAC of a message (called the tag) as per
 * SEC 1, 3.5.
 */
function getMessageTag(hashConstr, hmacKey, msg, sharedKey) {
    var mac = hash_js_1.hmac(hashConstr, hmacKey);
    var tag = mac.update(msg.concat((sharedKey || []))).digest();
    return tag;
}
exports.getMessageTag = getMessageTag;
//# sourceMappingURL=hmac.js.map