"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aes_1 = require("./aes");
var chai_1 = require("chai");
describe('AES', function () {
    it('Should encrypt -> decrypt', function () {
        var message = 'Hello, world 🌎';
        var messageArr = Array.from(Buffer.from(message, 'utf8'));
        var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var encrypted = aes_1.aesEncrypt(key, messageArr);
        var decrypted = aes_1.aesDecrypt(key, encrypted);
        var decryptedStr = Buffer.from(decrypted).toString('utf8');
        chai_1.expect(decryptedStr).eq(message);
    });
});
//# sourceMappingURL=aes.test.js.map