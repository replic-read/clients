import { Component, inject, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  Account,
  AccountState,
  AuthenticationService_Token,
  AuthUserGroup,
  RereError,
  ServerConfig,
  ServerConfigService_Token
} from '@replic-read-clients/shared';
import { Config } from '../../model/Config';
import { ConfigService_Token } from '../../model/ConfigService';
import { Router } from '@angular/router';
import { Maybe } from '../../../../../shared/src/lib/shared/model/maybe';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * Component that acts as a dispatching component, i.e. receives requests to bounce them back to other components.
 */
@Component({
  templateUrl: 'home.html',
  styleUrl: 'home.scss',
  imports: [MatProgressSpinner],
})
export class HomeViewModel implements OnInit {
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

  ngOnInit(): void {
    this.configService.refresh(() => {
      this.serverConfigService.refresh(() => {});

      const config$ = this.configService.getConfig$();

      const serverConfig$ =
        this.serverConfigService.getServerConfigObservable();

      const account$ = this.auth.me();

      combineLatest([account$, serverConfig$, config$]).subscribe(
        this.navigateToInitialPage
      );
    });
  }

  private readonly navigateToInitialPage = ([account, serverConfig, config]: [
    Maybe<Account, RereError>,
    ServerConfig | null,
    Config
  ]) => {
    let initialDestination: string | null = null;

    const isAuth = account.isYes();
    const isVerified =
      account.isYes() && account.yes().accountState == AccountState.ACTIVE;

    let canCreateReplic = false;
    let shouldVerify = false;
    let shouldLogin = false;
    if (!isAuth) {
      canCreateReplic = serverConfig?.createReplicsGroup == AuthUserGroup.ALL;
      shouldLogin = !canCreateReplic;
    } else if (isAuth && !isVerified) {
      canCreateReplic =
        serverConfig != null &&
        [AuthUserGroup.ALL, AuthUserGroup.ACCOUNT].includes(
          serverConfig.createReplicsGroup
        );
      shouldVerify = !canCreateReplic;
    } else if (isVerified) {
      canCreateReplic = true;
    }

    if (!config.backendUrl) initialDestination = 'endpoint-config';
    else if (canCreateReplic) initialDestination = 'create-replic';
    else if (shouldVerify) initialDestination = 'not-verified';
    else if (shouldLogin) initialDestination = 'login';

    if (initialDestination != null) {
      this.router.navigate([initialDestination]);
    } else {
      console.warn(
        `Invalid auth state was detected for user: canCreateReplic: ${canCreateReplic}, shouldVerify: ${shouldVerify}, shouldLogin: ${shouldLogin}`
      );
    }
  };
}
