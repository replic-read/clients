import {
  AccountStateParam,
  AuthUserParam,
  MediaModeParam,
  ReplicStateParam,
} from './enums';

export type PartialAccountResponse = {
  username: string;
  profile_color: number;
  account_state: AccountStateParam;
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
  account_state: AccountStateParam;
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
  replic_state: ReplicStateParam;
  original_url: string;
  size: number;
  host_url: string;
  expiration: string | null;
  author_id: string | null;
  media_mode: MediaModeParam;
  has_password: boolean;
};

export type ReportResponse = {
  id: string;
  created_timestamp: string;
  user_id: string | null;
  replic_id: string;
};

export type ServerConfigResponse = {
  create_replic_group: AuthUserParam;
  access_replic_group: AuthUserParam;
  create_report_group: AuthUserParam;
  maximum_expiration_period: string | null;
  replic_limit_period: string | null;
  replic_limit_count: number | null;
  replic_limit_start: string | null;
  allow_signup: boolean;
};
