import { ValidatorFn } from '@angular/forms';
import { ExFormControl } from './ExFormControl';

/**
 * Contains validators for the app.
 */
export class RereValidators {
  private static readonly URL_FORMAT_KEY = 'validation.format.url';

  private static readonly EMAIL_REGEX = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$'
  private static readonly USERNAME_REGEX = '^[A-Za-z0-9_]{4,32}$'
  private static readonly PASSWORD_REGEX = '^[^\\s]{4,64}$'

  /**
   * Creates a validator for checking the format of a url.
   */
  public static url: ValidatorFn = (elem) => {
    try {
      new URL(elem.value as string);
      return null;
    } catch (_) {
      return this.errorRes(this.URL_FORMAT_KEY);
    }
  };

  /**
   * Validator for an email input.
   */
  public static readonly email = RereValidators.pattern(RereValidators.EMAIL_REGEX, 'validation.format.email')

  /**
   * Validator for a password input.
   */
  public static readonly password = RereValidators.pattern(RereValidators.PASSWORD_REGEX, 'validation.format.password')
  /**
   * Validator for a replic password input.
   */
  public static readonly replicPassword = RereValidators.pattern(RereValidators.PASSWORD_REGEX, 'validation.format.replic_password')

  /**
   * Validator for a username input.
   */
  public static readonly username = RereValidators.pattern(RereValidators.USERNAME_REGEX, 'validation.format.username')

  /**
   * Helper function to create pattern validators.
   * @param pattern The pattern to check against.
   * @param key The error key that should be used.
   * @private
   */
  private static pattern(pattern: string, key: string): ValidatorFn {
    return (elem) => {
      const matches = new RegExp(pattern).test(elem.value as string);
      if (!matches) return this.errorRes(key);
      else return null;
    };
  }

  /**
   * Creates the ValidationErrors object with only one error.
   * @param key The error key.
   */
  private static errorRes(key: string) {
    return { [ExFormControl.ERROR_KEY]: key };
  }
}
