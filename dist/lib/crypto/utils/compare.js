"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if and only if the two arrays have equal contents.
 * The time taken is a function of the length of the arrays and is independent of the contents.
 */
function constantTimeCompare(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    var mismatch = 0;
    for (var i = 0; i < a.length; i += 1) {
        // tslint:disable-next-line: no-bitwise
        mismatch |= a[i] ^ b[i];
    }
    return mismatch === 0;
}
exports.constantTimeCompare = constantTimeCompare;
//# sourceMappingURL=compare.js.map