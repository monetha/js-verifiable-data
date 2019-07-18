import { ErrorCode, ISdkError } from 'verifiable-data';

export async function expectSdkError(func: () => Promise<any>, code: ErrorCode) {
  try {
    await func();
  } catch (err) {
    expect((err as ISdkError).sdkErrorCode).to.eq(code);
    return;
  }

  assert.fail('No error was thrown');
}
