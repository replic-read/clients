import browser from 'webextension-polyfill';
import { Injectable } from '@angular/core';
import { ScrapeService } from '../ScrapeService';

@Injectable({
  providedIn: 'root',
})
export class WebExtScrapeService extends ScrapeService {
  protected async getCurrentTabContent(): Promise<string> {
    const injectionResults = await this.getWithInjectedScript();
    return (injectionResults[0].result as string) ?? '';
  }

  private async getWithInjectedScript() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const active = tabs[0];

    return browser.scripting.executeScript({
      target: { tabId: active.id ?? -1 },
      // Workaround for weird typescript typing. Expects a void
      // function, but we force it to accept a string function.
      func: (() => document.documentElement.outerHTML) as unknown as () => void,
    });
  }
}
