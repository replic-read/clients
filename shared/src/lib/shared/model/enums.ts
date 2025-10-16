export enum ReplicState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REMOVED = 'removed',
}

export enum ReplicSort {
  ORIGIN = 'origin',
  DATE = 'date',
  SIZE = 'size',
  EXPIRATION = 'expiration',
}

export enum ReportState {
  OPEN = 'open',
  CLOSED = 'closed',
  REVIEWED = 'reviewed',
}

export enum ReportSort {
  DATE = 'date',
  USER = 'user',
}

export enum MediaMode {
  ALL = 'all',
  IMAGES = 'images',
  NONE = 'none',
}

export enum AccountState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNVERIFIED = 'unverified',
}

export enum AccountSort {
  STATUS = 'status',
  CREATION = 'creation',
  USERNAME = 'username',
}

export enum AuthUserGroup {
  ALL = 'all',
  ACCOUNT = 'account',
  VERIFIED = 'verified',
}

export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}
