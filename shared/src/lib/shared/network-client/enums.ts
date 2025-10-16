export type AccountStateParam = 'active' | 'unverified' | 'inactive';
export type ReplicStateParam = 'active' | 'inactive' | 'removed';
export type ReportStateParam = 'open' | 'closed' | 'reviewed';
export type MediaModeParam = 'all' | 'images' | 'none';

export type AuthUserParam = 'all' | 'account' | 'verified';

export type SortDirection = 'ascending' | 'descending';
export type ReplicSortParam = 'origin' | 'date' | 'size' | 'expiration';
export type AccountSortParam = 'status' | 'creation' | 'username';
export type ReportSortParam = 'date' | 'user';
