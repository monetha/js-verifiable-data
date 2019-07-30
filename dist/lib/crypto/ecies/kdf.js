"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var hash_js_1 = require("hash.js");
var big2To32 = new bn_js_1.default(2).pow(new bn_js_1.default(32));
var big2To32M1 = big2To32.sub(new bn_js_1.default(1));
/**
 * NIST SP 800-56 Concatenation Key Derivation Function (see section 5.8.1).
 */
function concatKDF(hashConstr, msg, seed, kdLength) {
    var s1 = seed ? Array.from(seed) : [];
    var hasher = hashConstr();
    var reps = Math.floor(((kdLength + 7) * 8) / (hasher.blockSize));
    if (new bn_js_1.default(reps).cmp(big2To32M1) > 0) {
        throw new Error('Key data is too long');
    }
    var counter = [0, 0, 0, 1];
    var key = [];
    var zArr = Array.from(msg);
    for (var i = 0; i <= reps; i += 1) {
        var payload = counter.concat(zArr, s1);
        var digest = hash_js_1.sha256().update(payload).digest();
        key.push.apply(key, digest);
        incCounter(counter);
        hasher = hashConstr();
    }
    return key.slice(0, kdLength);
}
exports.concatKDF = concatKDF;
function incCounter(counter) {
    for (var i = 3; i >= 0; i -= 1) {
        counter[i] += 1;
        if (counter[i] > 255) {
            counter[i] = 0;
        }
        if (counter[i] !== 0) {
            return;
        }
    }
}
//# sourceMappingURL=kdf.js.map