import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ExFormControl } from '../../validation/ExFormControl';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService_Token } from '@replic-read-clients/shared';

@Component({
  templateUrl: 'login.html',
  imports: [
    TranslatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatIcon,
    MatPrefix,
    MatSuffix,
    MatIconButton,
    MatButton,
    MatLabel,
    RouterLink,
  ],
  styleUrl: 'login.scss',
})
export class LoginViewModel {
  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);
  /**
   * The router.
   */
  private readonly router = inject(Router);
  /**
   * The identifier form field.
   */
  protected readonly identifier = new ExFormControl('', []);

  /**
   * The password form field.
   */
  protected readonly password = new ExFormControl('', []);

  /**
   * The password visibility boolean state.
   */
  protected readonly passwordVisible = signal(false);

  /**
   * Event handler for the login button.
   */
  protected login() {
    /*
     * We use the identifier as the email if it contains an '@', otherwise as the username.
     */
    const identifier = this.identifier.control.value ?? '';
    const email = identifier.includes('@') ? identifier : null;
    const username = email != null ? null : identifier;

    this.auth
      .login(email, username, this.password.control.value ?? '')
      .subscribe((maybe) => {
        if (maybe.isNo()) {
          this.identifier.setErrorKey('validation.credentials');
          this.password.setErrorKey('validation.credentials');
        } else {
          this.router.navigate(['']);
        }
      });
  }

  /**
   * Event handler for the password visibility icon suffix.
   */
  protected togglePasswordVisibility() {
    this.passwordVisible.set(!this.passwordVisible());
  }
}
