import { ErrorCode } from 'lib/errors/ErrorCode';
import { ISdkError } from 'lib/errors/SdkError';

export async function expectSdkError(func: () => Promise<any>, code: ErrorCode) {
  try {
    await func();
    assert.fail('No error was thrown');
  } catch (err) {
    expect((err as ISdkError).sdkErrorCode).to.eq(code);
  }
}
