import { Account, Replic, Report } from '../../model/models';
import {
  AccountSort,
  AccountState,
  ReplicSort,
  ReportSort,
  SortDirection,
} from '../../model/enums';

const accountStateOrder = [
  AccountState.ACTIVE,
  AccountState.UNVERIFIED,
  AccountState.INACTIVE,
];

/**
 * Provides the comparator for a sorting accounts.
 * @param sort The sort mode.
 * @param direction The direction.
 */
export function accountComparator(
  sort: AccountSort | null,
  direction: SortDirection | null
): (first: Account, second: Account) => number {
  if (sort == null) return () => 0;
  return (first, second) => {
    switch (sort) {
      case AccountSort.STATUS:
        return (
          compareNumbers(
            accountStateOrder.indexOf(first.accountState),
            accountStateOrder.indexOf(second.accountState)
          ) * getFactor(direction)
        );
      case AccountSort.CREATION:
        return (
          compareNumbers(
            first.creationTimestamp.getMilliseconds(),
            second.creationTimestamp.getMilliseconds()
          ) * getFactor(direction)
        );
      case AccountSort.USERNAME:
        return (
          first.username.localeCompare(second.username) * getFactor(direction)
        );
    }
  };
}

export function reportComparator(
  sort: ReportSort | null,
  direction: SortDirection | null
): (first: Report, second: Report) => number {
  if (sort == null) return () => 0;
  return (first, second) => {
    switch (sort) {
      case ReportSort.DATE:
        return (
          compareNumbers(
            first.creationTimestamp.getMilliseconds(),
            second.creationTimestamp.getMilliseconds()
          ) * getFactor(direction)
        );
      case ReportSort.USER:
        if (first.owner == null && second.owner == null) return 0;
        else if (first.owner == null && second.owner != null)
          return -1 * getFactor(direction);
        else if (first.owner != null && second.owner == null)
          return getFactor(direction);
        else
          return (
            first.owner!.username.localeCompare(second.owner!.username) *
            getFactor(direction)
          );
    }
  };
}

/**
 * Provides the comparator for a sorting replics.
 * @param sort The sort mode.
 * @param direction The direction.
 */
export function replicComparator(
  sort: ReplicSort | null,
  direction: SortDirection | null
): (first: Replic, second: Replic) => number {
  if (sort == null) return () => 0;
  return (first, second) => {
    switch (sort) {
      case ReplicSort.ORIGIN:
        return (
          first.originalUrl.localeCompare(second.originalUrl) *
          getFactor(direction)
        );
      case ReplicSort.DATE:
        return 0; // Implement this. We need access to the creation date on the replic DTO.
      case ReplicSort.SIZE:
        return compareNumbers(first.size, second.size);
      case ReplicSort.EXPIRATION:
        return compareNumbers(
          first.expirationTimestamp?.getMilliseconds() ?? 0,
          second.expirationTimestamp?.getMilliseconds() ?? 0
        );
    }
  };
}

function compareNumbers(first: number, second: number): number {
  if (first < second) return -1;
  else if (first == second) return 0;
  else return 1;
}

function getFactor(direction: SortDirection | null): number {
  switch (direction) {
    case null:
    case SortDirection.ASCENDING:
      return 1;
    case SortDirection.DESCENDING:
      return -1;
  }
}
