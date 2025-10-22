import { RereError } from '../../model/error';

export type UpdateUsernameError = RereError | 'username_used';
export type UpdateEmailError = RereError | 'email_used';
