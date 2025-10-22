import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  AuthTokenAccessor_Token,
  BaseUrlSupplier_Token,
} from '@replic-read-clients/shared';
import { BrowserBaseUrlSupplier, LocalStorageAuthTokenAccessor } from './app';
import { routes } from '../navigation/routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
