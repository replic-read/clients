import { Component, inject, Injectable, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Account,
  AuthenticationService_Token,
  AuthTokenAccessor,
  ServerConfigService_Token,
} from '@replic-read-clients/shared';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import translationEN from '../../public/i18n/en.json';
import { ProfileCircle } from '../components/profile_circle/profile_circle';
import { NgOptimizedImage } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ConfigService_Token } from '../model/ConfigService';

@Injectable()
export class LocalStorageAuthTokenAccessor implements AuthTokenAccessor {
  getAccess(): string | null {
    return localStorage.getItem('access');
  }

  getRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  setAccess(access: string): void {
    return localStorage.setItem('access', access);
  }

  setRefresh(refresh: string): void {
    return localStorage.setItem('refresh', refresh);
  }
}

@Component({
  imports: [
    RouterModule,
    ProfileCircle,
    NgOptimizedImage,
    MatIcon,
    MatIconButton,
    TranslatePipe,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'browser-extension';

  /**
   * The current endpoint, or null.
   */
  protected endpoint: string | null = null;
  /**
   * The currently logged in account.
   */
  protected readonly account = signal<Account | null>(null);
  /**
   * Whether the back button should be visible.
   */
  protected readonly isBackButton = signal(false);
  /**
   * The translation service.
   */
  private readonly translation = inject(TranslateService);
  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);
  /**
   * The config service.
   */
  private readonly configService = inject(ConfigService_Token);
  /**
   * The server config service.
   */
  private readonly serverConfigService = inject(ServerConfigService_Token);
  /**
   * The router.
   */
  private readonly router = inject(Router);

  constructor() {
    this.translation.addLangs(['en', 'de']);
    this.translation.setFallbackLang('en');
    this.translation.setTranslation('en', translationEN);
  }

  goBack() {
    this.router.navigate(['']);
  }

  toggleAccountMenuVisibility() {}

  logout() {
    this.auth.logout();
    this.goBack();
  }

  showAccount() {}

  showAbout() {}

  ngOnInit(): void {
    this.configService
      .getConfig$()
      .subscribe((config) => (this.endpoint = config.backendUrl));

    this.configService.refresh(() => {
      this.serverConfigService.refresh(() => {});

      this.auth.me().subscribe((acc) => {
        if (acc.isYes()) this.account.set(acc.yes());
        else this.account.set(null);
      });
    })
  }
}
