export class Maybe<Y, N> {
  /**
   * The yes value.
   */
  private readonly y: Y | null;

  /**
   * The no value.
   */
  private readonly n: N | null;

  constructor(y: Y | null, n: N | null) {
    if (y == null && n == null) {
      throw new Error("Response can't be not yes and not no.");
    } else if (y != null && n != null) {
      throw new Error("Response can't be yes and no.");
    }

    this.y = y;
    this.n = n;
  }

  /**
   * Checks if the response is yes.
   */
  isYes(): boolean {
    return this.y != null;
  }

  /**
   * Checks if the response is no.
   */
  isNo(): boolean {
    return this.n != null;
  }

  /**
   * Gets the yes value.
   */
  yes(): Y {
    if (this.y == null) {
      throw new Error('Response is no, but yes was requested.');
    }
    return this.y;
  }

  /**
   * Gets the no value.
   */
  no(): N {
    if (this.n == null) {
      throw new Error('Response is yes, but no was requested.');
    }
    return this.n;
  }
}

/**
 * Creates a yes.
 * @param y The yes value.
 */
export function maybeYes<Y, N>(y: Y): Maybe<Y, N> {
  return new Maybe<Y, N>(y, null);
}

/**
 * Creates a no.
 * @param n The no value.
 */
export function maybeNo<Y, N>(n: N): Maybe<Y, N> {
  return new Maybe<Y, N>(null, n);
}
