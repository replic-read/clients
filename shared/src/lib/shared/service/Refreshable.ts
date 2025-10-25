/**
 * Services implement this interface to show they can refreshtheir data.
 */
export interface Refreshable {
  /**
   * Refreshes the data.
   */
  refresh(): Promise<void>;
}
