import {
  AccountState,
  AuthUserGroup,
  MediaMode,
  ReplicState,
} from '../model/enums';

export type PartialAccountResponse = {
  account_id: string;
  username: string;
  profile_color: number;
};

export type QuotaProgressResponse = {
  count: number;
};

export type AccountResponse = {
  id: string;
  created_timestamp: string;
  email: string;
  username: string;
  profile_color: string;
  account_state: AccountState;
};

export type AccountWithTokensResponse = {
  access_token: string;
  refresh_token: string;
  account: AccountResponse;
};

export type ReplicResponse = {
  id: string;
  created_timestamp: string;
  description: string | null;
  replic_state: ReplicState;
  original_url: string;
  size: number;
  host_url: string;
  expiration: string | null;
  author_id: string | null;
  media_mode: MediaMode;
  has_password: boolean;
};

export type ReportResponse = {
  id: string;
  created_timestamp: string;
  user_id: string | null;
  replic_id: string;
};

export type ServerConfigResponse = {
  create_replic_group: AuthUserGroup;
  access_replic_group: AuthUserGroup;
  create_report_group: AuthUserGroup;
  maximum_expiration_period: string | null;
  replic_limit_period: string | null;
  replic_limit_count: number | null;
  replic_limit_start: string | null;
  allow_signup: boolean;
};
