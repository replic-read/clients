import { Observable, of } from 'rxjs';
import { LoginError, SignupError } from '../errors';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountResponse } from '../../network-client/responses';
import { Account } from '../../model/models';
import { CreateReplicError, RereError } from '../../model/error';
import { Maybe, maybeNo } from '../../model/maybe';

/**
 * Converts an HttpErrorResponse to a LoginError.
 */
export const convertLoginError = <T>(
  err: unknown
): Observable<Maybe<T, LoginError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if ([401, 403].includes(error.status)) {
    return of(maybeNo<T, LoginError>('credentials'));
  }
  return convertError(err);
};

/**
 * Converts an HttpErrorResponse to a SignupError.
 */
export const convertSignupError = <T>(
  err: unknown
): Observable<Maybe<T, SignupError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if (error.status === 409 && error.error['errorType'] === 'NON_UNIQUE') {
    if (error.error['subject'] === 'EMAIL') {
      return of(maybeNo<T, SignupError>('email_used'));
    } else if (error.error['subject'] === 'USERNAME') {
      return of(maybeNo<T, SignupError>('username_used'));
    }
  }
  return convertError(err);
};

/**
 * Converts an HttpErrorResponse to a CreateReplicError.
 */
export const convertCreateReplicError = <T>(
  err: unknown
): Observable<Maybe<T, CreateReplicError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if(error.status === 413) {
    return of(maybeNo<T, CreateReplicError>('too_big'))
  } else if(error.status === 429) {
    return of(maybeNo<T, CreateReplicError>('quota_reached'))
  }

  return convertError(err)
}

/**
 * Converts an HttpErrorResponse to a RereError.
 */
export const convertError = <T>(
  err: unknown
): Observable<Maybe<T, RereError>> => {
  // This is guaranteed to work, if 'err' was passed from an angular http request.
  const error = err as HttpErrorResponse;

  if (error.status === 0) {
    return of(maybeNo<T, RereError>('connection'));
  } else if ([401, 403].includes(error.status)) {
    return of(maybeNo<T, RereError>('permission'));
  } else {
    return of(maybeNo<T, RereError>('unknown'));
  }
};

export const convertAccountResponse = (res: AccountResponse): Account => ({
  ...res,
  profileColor: res.profile_color,
  creationTimestamp: new Date(res.created_timestamp),
  accountState: res.account_state,
});
