import { ReplicService } from '../ReplicService';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService_Token } from '../../authentication/AuthenticationService';
import { NetworkClient_Token } from '../../network-client/client';
import { Replic } from '../../model/models';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AccountService_Token } from '../AccountService';
import { ReplicResponse } from '../../network-client/responses';
import {
  MediaMode,
  ReplicSort,
  ReplicState,
  SortDirection,
} from '../../model/enums';
import { CreateReplicError, RereError } from '../../model/error';
import { Maybe, maybeNo, maybeYes } from '../../model/maybe';
import { convertReplic } from './mapping';
import { replicComparator } from './comparing';
import { convertCreateReplicError } from '../../authentication/internal/mapping';
import { toMaybe } from '../../authentication/internal/NetworkAuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class NetworkReplicService implements ReplicService {
  /**
   * The api.
   */
  private readonly api = inject(NetworkClient_Token);

  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);

  /**
   * The account service.
   */
  private readonly accountService = inject(AccountService_Token);

  /**
   * The internal cache of replics.
   * @private
   */
  private readonly replics$ = new BehaviorSubject<Replic[]>([]);

  async refresh(): Promise<void> {
    await this.accountService.refresh();
    await this.refreshReplics();
  }

  getReplic(id: string): Observable<Replic | null> {
    return this.replics$.pipe(
      map((replics) => replics.find((replic) => replic.id == id) ?? null)
    );
  }

  getReplics(
    query: string | null,
    filter: ReplicState[] | null,
    sort: ReplicSort | null,
    direction: SortDirection | null
  ): Observable<Replic[]> {
    const sortAndFilter = (replics: Replic[]) =>
      replics
        .filter(
          (replic) =>
            replic.originalUrl.includes(query ?? '') ||
            replic.description?.includes(query ?? '')
        )
        .filter((replic) => filter?.includes(replic.state))
        .sort(replicComparator(sort, direction));

    return this.replics$.pipe(map(sortAndFilter));
  }

  updateReplic(
    replicId: string,
    state: ReplicState
  ): Observable<Maybe<Replic, RereError>> {
    const updateCall = () => {
      return this.api.updateReplicState(replicId, state).pipe(
        switchMap(() =>
          this.getReplic(replicId).pipe(
            map((replic) => {
              if (replic == null) return maybeNo<Replic, RereError>('unknown');
              else return maybeYes<Replic, RereError>(replic);
            })
          )
        )
      );
    };

    return this.auth.safe(updateCall);
  }

  validateReplicPassword(
    replicId: string,
    password: string
  ): Observable<boolean> {
    const contentCall = () => this.api.getReplicContent(replicId, password);

    return this.auth.safe(contentCall).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  createReplic(
    content: string,
    originalUrl: string,
    mediaMode: MediaMode,
    expiration: Date | null,
    description: string | null,
    password: string | null
  ): Observable<Maybe<Replic, CreateReplicError>> {
    const createCall = () =>
      this.api
        .postReplic(
          {
            original_url: originalUrl,
            media_mode: mediaMode,
            expiration: expiration?.toISOString() ?? null,
            description: description,
            password: password,
          },
          content
        )
        .pipe(
          switchMap(this.populateReplicResponse),
          toMaybe<Replic, CreateReplicError>(convertCreateReplicError)
        );

    return this.auth.safe(createCall);
  }

  private async refreshReplics(): Promise<void> {
    const replicObs = this.auth.safe(() =>
      this.api.getReplics(null, null, null, null, null)
    );

    const createReplicFlows = (replics: ReplicResponse[]) =>
      replics.map(this.populateReplicResponse);

    const replics = await firstValueFrom(
      replicObs.pipe(
        switchMap((responses) => forkJoin(createReplicFlows(responses)))
      )
    );

    this.replics$.next(replics);
  }

  private readonly populateReplicResponse = (
    res: ReplicResponse
  ): Observable<Replic> =>
    res.author_id != null
      ? this.accountService
          .getPartialAccount(res.author_id)
          .pipe(map((account) => convertReplic(res, account)))
      : of(convertReplic(res, null));
}
