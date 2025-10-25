import browser, { Scripting } from 'webextension-polyfill';
import { Injectable } from '@angular/core';
import { ScrapeService } from '../ScrapeService';
import { from, Observable } from 'rxjs';
import InjectionResult = Scripting.InjectionResult;

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

    let content: InjectionResult[];

    try {
      content = await browser.scripting.executeScript({
        target: { tabId: active.id ?? -1 },
        // Workaround for weird typescript typing. Expects a void
        // function, but we force it to accept a string function.
        func: (() =>
          document.documentElement.outerHTML) as unknown as () => void,
      });
    } catch (e) {
      return null;
    }
    const url = active.url;
    const html = content[0] ? (content[0].result as string) : null;
    if (!url || !html) return null;
    else return [url, html];
  }

  createForCurrentTab(): Observable<[string, string] | null> {
    return from(this.getWithInjectedScript());
  }
}
