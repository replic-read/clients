import { ValidatorFn } from '@angular/forms';
import { ExFormControl } from './ExFormControl';

/**
 * Contains validators for the app.
 */
export class RereValidators {
  private static readonly URL_FORMAT_KEY = 'validation.format.url';

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
