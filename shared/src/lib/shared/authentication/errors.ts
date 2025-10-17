import { RereError } from '../model/error';

export type LoginError = RereError | 'credentials';

export type SignupError = RereError | 'email_used' | 'username_used';
