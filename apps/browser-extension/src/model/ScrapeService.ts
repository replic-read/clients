import { from, Observable } from 'rxjs';

/**
 * Manages creating the raw HTML that is sent to the server as the replic content.
 */
export abstract class ScrapeService {
  /**
   * Creates the HTML content for the currently opened tab.
   */
  createForCurrentTab(): Observable<string> {
    return from(this.getCurrentTabContent());
  }

  /**
   * Gets the raw HTML content of the current tab.
   * This has not been preprocessed.
   */
  protected abstract getCurrentTabContent(): Promise<string>;
}
