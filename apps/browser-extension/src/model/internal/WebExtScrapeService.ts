import browser from 'webextension-polyfill';
import { Injectable } from '@angular/core';
import { ScrapeService } from '../ScrapeService';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebExtScrapeService implements ScrapeService {
  private async getWithInjectedScript(): Promise<[string, string] | null> {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const active = tabs[0];

    const content = await browser.scripting.executeScript({
      target: { tabId: active.id ?? -1 },
      // Workaround for weird typescript typing. Expects a void
      // function, but we force it to accept a string function.
      func: (() => document.documentElement.outerHTML) as unknown as () => void,
    });
    const url = active.url;
    return [url ?? '', content[0].result as string];
  }

  createForCurrentTab(): Observable<[string, string] | null> {
    return from(this.getWithInjectedScript());
  }
}
