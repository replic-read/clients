import { ServerConfigService } from '../ServerConfigService';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { AuthUserGroup, PeriodUnit } from '../../model/enums';
import { Period, ReplicLimitConfig, ServerConfig } from '../../model/models';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService_Token } from '../../authentication/AuthenticationService';
import { NetworkClient_Token } from '../../network-client/client';
import { ServerConfigRequest } from '../../network-client/requests';
import { Duration } from 'luxon';
import { convertConfig } from './mapping';
import { convertError } from '../../authentication/internal/mapping';
import { RereError } from '@replic-read-clients/shared';
import { toMaybe } from '../../authentication/internal/NetworkAuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class NetworkServerConfigService implements ServerConfigService {
  /**
   * The api.
   */
  private readonly api = inject(NetworkClient_Token);

  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);

  private readonly config$ = new BehaviorSubject<ServerConfig | null>(null);

  getServerConfig(): ServerConfig {
    if (this.config$.value == null) {
      throw new Error(
        'Tried to access the server config asynchronously before it was set.'
      );
    } else {
      return this.config$.value;
    }
  }

  getServerConfigObservable(): Observable<ServerConfig | null> {
    return this.config$;
  }

  refresh(onDone: () => void) {
    const configCall = () =>
      this.api
        .getServerConfig()
        .pipe(
          map(convertConfig),
          toMaybe<ServerConfig, RereError>(convertError)
        );

    this.auth.safe(configCall).subscribe((maybe) => {
      if (maybe.isYes()) {
        this.config$.next(maybe.yes());
      }
      onDone();
    });
  }

  setAccessReplicsGroup(group: AuthUserGroup): Observable<boolean> {
    return this.updateConfig({
      access_replic_group: group,
    });
  }

  setAllowSignup(allow: boolean): Observable<boolean> {
    return this.updateConfig({
      allow_signup: allow,
    });
  }

  setCreateReplicsGroup(group: AuthUserGroup): Observable<boolean> {
    return this.updateConfig({
      create_replic_group: group,
    });
  }

  setCreateReportsGroup(group: AuthUserGroup): Observable<boolean> {
    return this.updateConfig({
      create_report_group: group,
    });
  }

  setReplicLimit(limit: ReplicLimitConfig | null): Observable<boolean> {
    return this.updateConfig({
      replic_limit_count: limit?.count ?? null,
      replic_limit_period: limit?.period
        ? this.createLuxonDuration(limit.period).toISO()
        : null,
    });
  }

  setMaximumActivePeriod(period: Period | null): Observable<boolean> {
    return this.updateConfig({
      maximum_expiration_period: period
        ? this.createLuxonDuration(period).toISO()
        : null,
    });
  }

  shutdown(): Observable<boolean> {
    const shutdownCall = () =>
      this.api.shutdown().pipe(
        map(() => true),
        catchError(() => of(false))
      );

    return this.auth.safe(shutdownCall);
  }

  private createRequest(config: ServerConfig): ServerConfigRequest {
    return {
      create_replic_group: config.createReplicsGroup,
      access_replic_group: config.accessReplicsGroup,
      create_report_group: config.createReportGroup,
      allow_signup: config.allowAccountCreation,
      maximum_expiration_period: config.maximumActivePeriod
        ? this.createLuxonDuration(config.maximumActivePeriod).toISO()
        : null,
      replic_limit_count: config.limit?.count ?? null,
      replic_limit_period: config.limit?.period
        ? this.createLuxonDuration(config.limit.period).toISO()
        : null,
    };
  }

  private createLuxonDuration(period: Period): Duration {
    return Duration.fromObject({
      day: period.unit == PeriodUnit.DAY ? period.length : undefined,
      month: period.unit == PeriodUnit.MONTH ? period.length : undefined,
      year: period.unit == PeriodUnit.YEAR ? period.length : undefined,
    });
  }

  private updateConfig(
    change: Partial<ServerConfigRequest>
  ): Observable<boolean> {
    const configCall = () =>
      this.api
        .setServerConfig({
          ...this.createRequest(this.getServerConfig()),
          ...change,
        })
        .pipe(
          map(() => true),
          catchError(() => of(false))
        );

    this.refresh(() => {});

    return this.auth.safe(configCall);
  }
}
