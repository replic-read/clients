import { Component, inject, OnInit, signal } from '@angular/core';
import { ExFormControl } from '../../validation/ExFormControl';
import {
  AuthenticationService_Token,
  MediaMode,
  PeriodUnit,
  ReplicService_Token,
  RereError,
  ServerConfigService_Token,
} from '@replic-read-clients/shared';
import { RereValidators } from '../../validation/RereValidators';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShowMore } from '../show_more/show_more';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, from, map } from 'rxjs';
import { ScrapeService_Token } from '../../model/ScrapeService';
import { Router } from '@angular/router';
import { Maybe } from '../../../../../shared/src/lib/shared/model/maybe';
import { MediaModeKeyPipe } from '../../translation/media_mode_translation';

enum PreError {
  QUOTA_REACHED = 'create_replic.error.quota_reached',
  PAGE_NOT_REPLICABLE = 'create_replic.error.page_invalid',
}

enum PostError {
  TOO_BIG = 'create_replic.error.too_big',
}

@Component({
  templateUrl: 'create_replic.html',
  styleUrl: 'create_replic.scss',
  imports: [
    TranslatePipe,
    MatButton,
    MatIcon,
    ShowMore,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatCheckbox,
    MatSelectModule,
    MediaModeKeyPipe,
  ],
})
export class CreateReplicViewModel implements OnInit {
  /**
   * The server config service.
   */
  private readonly serverConfigService = inject(ServerConfigService_Token);

  /**
   * The scrape service.
   */
  private readonly scrapeService = inject(ScrapeService_Token);

  /**
   * The replic service.
   */
  private readonly replicService = inject(ReplicService_Token);

  /**
   * The router.
   */
  private readonly router = inject(Router);

  /**
   * The auth service.
   */
  private readonly auth = inject(AuthenticationService_Token);


  /**
   * The description form field.
   */
  protected readonly description = new ExFormControl<string | null>(null, []);

  /**
   * The expiration form field.
   */
  protected readonly expiration = new ExFormControl<Date | null>(null, []);

  /**
   * The password form field.
   */
  protected readonly password = new ExFormControl<string | null>(null, [
    RereValidators.replicPassword,
  ]);

  /**
   * The media mode form field.
   */
  protected readonly mediaMode = new ExFormControl<MediaMode>(
    MediaMode.ALL,
    []
  );

  /**
   * The form field that contains whether the password field is visible.
   */
  protected readonly isPassword = new ExFormControl(false, []);

  /**
   * The 'pre' error, i.e. the error that was found before loading the screen.
   */
  protected readonly preError = signal<PreError | null | undefined>(undefined);

  /**
   * The 'post' error, i.e. the error that was found after it was tried to replicate the
   * replic.
   */
  protected readonly postError = signal<PostError | null>(null);

  /**
   * The maximum expiration. Null if there is no limit.
   */
  protected readonly maxExpiration = toSignal(
    this.serverConfigService.getServerConfigObservable().pipe(
      map((config) => {
        if (config?.maximumActivePeriod) {
          const length = config.maximumActivePeriod.length;
          let factor = 1000 * 60 * 60 * 24; // One day
          switch (config.maximumActivePeriod.unit) {
            case PeriodUnit.DAY:
              factor *= 1;
              break;
            case PeriodUnit.MONTH:
              factor *= 30;
              break;
            case PeriodUnit.YEAR:
              factor *= 356;
              break;
          }

          const maxExpiration = Date.now() + length * factor;
          return new Date(maxExpiration);
        } else {
          return null;
        }
      })
    )
  );

  /**
   * The minimum expiration. Is the current date.
   */
  protected readonly minExpiration = new Date();

  /**
   * The options available in the media-mode selector.
   */
  protected readonly mediaModeOptions = [
    MediaMode.ALL,
    MediaMode.IMAGES,
    MediaMode.NONE,
  ];

  /**
   * Event handler for the replication button.
   */
  protected replicate() {
    const expiration = this.expiration.control.value ?? this.maxExpiration();
    const isPassword = this.isPassword.control.value;
    const password = this.password.control.value;
    const mediaMode = this.mediaMode.control.value;
    const description = this.description.control.value;

    console.assert(expiration != undefined);

    const passwordValid =
      (isPassword && !this.password.control.invalid) || !isPassword;

    if (!passwordValid) {
      return;
    }

    const createReplic = (urlAndContent: [string, string] | null) => {
      if (urlAndContent == null) {
        return;
      }
      this.replicService
        .createReplic(
          urlAndContent[1],
          urlAndContent[0],
          mediaMode || MediaMode.ALL,
          expiration ?? null,
          description || null,
          isPassword ? password : null
        )
        .subscribe((maybe) => {
          if (maybe.isYes()) {
            this.router.navigate([`replic-created/${maybe.yes().id}`]);
          } else if (maybe.no() == 'too_big') {
            this.postError.set(PostError.TOO_BIG);
          }
        });
    };
    this.scrapeService.createForCurrentTab().subscribe(createReplic);
  }

  /**
   * Initializer.
   * Sets up the pre-errors.
   */
  ngOnInit(): void {
    const scrape$ = from(this.scrapeService.createForCurrentTab());
    const quota$ = this.auth.quota();
    const serverConfig = this.serverConfigService.getServerConfig();

    combineLatest([quota$, scrape$]).subscribe(
      ([quota, scrape]: [
        Maybe<number, RereError>,
        [string, string] | null
      ]) => {
        const canBeScraped = scrape != null;

        const quotaSetup = !!serverConfig?.limit?.count;
        const userFollowsQuota = quota.isYes();

        const isQuotaFollowed =
          !quotaSetup ||
          !userFollowsQuota ||
          quota.yes() < serverConfig!.limit!.count;

        if (!canBeScraped) this.preError.set(PreError.PAGE_NOT_REPLICABLE);
        else if (!isQuotaFollowed) this.preError.set(PreError.QUOTA_REACHED);
        else this.preError.set(null);
      }
    );
  }
}
