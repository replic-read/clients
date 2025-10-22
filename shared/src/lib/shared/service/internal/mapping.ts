import {
  PartialAccount,
  Period,
  Replic,
  ReplicLimitConfig,
  ServerConfig,
} from '../../model/models';
import {
  PartialAccountResponse,
  ReplicResponse,
  ServerConfigResponse,
} from '../../network-client/responses';
import { PeriodUnit } from '../../model/enums';
import { UpdateEmailError, UpdateUsernameError } from './errors';
import { Observable, of } from 'rxjs';
import { Maybe, maybeNo } from '../../model/maybe';
import { HttpErrorResponse } from '@angular/common/http';
import { convertError } from '../../authentication/internal/mapping';
import { Duration } from 'luxon';

export const convertPartialAccountResponse = (
  res: PartialAccountResponse
): PartialAccount => ({
  ...res,
  profileColor: res.profile_color,
  id: res.account_id,
});

export const convertUpdateUsernameError = <T>(
  err: unknown
): Observable<Maybe<T, UpdateUsernameError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if (error.status === 409 && error.error['errorType'] === 'NON_UNIQUE') {
    if (error.error['subject'] === 'USERNAME') {
      return of(maybeNo<T, UpdateUsernameError>('username_used'));
    }
  }
  return convertError(err);
};

export const convertUpdateEmailError = <T>(
  err: unknown
): Observable<Maybe<T, UpdateEmailError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if (error.status === 409 && error.error['errorType'] === 'NON_UNIQUE') {
    if (error.error['subject'] === 'EMAIL') {
      return of(maybeNo<T, UpdateEmailError>('email_used'));
    }
  }
  return convertError(err);
};

export const convertReplic = (
  res: ReplicResponse,
  acc: PartialAccount | null
): Replic => ({
  ...res,
  originalUrl: res.original_url,
  hostUrl: res.host_url,
  mediaMode: res.media_mode,
  expirationTimestamp: res.expiration != null ? new Date(res.expiration) : null,
  owner: acc,
  state: res.replic_state,
  hasPassword: res.has_password,
});

export const convertConfig = (res: ServerConfigResponse): ServerConfig => ({
  createReplicsGroup: res.create_replic_group,
  accessReplicsGroup: res.access_replic_group,
  createReportGroup: res.create_report_group,
  limit: convertReplicLimit(res),
  allowAccountCreation: res.allow_signup,
  maximumActivePeriod: createPeriod(res.maximum_expiration_period ?? ''),
});

export const convertReplicLimit = (
  res: ServerConfigResponse
): ReplicLimitConfig | null =>
  res.replic_limit_count != null &&
  res.replic_limit_period != null &&
  createPeriod(res.replic_limit_period) != null &&
  res.replic_limit_start != null
    ? {
        count: res.replic_limit_count,
        period: createPeriod(res.replic_limit_period)!,
        start: new Date(res.replic_limit_start),
      }
    : null;

export const createPeriod = (res: string): Period | null => {
  const period = Duration.fromISO(res);
  if (period.isValid) {
    return { unit: PeriodUnit.DAY, length: period.as('days') };
  } else {
    return null;
  }
};
