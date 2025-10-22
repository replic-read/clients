import { MediaMode, Replic, ReplicSort, ReplicState, RereError, SortDirection } from '@replic-read-clients/shared';
import { Observable } from 'rxjs';
import { Maybe } from '../model/maybe';
import { inject, InjectionToken } from '@angular/core';
import { NetworkReplicService } from './internal/NetworkReplicService';
import { Refreshable } from './Refreshable';

/**
 * Gives access to the replics.
 */
export interface ReplicService extends Refreshable {
  /**
   * Gets a list of all replics matching the given filter.
   * @param query The query.
   * @param filter The filter.
   * @param sort The sort mode.
   * @param direction The direction.
   */
  getReplics(
    query: string | null,
    filter: ReplicState[] | null,
    sort: ReplicSort | null,
    direction: SortDirection | null
  ): Observable<Replic[]>;

  /**
   * Checks whether the password is valid to access a replic.
   * @param replicId The id of the replic.
   * @param password The password.
   */
  validateReplicPassword(
    replicId: string,
    password: string
  ): Observable<boolean>;

  /**
   * Gets a specific replic.
   * @param id The id of the replic.
   */
  getReplic(id: string): Observable<Replic | null>;

  /**
   * Updates the state of a replic.
   * @param replicId The id of the replic.
   * @param state The new state.
   */
  updateReplic(
    replicId: string,
    state: ReplicState
  ): Observable<Maybe<Replic, RereError>>;

  /**
   * Creates a new replic.
   * @param content The html content as a string.
   * @param originalUrl The original url.
   * @param mediaMode The media mode.
   * @param expiration The expiration.
   * @param description The description.
   * @param password The password.
   */
  createReplic(
    content: string,
    originalUrl: string,
    mediaMode: MediaMode,
    expiration: Date | null,
    description: string | null,
    password: string | null
  ): Observable<Maybe<Replic, RereError>>;
}

export const ReplicService_Token = new InjectionToken<ReplicService>(
  'ReplicService',
  {
    providedIn: 'root',
    factory: () => inject(NetworkReplicService),
  }
);
