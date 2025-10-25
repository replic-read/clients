import { Observable } from 'rxjs';
import { Account } from '../model/models';
import { LoginError, SignupError } from './errors';
import { RereError } from '../model/error';
import { inject, InjectionToken } from '@angular/core';
import { NetworkAuthenticationService } from './internal/NetworkAuthenticationService';
import { Maybe } from '../model/maybe';

/**
 * Service that gives high-level access to authentication actions.
 */
export interface AuthenticationService {
  /**
   * Logs the user in. At least one of email or password need to be passed.
   * @param email The email.
   * @param username The username.
   * @param password The password.
   */
  login(
    email: string | null,
    username: string | null,
    password: string
  ): Observable<Maybe<Account, LoginError>>;

  /**
   * Signs a user up.
   * @param email The email.
   * @param username The username.
   * @param password The password.
   * @param profileColor The profile color.
   * @param sendEmail Whether to send a verification email immediately.
   */
  signup(
    email: string,
    username: string,
    password: string,
    profileColor: number,
    sendEmail: boolean
  ): Observable<Maybe<Account, SignupError>>;

  /**
   * Tried to log in with the saved refresh token.
   */
  refresh(): Observable<Maybe<Account, RereError>>;

  /**
   * Requests an email-verification message.
   */
  requestEmailVerification(): Observable<Maybe<void, RereError>>;

  /**
   * Submits an email verification token.
   * @param token The token.
   */
  submitEmailVerification(token: string): Observable<Maybe<void, RereError>>;

  /**
   * Gets data about the current account.
   */
  me(): Observable<Maybe<Account, RereError>>;

  /**
   * Gets the quote progress.
   */
  quota(): Observable<Maybe<number, RereError>>

  /**
   * Logs out of the current account.
   */
  logout(): Observable<Maybe<void, RereError>>;

  /**
   * Makes a safe authentication call.
   * @param call The secured call.
   */
  safe<T>(call: () => Observable<T>): Observable<T>;
}

export const AuthenticationService_Token =
  new InjectionToken<AuthenticationService>('AuthenticationService', {
    providedIn: 'root',
    factory: () => inject(NetworkAuthenticationService),
  });
