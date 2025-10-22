import { Account, PartialAccount } from '../model/models';
import { AccountSort, AccountState, SortDirection } from '../model/enums';
import { SignupError } from '../authentication/errors';
import { Observable } from 'rxjs';
import { Maybe } from '../model/maybe';
import { UpdateEmailError, UpdateUsernameError } from './internal/errors';
import { Refreshable } from './Refreshable';
import { inject, InjectionToken } from '@angular/core';
import { NetworkAccountService } from './internal/NetworkAccountService';

/**
 * Provides methods for accessing the accounts.
 */
export interface AccountService extends Refreshable {
  getAccountsFull(
    query: string | null,
    filter: AccountState[] | null,
    sort: AccountSort | null,
    direction: SortDirection | null
  ): Observable<Account[]>;

  getPartialAccount(id: string): Observable<PartialAccount | null>;

  getFullAccount(id: string): Observable<Account | null>;

  createAccount(
    email: string,
    username: string,
    password: string,
    verified: boolean
  ): Observable<Maybe<Account, SignupError>>;

  updateUsername(
    username: string
  ): Observable<Maybe<Account, UpdateUsernameError>>;

  updateEmail(email: string): Observable<Maybe<Account, UpdateEmailError>>;
}

export const AccountService_Token = new InjectionToken<AccountService>(
  'AccountService',
  {
    providedIn: 'root',
    factory: () => inject(NetworkAccountService),
  }
);
