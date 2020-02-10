"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares strings with ignoring case sensitivity
 */
function ciEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.toLowerCase() === b.toLowerCase();
}
exports.ciEquals = ciEquals;
