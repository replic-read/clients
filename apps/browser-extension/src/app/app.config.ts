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
import { WebExtConfigService } from '../model/internal/WebExtConfigService';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfigService_Token } from '../model/ConfigService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
    }),
    WebExtConfigService,
    {
      provide: BaseUrlSupplier_Token,
      useExisting: WebExtConfigService,
    },
    {
      provide: ConfigService_Token,
      useExisting: WebExtConfigService,
    },
    {
      provide: AuthTokenAccessor_Token,
      useClass: LocalStorageAuthTokenAccessor,
    },
  ],
};
