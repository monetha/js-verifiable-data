let isVerbose: boolean = null;

export function isVerboseMode() {
  if (isVerbose !== null) {
    return isVerbose;
  }

  for (const arg of process.argv) {
    if (arg === '--verbose') {
      isVerbose = true;
      return isVerbose;
    }
  }

  isVerbose = false;
  return isVerbose;
}

export function logVerbose(...arg: string[]) {
  if (!isVerboseMode()) {
    return;
  }

  console.log(...arg);
}
