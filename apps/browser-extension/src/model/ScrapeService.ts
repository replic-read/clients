import { Observable } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { WebExtScrapeService } from './internal/WebExtScrapeService';

/**
 * Manages creating the raw HTML that is sent to the server as the replic content.
 */
export interface ScrapeService {
  /**
   * Creates the HTML content for the currently opened tab.
   */
  createForCurrentTab(): Observable<[string, string]|null>;
}

export const ScrapeService_Token = new InjectionToken<ScrapeService>(
  'ScrapeService',
  {
    providedIn: 'root',
    factory: () => inject(WebExtScrapeService),
  }
);
