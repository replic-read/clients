import { AuthenticationService } from '../AuthenticationService';
import {
  catchError,
  map,
  Observable,
  pipe,
  switchMap,
  tap,
  throwError,
  UnaryFunction,
} from 'rxjs';
import { Account } from '../../model/models';
import { LoginError, SignupError } from '../errors';
import { NetworkClient_Token } from '../../network-client/client';
import { inject, Injectable } from '@angular/core';
import {
  convertAccountResponse,
  convertError,
  convertLoginError,
  convertSignupError,
} from './mapping';
import { RereError } from '../../model/error';
import { Maybe, maybeYes } from '../../model/maybe';
import { AccountWithTokensResponse } from '../../network-client/responses';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthTokenAccessor_Token } from '../../network-client/AuthTokenAccessor';

@Injectable({
  providedIn: 'root',
})
export class NetworkAuthenticationService implements AuthenticationService {
  /**
   * The network client.
   */
  private readonly api = inject(NetworkClient_Token);

  /**
   * The storage abstraction.
   */
  private readonly authTokenAccessor = inject(AuthTokenAccessor_Token);

  login(
    email: string | null,
    username: string | null,
    password: string
  ): Observable<Maybe<Account, LoginError>> {
    return this.api
      .login({
        email: email,
        username: username,
        password: password,
      })
      .pipe(
        tap(this.saveTokens),
        map((res) => res.account),
        map(convertAccountResponse),
        toMaybe<Account, LoginError>(convertLoginError)
      );
  }

  me(): Observable<Maybe<Account, RereError>> {
    const call = () =>
      this.api
        .getMe()
        .pipe(
          map(convertAccountResponse),
          toMaybe<Account, RereError>(convertError)
        );
    return this.safe(call);
  }

  quota(): Observable<Maybe<number, RereError>> {
    const call = () =>
      this.api.getQuota().pipe(
        map((res) => res.count),
        toMaybe<number, RereError>(convertError)
      );

    return this.safe(call);
  }

  refresh(): Observable<Maybe<Account, RereError>> {
    return this.api
      .refresh({ refresh_token: this.authTokenAccessor.getRefresh() ?? '' })
      .pipe(
        tap(this.saveTokens),
        map((acc) => acc.account),
        map(convertAccountResponse),
        toMaybe<Account, RereError>(convertError)
      );
  }

  requestEmailVerification(): Observable<Maybe<true, RereError>> {
    return this.api
      .requestEmailVerification(true)
      .pipe(toMaybe<true, RereError>(convertError));
  }

  signup(
    email: string,
    username: string,
    password: string,
    profileColor: number,
    sendEmail: boolean
  ): Observable<Maybe<Account, SignupError>> {
    return this.api
      .signup({
        email: email,
        username: username,
        password: password,
        profile_color: profileColor,
      })
      .pipe(
        tap(this.saveTokens),
        map((res) => res.account),
        map(convertAccountResponse),
        toMaybe<Account, SignupError>(convertSignupError)
      );
  }

  submitEmailVerification(token: string): Observable<Maybe<void, RereError>> {
    return this.api
      .submitEmailToken({
        email_token: token,
      })
      .pipe(toMaybe<void, RereError>(convertError));
  }

  logout(): Observable<Maybe<void, RereError>> {
    const refresh = this.authTokenAccessor.getRefresh();
    this.authTokenAccessor.setRefresh('');
    this.authTokenAccessor.setAccess('');
    return this.api
      .logout(refresh, false)
      .pipe(toMaybe<void, RereError>(convertError));
  }

  safe<T>(call: () => Observable<T>): Observable<T> {
    return call().pipe(
      catchError((err) => {
        const error = err as HttpErrorResponse;
        if ([401, 403].includes(error.status)) {
          return this.api
            .refresh({
              refresh_token: this.authTokenAccessor.getRefresh() ?? '',
            })
            .pipe(
              switchMap((res) => {
                const newToken = res.access_token;
                this.authTokenAccessor.setAccess(newToken);
                return call();
              }),
              catchError((refErr) => throwError(() => refErr))
            );
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Saves the contained tokens saved in an AccountWithTokensResponse.
   */
  private readonly saveTokens = (res: AccountWithTokensResponse): void => {
    this.authTokenAccessor.setAccess(res.access_token);
    this.authTokenAccessor.setRefresh(res.refresh_token);
  };
}

/**
 * Piping function that converts normal emissions to successful responses,
 * and error emissions to error responses using the errorConv converter.
 * @param errConv Converts unknown errors to a specified type.
 */
export function toMaybe<V, E>(
  errConv: (err: unknown) => Observable<Maybe<V, E>>
): UnaryFunction<Observable<V>, Observable<Maybe<V, E>>> {
  return pipe(map(maybeYes<V, E>), catchError(errConv));
}
