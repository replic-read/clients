import { InjectionToken } from '@angular/core';

/**
 * Supplier interface for the base url.
 */
export interface BaseUrlSupplier {
  /**
   * Returns the base url.
   */
  supply: () => string;
}

export const BaseUrlSupplier_Token = new InjectionToken<BaseUrlSupplier>(
  'BaseUrlSupplier'
);
