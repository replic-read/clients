import { Component, inject, signal } from '@angular/core';
import { AuthenticationService_Token } from '@replic-read-clients/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: 'not_verified.html',
  imports: [TranslatePipe, MatButton],
  styleUrl: 'not_verified.scss',
})
export class NotVerifiedViewModel {
  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);

  /**
   * Whether the email was sent. Null if an error occurred.
   */
  protected readonly wasEmailSent = signal<boolean | null>(false);

  /**
   * Event handler for the send email button.
   */
  protected sendEmail() {
    this.auth.requestEmailVerification().subscribe((maybe) => {
      this.wasEmailSent.set(maybe.isYes() ? true : null);
    });
  }
}
