import { Component, inject, signal } from '@angular/core';
import { AuthenticationService_Token } from '@replic-read-clients/shared';
import { Router, RouterLink } from '@angular/router';
import { ExFormControl } from '../../validation/ExFormControl';
import { RereValidators } from '../../validation/RereValidators';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  templateUrl: 'signup.html',
  styleUrl: 'signup.scss',
  imports: [
    MatButton,
    MatError,
    TranslatePipe,
    MatFormField,
    MatIcon,
    ReactiveFormsModule,
    MatInput,
    MatIconButton,
    RouterLink,
    MatLabel,
  ],
})
export class SignupViewModel {
  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);
  /**
   * The router.
   */
  private readonly router = inject(Router);
  /**
   * The email form field.
   */
  protected readonly email = new ExFormControl('', [RereValidators.email]);
  /**
   * The username form field.
   */
  protected readonly username = new ExFormControl('', [
    RereValidators.username,
  ]);
  /**
   * The password form field.
   */
  protected readonly password = new ExFormControl('', [
    RereValidators.password,
  ]);

  /**
   * Error message that may have occurred.
   */
  protected readonly error = signal<string | null>('');

  /**
   * The password visibility boolean state.
   */
  protected readonly passwordVisible = signal(false);

  /**
   * Event handler for the password visibility icon suffix.
   */
  protected togglePasswordVisibility() {
    this.passwordVisible.set(!this.passwordVisible());
  }

  /**
   * Event handler for the confirmation button.
   */
  protected signup() {
    const inputs = [this.email, this.username, this.password];
    const anyError = inputs.some((control) => control.control.invalid);
    if (anyError) return;

    this.auth
      .signup(
        this.email.control.value ?? '',
        this.username.control.value ?? '',
        this.password.control.value ?? '',
        randomInt(),
        true
      )
      .subscribe((result) => {
        if (result.isNo()) {
          switch (result.no()) {
            case 'email_used':
              this.email.setErrorKey('validation.unique.email');
              break;
            case 'username_used':
              this.username.setErrorKey('validation.unique.username');
              break;
            default:
              this.error.set('validation.unspecified.signup');
          }
        } else {
          this.router.navigate(['']);
        }
      });
  }
}

function randomInt() {
  return Math.floor(Math.random() * Math.pow(2, 31));
}
