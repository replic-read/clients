/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { ScrapeService } from '../ScrapeService';

@Injectable({
  providedIn: 'root',
})
export class ChromeScrapeService extends ScrapeService {
  protected async getCurrentTabContent(): Promise<string> {
    const injectionResults = await this.getWithInjectedScript();
    return injectionResults[0].result ?? '';
  }

  private async getWithInjectedScript() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const active = tabs[0];

    return chrome.scripting.executeScript({
      target: { tabId: active.id ?? -1 },
      func: () => {
        return document.documentElement.outerHTML;
      },
    });
  }
}
