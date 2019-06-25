import { ErrorCode } from './ErrorCode';
export interface ISdkError extends Error {
    sdkErrorCode: ErrorCode;
}
export declare function createSdkError(code: ErrorCode, message?: string, rawError?: Error): ISdkError;
