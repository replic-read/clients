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
import { LocalStorageAuthTokenAccessor } from './app';
import { routes } from '../navigation/routes';
import { provideTranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
    }),
    {
      provide: BaseUrlSupplier_Token,
      useClass: WebExtConfigServic,
    },
    {
      provide: AuthTokenAccessor_Token,
      useClass: LocalStorageAuthTokenAccessor,
    },
  ],
};
