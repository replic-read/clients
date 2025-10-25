import { inject, Injectable } from '@angular/core';
import { ReportService } from '../ReportService';
import { AccountService_Token } from '../AccountService';
import { AuthenticationService_Token } from '../../authentication/AuthenticationService';
import { NetworkClient_Token } from '../../network-client/client';
import { PartialAccount, Replic, Report } from '../../model/models';
import { ReplicService_Token } from '../ReplicService';
import { ReportResponse } from '../../network-client/responses';
import { ReportSort, ReportState, SortDirection } from '../../model/enums';
import { RereError } from '../../model/error';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { reportComparator } from './comparing';
import { convertError } from '../../authentication/internal/mapping';
import { Maybe } from '../../model/maybe';
import { toMaybe } from '../../authentication/internal/NetworkAuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class NetworkReportService implements ReportService {
  /**
   * The api.
   */
  private readonly api = inject(NetworkClient_Token);

  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);

  private readonly replicService = inject(ReplicService_Token);

  private readonly accountService = inject(AccountService_Token);

  private readonly reports$ = new BehaviorSubject<Report[]>([]);

  getReports(
    query: string | null,
    sort: ReportSort | null,
    direction: SortDirection | null
  ): Observable<Report[]> {
    const sortAndFilter = (reports: Report[]) =>
      reports
        .filter(
          (report) =>
            report.description?.includes(query ?? '') ||
            report.owner?.username.includes(query ?? '')
        )
        .sort(reportComparator(sort, direction));

    return this.reports$.pipe(map(sortAndFilter));
  }

  markReportClosed(id: string): Observable<Maybe<null, RereError>> {
    const markCall = () =>
      this.api.updateReportStatus(id, ReportState.CLOSED).pipe(
        map(() => null),
        toMaybe<null, RereError>(convertError)
      );

    return this.auth.safe(markCall);
  }

  markReportReviewed(id: string): Observable<Maybe<null, RereError>> {
    const markCall = () =>
      this.api.updateReportStatus(id, ReportState.REVIEWED).pipe(
        map(() => null),
        toMaybe<null, RereError>(convertError)
      );

    return this.auth.safe(markCall);
  }

  async refresh(): Promise<void> {
    await this.replicService.refresh();
    await this.refreshReports();
  }

  private async refreshReports(): Promise<void> {
    const reports$ = this.auth.safe(() =>
      this.api.getReports(null, null, null, null)
    );

    const createFlows = (reports: ReportResponse[]) =>
      reports.map(this.populateReportResponse);

    const populatedReports$ = reports$.pipe(
      switchMap((reports) => forkJoin(createFlows(reports)))
    );
    const populatedReports = await firstValueFrom(populatedReports$);
    this.reports$.next(populatedReports);
  }

  private readonly populateReportResponse = (
    res: ReportResponse
  ): Observable<Report> => {
    const replic$ = this.replicService.getReplic(res.replic_id);
    const account$ = res.user_id
      ? this.accountService.getPartialAccount(res.user_id)
      : of(null);

    const combineAction = ([replic, account]: [
      Replic | null,
      PartialAccount | null
    ]): Report => {
      if (replic == null) {
        throw new Error(`No replic found for requested id ${res.replic_id}`);
      }

      return {
        ...res,
        creationTimestamp: new Date(res.created_timestamp),
        replic: replic,
        owner: account,
      };
    };

    return combineLatest([replic$, account$]).pipe(map(combineAction));
  };
}
