import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfigService_Token } from '../../model/ConfigService';
import { ExFormControl } from '../../validation/ExFormControl';
import { RereValidators } from '../../validation/RereValidators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthenticationService_Token } from '@replic-read-clients/shared';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * View-Model for the set-endpoint view.
 */
@Component({
  templateUrl: 'set_endpoint.html',
  styleUrl: 'set_endpoint.scss',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatIcon,
    MatPrefix,
    MatButton,
    MatFormFieldModule,
    TranslatePipe,
  ],
})
export class SetEndpointViewModel implements OnInit {
  /**
   * Form control for the endpoint test field.
   * Initial value is either the current endpoint or empty if no endpoint is set up.
   */
  protected endpoint = new ExFormControl<string>('', [RereValidators.url]);
  /**
   * The config service.
   */
  private readonly configService = inject(ConfigService_Token);
  /**
   * If an endpoint was already set, or of the endpoint is being set for the first time.
   */
  protected wasEndpointSet = signal(
    this.configService.getConfig().backendUrl != null
  );
  /**
   * The authentication.
   */
  private readonly auth = inject(AuthenticationService_Token);
  /**
   * Whether the client is logged in.
   */
  protected loggedIn = toSignal(
    this.auth.me().pipe(map((maybe) => maybe.isYes())),
    { initialValue: null }
  );
  /**
   * The router.
   */
  private readonly router = inject(Router);

  /**
   * Event handler for clicking on the change button.
   */
  setEndpoint(): void {
    if (!this.endpoint.control.invalid) {
      this.configService.setBackendUrl(this.endpoint.control.value!);
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.configService.refresh(() => {
      this.endpoint.control.setValue(
        this.configService.getConfig().backendUrl ?? ''
      );
    });
  }
}
