import { InjectionToken } from '@angular/core';

/**
 * Gives access to auth tokens.
 */
export interface AuthTokenAccessor {
  /**
   * Sets the access token.
   */
  setAccess: (access: string) => void;

  /**
   * Sets the refresh token.
   */
  setRefresh: (refresh: string) => void;

  /**
   * Gets the access token.
   */
  getAccess: () => string | null;

  /**
   * Gets the refresh token.
   */
  getRefresh: () => string | null;
}

export const AuthTokenAccessor_Token = new InjectionToken<AuthTokenAccessor>(
  'AuthTokenAccessor'
);
