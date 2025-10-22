import { AuthUserGroup, MediaMode } from '../model/enums';

export type ServerConfigRequest = {
  create_replic_group: AuthUserGroup;
  access_replic_group: AuthUserGroup;
  create_report_group: AuthUserGroup;
  maximum_expiration_period: string | null;
  replic_limit_period: string | null;
  replic_limit_count: number | null;
  allow_signup: boolean;
};

export type CreateReportRequest = {
  description: string | null;
};

export type CreateReplicRequest = {
  original_url: string;
  media_mode: MediaMode;
  expiration: string | null;
  description: string | null;
  password: string | null;
};

export type UpdateAccountRequest = {
  email: string;
  username: string;
  profile_color: number;
};

export type CreateAccountRequest = {
  email: string;
  password: string;
  profile_color: number;
  username: string;
};

export type SubmitEmailVerificationRequest = {
  email_token: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type CredentialsRequest = {
  username: string | null;
  email: string | null;
  password: string;
};

export type ResetPasswordRequest = {
  password: string;
};
