import { AccountService } from '../AccountService';
import { inject, Injectable } from '@angular/core';
import { Account, PartialAccount } from '../../model/models';
import {
  AccountResponse,
  PartialAccountResponse,
} from '../../network-client/responses';
import { AccountSort, AccountState, SortDirection } from '../../model/enums';
import { AuthenticationService_Token } from '../../authentication/AuthenticationService';
import { NetworkClient_Token } from '../../network-client/client';
import { SignupError } from '../../authentication/errors';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Maybe } from '../../model/maybe';
import { UpdateEmailError, UpdateUsernameError } from './errors';
import {
  convertPartialAccountResponse,
  convertUpdateEmailError,
  convertUpdateUsernameError,
} from './mapping';
import {
  convertAccountResponse,
  convertSignupError,
} from '../../authentication/internal/mapping';
import { toMaybe } from '../../authentication/internal/NetworkAuthenticationService';
import { accountComparator } from './comparing';

@Injectable({
  providedIn: 'root',
})
export class NetworkAccountService implements AccountService {
  /**
   * The api.
   */
  private readonly api = inject(NetworkClient_Token);

  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);

  /**
   * The internal cache of partial accounts.
   * @private
   */
  private readonly partialAccounts$ = new BehaviorSubject<PartialAccount[]>([]);

  /**
   * The internal cache of full accounts.
   * @private
   */
  private readonly fullAccounts$ = new BehaviorSubject<Account[]>([]);

  createAccount(
    email: string,
    username: string,
    password: string,
    verified: boolean
  ): Observable<Maybe<Account, SignupError>> {
    return this.api
      .createAccount(!verified, verified, {
        email: email,
        username: username,
        password: password,
        profile_color: 0,
      })
      .pipe(
        map(convertAccountResponse),
        toMaybe<Account, SignupError>(convertSignupError)
      );
  }

  updateEmail(email: string): Observable<Maybe<Account, UpdateEmailError>> {
    return this.auth.me().pipe(
      switchMap((maybe) => {
        if (maybe.isYes()) {
          return this.api
            .updateMe({
              email: email,
              username: maybe.yes().username,
              profile_color: maybe.yes().profileColor,
            })
            .pipe(
              map(convertAccountResponse),
              toMaybe<Account, UpdateEmailError>(convertUpdateEmailError)
            );
        } else {
          return of(maybe);
        }
      })
    );
  }

  updateUsername(
    username: string
  ): Observable<Maybe<Account, UpdateUsernameError>> {
    return this.auth.me().pipe(
      switchMap((maybe) => {
        if (maybe.isYes()) {
          return this.api
            .updateMe({
              username: username,
              email: maybe.yes().email,
              profile_color: maybe.yes().profileColor,
            })
            .pipe(
              map(convertAccountResponse),
              toMaybe<Account, UpdateUsernameError>(convertUpdateUsernameError)
            );
        } else {
          return of(maybe);
        }
      })
    );
  }

  getAccountsFull(
    query: string | null,
    filter: AccountState[] | null,
    sort: AccountSort | null,
    direction: SortDirection | null
  ): Observable<Account[]> {
    const filteringSorting = (accounts: Account[]) =>
      accounts
        .filter(
          (account) =>
            account.username.includes(query ?? '') ||
            account.email.includes(query ?? '')
        )
        .filter((acc) => filter == null || filter.includes(acc.accountState))
        .sort(accountComparator(sort, direction));

    return this.fullAccounts$.pipe(map(filteringSorting));
  }

  getFullAccount(id: string): Observable<Account | null> {
    const filter = (accounts: Account[]) =>
      accounts.find((acc) => acc.id === id) ?? null;

    return this.fullAccounts$.pipe(map(filter));
  }

  getPartialAccount(id: string): Observable<PartialAccount | null> {
    const filter = (accounts: PartialAccount[]) =>
      accounts.find((acc) => acc.id === id) ?? null;

    return this.partialAccounts$.pipe(map(filter));
  }

  refresh(onDone: () => void): void {
    const partialResponse$ = this.auth.safe(() =>
      this.api.getAccountsPartial(null, null, null, null)
    );
    const fullResponse$ = this.auth.safe(() =>
      this.api
        .getAccountsFull(null, null, null, null, null)
        .pipe(catchError(() => of([])))
    );

    combineLatest([partialResponse$, fullResponse$]).subscribe(
      ([partialResponse, fullResponse]: [
        PartialAccountResponse[],
        AccountResponse[]
      ]) => {
        this.partialAccounts$.next(
          partialResponse.map(convertPartialAccountResponse)
        );
        this.fullAccounts$.next(fullResponse.map(convertAccountResponse));
        onDone();
      }
    );
  }
}
