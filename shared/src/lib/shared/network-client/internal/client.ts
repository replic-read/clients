import { Observable } from 'rxjs';
import {
  AccountResponse,
  AccountWithTokensResponse,
  PartialAccountResponse,
  QuotaProgressResponse,
  ReplicResponse,
  ReportResponse,
  ServerConfigResponse,
} from '../responses';
import {
  CreateAccountRequest,
  CreateReplicRequest,
  CreateReportRequest,
  CredentialsRequest,
  RefreshRequest,
  ResetPasswordRequest,
  ServerConfigRequest,
  SubmitEmailVerificationRequest,
  UpdateAccountRequest,
} from '../requests';
import { NetworkClient } from '../client';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseUrlSupplier_Token } from '../BaseUrlSupplier';
import {
  AccountSort,
  AccountState,
  ReplicSort,
  ReplicState,
  ReportSort,
  ReportState,
  SortDirection,
} from '../../model/enums';
import { AuthTokenAccessor_Token } from '../AuthTokenAccessor';

@Injectable({
  providedIn: 'root',
})
export class NetworkClientImpl implements NetworkClient {
  /**
   * The angular http client.
   */
  private readonly client = inject(HttpClient);

  /**
   * The base url provider.
   */
  private readonly baseUrlSupplier = inject(BaseUrlSupplier_Token);

  /**
   * The accessor to the auth tokens.
   */
  private readonly authTokenAccessor = inject(AuthTokenAccessor_Token);

  post = <T>(
    relativePath: string,
    body: unknown,
    params?: Record<string, ParamValue>
  ): Observable<T> =>
    this.client.post<T>(this.url(relativePath), body, {
      headers: this.getDefaultHeaders(),
      params: params,
    });

  get = <T>(
    relativePath: string,
    params?: Record<string, ParamValue>
  ): Observable<T> =>
    this.client.get<T>(this.url(relativePath), {
      headers: this.getDefaultHeaders(),
      params: params,
    });

  put = <T>(
    relativePath: string,
    body: unknown,
    params?: Record<string, ParamValue>
  ): Observable<T> =>
    this.client.put<T>(this.url(relativePath), body, {
      headers: this.getDefaultHeaders(),
      params: params,
    });

  createAccount(
    sendEmail: boolean | null,
    verified: boolean | null,
    body: CreateAccountRequest
  ): Observable<AccountResponse> {
    return this.post(
      '/accounts/',
      buildParams({ send_email: sendEmail, verified: verified }),
      body
    );
  }

  getAccountsFull(
    sort: AccountSort | null,
    direction: SortDirection | null,
    accountId: string | null,
    filter: AccountState[],
    query: string | null
  ): Observable<AccountResponse[]> {
    return this.get(
      '/accounts/full/',
      buildParams({
        sort: sort,
        direction: direction,
        account_id: accountId,
        filter: filter,
        query: query,
      })
    );
  }

  getAccountsPartial(
    sort: AccountSort | null,
    direction: SortDirection | null,
    accountId: string | null,
    query: string | null
  ): Observable<PartialAccountResponse[]> {
    return this.get(
      '/accounts/partial/',
      buildParams({
        sort: sort,
        direction: direction,
        account_id: accountId,
        query: query,
      })
    );
  }

  getMe(): Observable<AccountResponse> {
    return this.get('/me/');
  }

  getQuota(): Observable<QuotaProgressResponse> {
    return this.get('/me/quota/');
  }

  getReplicContent(id: string, password: string | null): Observable<string> {
    return this.get(
      `/replics/${id}/content/`,
      buildParams({ password: password })
    );
  }

  getReplics(
    sort: ReplicSort | null,
    direction: SortDirection | null,
    user: string | null,
    filter: ReplicState[] | null,
    query: string | null
  ): Observable<ReplicResponse[]> {
    return this.get(
      '/replics/',
      buildParams({
        sort: sort,
        direction: direction,
        user: user,
        filter: filter,
        query: query,
      })
    );
  }

  getReports(
    sort: ReportSort | null,
    direction: SortDirection | null,
    reportId: string | null,
    query: string | null
  ): Observable<ReportResponse[]> {
    return this.get(
      '/accounts/',
      buildParams({
        sort: sort,
        direction: direction,
        report_id: reportId,
        query: query,
      })
    );
  }

  getServerConfig(): Observable<ServerConfigResponse> {
    return this.get('/server-config/');
  }

  login(body: CredentialsRequest): Observable<AccountWithTokensResponse> {
    return this.post('/auth/login/', body);
  }

  logout(token: string | null, all: boolean | null): Observable<void> {
    return this.post(
      '/auth/logout/',
      {},
      buildParams({ token: token, all: all })
    );
  }

  postReplic(body: CreateReplicRequest): Observable<ReplicResponse> {
    return this.post('/replics/', body);
  }

  postReport(
    body: CreateReportRequest,
    replicId: string
  ): Observable<ReportResponse> {
    return this.post('/reports/', body, { replic_id: replicId });
  }

  refresh(body: RefreshRequest): Observable<AccountWithTokensResponse> {
    return this.post('/auth/refresh/', body);
  }

  requestEmailVerification(html: boolean | null): Observable<void> {
    return this.get(
      '/auth/request-email-verification/',
      buildParams({ html: html })
    );
  }

  resetUserPassword(
    id: string,
    body: ResetPasswordRequest
  ): Observable<AccountResponse> {
    return this.post(`/accounts/${id}/`, body);
  }

  setServerConfig(body: ServerConfigRequest): Observable<ServerConfigResponse> {
    return this.put('/server-config/', body);
  }

  signup(body: CreateAccountRequest): Observable<AccountWithTokensResponse> {
    return this.post('/auth/signup/', body);
  }

  submitEmailToken(body: SubmitEmailVerificationRequest): Observable<void> {
    return this.post('/auth/submit-email-verification/', body);
  }

  updateMe(body: UpdateAccountRequest): Observable<AccountResponse> {
    return this.post('/me/', body);
  }

  updateReplicState(id: string, state: ReplicState): Observable<void> {
    return this.put(`/replics/${id}/`, {}, { state: state });
  }

  updateReportStatus(
    id: string,
    state: ReportState
  ): Observable<ReportResponse> {
    return this.put(`/reports/${id}/`, {}, { state: state });
  }

  shutdown(): Observable<void> {
    return this.post('/admin/shutdown/', {});
  }

  /**
   * Function that creates a full url with a partial url.
   */
  private readonly url = (relativePath: string) =>
    `${this.baseUrlSupplier.supply()}/api/v1${relativePath}`;

  /**
   * Gets the auth header.
   */
  private readonly getDefaultHeaders = (): Record<string, string> => ({
    Authorization: `Bearer ${this.authTokenAccessor.getAccess()}`,
    'Content-Type': 'application/json',
  });
}

type ParamValuePrim = string | number | boolean;
type ParamValue = ParamValuePrim | ReadonlyArray<ParamValuePrim>;

/**
 * Takes a list of params and removes the keys and values of the pairs where the value is null.
 */
const buildParams = (
  params: Record<string, ParamValue | null>
): Record<string, ParamValue> => {
  const ret: Record<string, ParamValue> = {};
  for (const key in params) {
    if (params[key] != null) {
      ret[key] = params[key];
    }
  }

  return ret;
};
