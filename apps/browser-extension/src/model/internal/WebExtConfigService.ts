import { ConfigService } from '../ConfigService';
import { BaseUrlSupplier } from '@replic-read-clients/shared';
import { Config } from '../Config';
import { BehaviorSubject, from, Observable } from 'rxjs';
import browser from 'webextension-polyfill';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebExtConfigService implements ConfigService, BaseUrlSupplier {
  private static readonly KEY_BACKEND_URL =
    'com.rere.client.active.key.backend_url';
  private readonly config$ = new BehaviorSubject<Config>({
    backendUrl: null,
  });

  supply(): string | null {
    return this.getConfig().backendUrl;
  }

  getConfig(): Config {
    return this.config$.value;
  }

  setBackendUrl(url: string | null): void {
    browser.storage.local.set({
      [WebExtConfigService.KEY_BACKEND_URL]: url,
    });
    this.refresh(() => {});
  }

  getConfig$(): Observable<Config> {
    return this.config$;
  }

  refresh(onDone: () => void): void {
    from(
      browser.storage.local.get([WebExtConfigService.KEY_BACKEND_URL])
    ).subscribe((results) => {
      const config: Config = {
        backendUrl: (results[WebExtConfigService.KEY_BACKEND_URL] ??
          null) as sring | null,
      };
      this.config$.next(config);
      onDone();
    });
  }
}
