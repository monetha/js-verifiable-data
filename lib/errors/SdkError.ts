import { ErrorCode } from './ErrorCode';

export interface ISdkError extends Error {
  sdkErrorCode: ErrorCode;
}

export function createSdkError(code: ErrorCode, message?: string, rawError?: Error): ISdkError {
  let error: Partial<ISdkError> = rawError;
  if (!error) {
    error = new Error(message);
  }

  error.sdkErrorCode = code;

  if (message) {
    error.message = message;
  }

  return error as ISdkError;
}
