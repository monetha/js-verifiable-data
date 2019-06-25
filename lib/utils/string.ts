/**
 * Compares strings with ignoring case sensitivity
 */
export function ciEquals(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.toLowerCase() === b.toLowerCase();
}
