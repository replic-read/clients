import { Refreshable } from './Refreshable';
import { Report } from '../model/models';
import { ReportSort, SortDirection } from '../model/enums';
import { RereError } from '../model/error';
import { Observable } from 'rxjs';
import { Maybe } from '../model/maybe';

/**
 * Provides actions for accessing the reports.
 */
export interface ReportService extends Refreshable {
  /**
   * Gets all reports matching the filter.
   * @param query The search query.
   * @param sort The sort mode.
   * @param direction The sort direction.
   */
  getReports(
    query: string | null,
    sort: ReportSort | null,
    direction: SortDirection | null
  ): Observable<Report[]>;

  /**
   * Marks a report as closed.
   * @param id Id of the report.
   */
  markReportClosed(id: string): Observable<Maybe<null, RereError>>;

  /**
   * Marks a report as reviewed.
   * @param id Id of the report.
   */
  markReportReviewed(id: string): Observable<Maybe<null, RereError>>;
}
