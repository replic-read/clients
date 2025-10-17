import {
  AccountState,
  AuthUserGroup,
  MediaMode,
  PeriodUnit,
  ReplicState,
} from './enums';

export type PartialAccount = {
  id: string;
  username: string;
  profileColor: number;
};

export type Account = PartialAccount & {
  creationTimestamp: Date;
  email: string;
  accountState: AccountState;
};

export type Replic = {
  id: string;
  originalUrl: string;
  hostUrl: string;
  mediaMode: MediaMode;
  description: string | null;
  expirationTimestamp: Date | null;
  owner: PartialAccount | null;
  size: number;
  state: ReplicState;
  hasPassword: boolean;
};

export type Report = {
  id: string;
  creationTimestamp: Date;
  replic: Replic;
  owner: PartialAccount | null;
  description: string | null;
};

export type Period = {
  unit: PeriodUnit;
  length: number;
};

export type ReplicLimitConfig = {
  period: Period;
  start: Date;
  count: number;
};

export type ServerConfig = {
  createReplicsGroup: AuthUserGroup;
  accessReplicsGroup: AuthUserGroup;
  createReportGroup: AuthUserGroup;
  allowAccountCreation: boolean;
  limit: ReplicLimitConfig | null;
  maximumActivePeriod: Period | null;
};
