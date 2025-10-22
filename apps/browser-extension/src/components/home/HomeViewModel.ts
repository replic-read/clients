import { Component, inject, OnInit } from '@angular/core';
import { ConfigService_Token } from '../../model/ConfigService';
import {
  Account,
  AccountState,
  AuthenticationService_Token,
  AuthUserGroup,
  RereError,
  ServerConfig,
  ServerConfigService_Token,
} from '@replic-read-clients/shared';
import { Router } from '@angular/router';
import { Maybe } from '../../../../../shared/src/lib/shared/model/maybe';
import { combineLatest, filter } from 'rxjs';

@Component({
  template: `<h1>Loading</h1>`,
})
export class HomeViewModel implements OnInit {
  private readonly configService = inject(ConfigService_Token);

  private readonly serverConfigService = inject(ServerConfigService_Token);

  private readonly auth = inject(AuthenticationService_Token);

  private readonly router = inject(Router);

  ngOnInit(): void {
    const config = this.configService.getConfig();

    // If no backend URL is set, the initial page is the endpoint-config.
    if (config.backendUrl == null) {
      this.router.navigate(['endpoint-config']);
      return;
    }

    const serverConfig$ = this.serverConfigService
      .getServerConfigObservable()
      .pipe(filter((res) => res != null));
    const account$ = this.auth.me();

    combineLatest([account$, serverConfig$]).subscribe(
      this.navigateToInitialPage
    );
  }

  private readonly navigateToInitialPage = ([account, serverConfig]: [
    Maybe<Account, RereError>,
    ServerConfig
  ]) => {
    const isAuth = account.isYes();
    const isVerified =
      account.isYes() && account.yes().accountState == AccountState.ACTIVE;

    let canCreateReplic = false;
    let shouldVerify = false;
    let shouldLogin = false;
    if (!isAuth) {
      canCreateReplic = serverConfig.createReplicsGroup == AuthUserGroup.ALL;
      shouldLogin = !canCreateReplic;
    } else if (isAuth && !isVerified) {
      canCreateReplic = [AuthUserGroup.ALL, AuthUserGroup.ACCOUNT].includes(
        serverConfig.createReplicsGroup
      );
      shouldVerify = !canCreateReplic;
    } else if (isVerified) {
      canCreateReplic = true;
    }

    let initialDestination: string | null = null;
    if (canCreateReplic) initialDestination = 'create-replic';
    if (shouldVerify) initialDestination = 'not-verified';
    if (shouldLogin) initialDestination = 'login';

    if (initialDestination != null) {
      this.router.navigate([initialDestination]);
    } else {
      console.warn(
        `Invalid auth state was detected for user: canCreateReplic: ${canCreateReplic}, shouldVerify: ${shouldVerify}, shouldLogin: ${shouldLogin}`
      );
    }
  };
}
