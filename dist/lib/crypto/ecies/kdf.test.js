"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var kdf_1 = require("./kdf");
var hash_js_1 = require("hash.js");
describe('KDF', function () {
    it('Validate concatenation KDF', function () {
        var msg = Buffer.from('Hello, world', 'utf8');
        var key = kdf_1.concatKDF(hash_js_1.sha256, msg, null, 64);
        chai_1.expect(Buffer.from(key).toString('hex'), 'Invalid generated key').to.equal('746b4476aa0751884c9cb3fa41d2ebc64ed2d7f0fe7acd53ad7381b13c87acddc5c6762ceddb9731e2d77d3d78325e40e660ac64762bf1e68030d607be9a7d8a');
    });
});
