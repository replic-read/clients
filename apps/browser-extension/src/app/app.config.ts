import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BaseUrlSupplier_Token } from '@replic-read-clients/shared';
import { BrowserBaseUrlSupplier, LocalStorageAuthTokenAccessor } from './app';
import { AuthTokenAccessor_Token } from '../../../../shared/src/lib/shared/network-client/AuthTokenAccessor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: BaseUrlSupplier_Token,
      useClass: BrowserBaseUrlSupplier,
    },
    {
      provide: AuthTokenAccessor_Token,
      useClass: LocalStorageAuthTokenAccessor,
    },
  ],
};
