import {
  ApplicationConfig,
  inject,
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
import { WebExtConfigService } from '../model/internal/WebExtConfigService';

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
      useFactory: () => inject(WebExtConfigService),
    },
    {
      provide: AuthTokenAccessor_Token,
      useClass: LocalStorageAuthTokenAccessor,
    },
  ],
};
