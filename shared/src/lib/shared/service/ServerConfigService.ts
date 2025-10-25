import { AuthUserGroup, Period, Refreshable, ReplicLimitConfig, ServerConfig } from '@replic-read-clients/shared';
import { Observable } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { NetworkServerConfigService } from './internal/NetworkServerConfigService';

/**
 * Provides access to the config of the server.
 */
export interface ServerConfigService extends Refreshable {
  getServerConfig(): ServerConfig | null;

  getServerConfigOrThrow(): ServerConfig;

  /**
   * Gets the server config.
   */
  getServerConfigObservable(): Observable<ServerConfig | null>;

  /**
   * Sets the create replics group.
   */
  setCreateReplicsGroup(group: AuthUserGroup): Observable<boolean>;

  /**
   * Sets the access replics group.
   */
  setAccessReplicsGroup(group: AuthUserGroup): Observable<boolean>;

  /**
   * Sets the create reports group.
   */
  setCreateReportsGroup(group: AuthUserGroup): Observable<boolean>;

  /**
   * Sets the replic limit.
   */
  setReplicLimit(limit: ReplicLimitConfig): Observable<boolean>;

  /**
   * Sets whether signups are allowed.
   */
  setAllowSignup(allow: boolean): Observable<boolean>;

  setMaximumActivePeriod(period: Period): Observable<boolean>;

  /**
   * Shuts the server down.
   */
  shutdown(): Observable<boolean>;
}

export const ServerConfigService_Token =
  new InjectionToken<ServerConfigService>('ServerConfigService', {
    providedIn: 'root',
    factory: () => inject(NetworkServerConfigService),
  });
