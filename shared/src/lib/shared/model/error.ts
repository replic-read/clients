export type RereError =
  | 'connection'
  | 'timeout'
  | 'permission'
  | 'authentication'
  | 'unknown';

export type CreateReplicError = RereError | 'too_big' | 'quota_reached'
