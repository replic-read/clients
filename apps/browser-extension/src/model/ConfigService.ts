import { Config } from './Config';
import { Observable } from 'rxjs';
import { Refreshable } from '@replic-read-clients/shared';
import { inject, InjectionToken } from '@angular/core';
import { WebExtConfigService } from './internal/WebExtConfigService';

/**
 * Service for the client side config.
 */
export interface ConfigService extends Refreshable {
  /**
   * Gets the current config.
   */
  getConfig(): Config;

  /**
   * Gets the current config.
   */
  getConfig$(): Observable<Config>;

  /**
   * Sets the new backend url.
   */
  setBackendUrl(url: string): void;
}

export const ConfigService_Token = new InjectionToken<ConfigService>(
  'ConfigService',
  {
    providedIn: 'root',
    factory: () => inject(WebExtConfigService),
  }
);
