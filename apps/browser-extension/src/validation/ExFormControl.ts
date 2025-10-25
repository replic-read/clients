import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Wrapper around a form control that allows easier access to the errors.
 */
export class ExFormControl<T> {
  public static readonly ERROR_KEY = 'com.rere.client.error_key';

  /**
   * The control.
   */
  public readonly control: FormControl<T | null>;

  /**
   * Creates a new ExFormControl.
   * @param initial The initial value.
   * @param validators The validators used.
   */
  constructor(initial: T, validators: ValidatorFn[]) {
    this.control = new FormControl<T>(initial, validators);
  }

  /**
   * Gets the saved value for the ERROR_KEY key.
   */
  errorKey(): string {
    if (!this.control.invalid) {
      throw new Error("Tried to call 'errorKey' while the control was valid.");
    }

    return this.control.errors![ExFormControl.ERROR_KEY] as string;
  }

  /**
   * Sets an error.
   * @param key The new error.
   */
  setErrorKey(key: string) {
    this.control.setErrors({ [ExFormControl.ERROR_KEY]: key });
  }
}
