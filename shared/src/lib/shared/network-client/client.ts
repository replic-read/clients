import {
  AccountSortParam,
  AccountStateParam,
  ReplicSortParam,
  ReplicStateParam,
  ReportSortParam,
  ReportStateParam,
  SortDirection
} from './enums';
import { Observable } from 'rxjs';
import {
  AccountResponse,
  AccountWithTokensResponse,
  PartialAccountResponse,
  QuotaProgressResponse,
  ReplicResponse,
  ReportResponse,
  ServerConfigResponse
} from './responses';
import {
  CreateAccountRequest,
  CreateReplicRequest,
  CreateReportRequest,
  CredentialsRequest,
  RefreshRequest,
  ResetPasswordRequest,
  ServerConfigRequest,
  SubmitEmailVerificationRequest,
  UpdateAccountRequest
} from './requests';
import { inject, InjectionToken } from '@angular/core';
import { NetworkClientImpl } from './internal/client';

/**
 * Provides access to all the endpoints of the api.
 */
export interface NetworkClient {
  /**
   * Sets the access-token that is used for authentication.
   */
  setToken: (token: string | null) => void;
  /**
   * Request to PUT /api/v1/replics/{id}/
   */
  updateReplicState: (id: string, state: ReplicStateParam) => Observable<void>;

  /**
   * Request to GET /api/v1/replics/
   */
  getReplics: (
    sort: ReplicSortParam | null,
    direction: SortDirection | null,
    user: string | null,
    filter: ReplicStateParam[] | null,
    query: string | null
  ) => Observable<ReplicResponse[]>;

  /**
   * Request to POST /replics/
   */
  postReplic: (body: CreateReplicRequest) => Observable<ReplicResponse>;

  /**
   * Request to GET /api/v1/replics/{id}/content/
   */
  getReplicContent: (id: string, password: string | null) => Observable<string>;

  /**
   * Request to POST /api/v1/accounts/{id}/
   */
  resetUserPassword: (
    id: string,
    body: ResetPasswordRequest
  ) => Observable<AccountResponse>;

  /**
   * Request to POST /api/v1/accounts/
   */
  createAccount: (
    sendEmail: boolean | null,
    verified: boolean | null,
    body: CreateAccountRequest
  ) => Observable<AccountResponse>;

  /**
   * Request to GET /api/v1/accounts/partial/
   */
  getAccountsPartial: (
    sort: AccountSortParam | null,
    direction: SortDirection | null,
    accountId: string | null,
    query: string | null
  ) => Observable<PartialAccountResponse[]>;

  /**
   * Request to GET /api/v1/accounts/full/
   */
  getAccountsFull: (
    sort: AccountSortParam | null,
    direction: SortDirection | null,
    accountId: string | null,
    filter: AccountStateParam[],
    query: string | null
  ) => Observable<AccountResponse[]>;

  /**
   * Request to GET /api/v1/server-config/
   */
  getServerConfig: () => Observable<ServerConfigResponse>;

  /**
   * Request to PUT /api/v1/server-config/
   */
  setServerConfig: (
    body: ServerConfigRequest
  ) => Observable<ServerConfigResponse>;

  /**
   * Request to GET /api/v1/me/
   */
  getMe: () => Observable<AccountResponse>;

  /**
   * Request to POST /api/v1/me/
   */
  updateMe: (body: UpdateAccountRequest) => Observable<AccountResponse>;

  /**
   * Request to GET /api/v1/me/quota/
   */
  getQuota: () => Observable<QuotaProgressResponse>;

  /**
   * Request to PUT /api/v1/reports/{id}/
   */
  updateReportStatus: (
    id: string,
    state: ReportStateParam
  ) => Observable<ReportResponse>;

  /**
   * Request to GET /api/v1/reports/
   */
  getReports: (
    sort: ReportSortParam | null,
    direction: SortDirection | null,
    reportId: string | null,
    query: string | null
  ) => Observable<ReportResponse[]>;

  /**
   * Request to POST /api/v1/reports/
   */
  postReport: (
    body: CreateReportRequest,
    replicId: string
  ) => Observable<ReportResponse>;

  /**
   * Request to POST /api/v1/auth/submit-email-verification/
   */
  submitEmailToken: (body: SubmitEmailVerificationRequest) => Observable<void>;

  /**
   * Request to POST /api/v1/auth/signup/
   */
  signup: (body: CreateAccountRequest) => Observable<AccountWithTokensResponse>;

  /**
   * Request to POST /api/v1/auth/refresh/
   */
  refresh: (body: RefreshRequest) => Observable<AccountWithTokensResponse>;

  /**
   * Request to POST /api/v1/auth/logout/
   */
  logout: (token: string | null, all: boolean | null) => Observable<void>;

  /**
   * Request to POST /api/v1/auth/login/
   */
  login: (body: CredentialsRequest) => Observable<AccountWithTokensResponse>;

  /**
   * Request to GET /api/v1/auth/request-email-verification/
   */
  requestEmailVerification: (html: boolean | null) => Observable<void>;

  /**
   * Request to POST /api/v1/admin/shutdown/
   */
  shutdown: () => Observable<void>;
}

/**
 * Injection token for the NetworkClient interface.
 */
export const NetworkClient_Token = new InjectionToken<NetworkClient>(
  'NetworkClient',
  {
    providedIn: 'root',
    factory: () => inject(NetworkClientImpl),
  }
);
