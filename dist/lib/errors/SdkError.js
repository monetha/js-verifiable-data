"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createSdkError(code, message, rawError) {
    var error = rawError;
    if (!error) {
        error = new Error(message);
    }
    error.sdkErrorCode = code;
    if (message) {
        error.message = message;
    }
    return error;
}
exports.createSdkError = createSdkError;
//# sourceMappingURL=SdkError.js.map