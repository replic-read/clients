import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Replic, ReplicService_Token } from '@replic-read-clients/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ConfigService_Token } from '../../model/ConfigService';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

@Component({
  templateUrl: 'replic_created.html',
  styleUrl: 'replic_created.scss',
  imports: [
    TranslatePipe,
    MatIconButton,
    MatIcon,
    MatButton,
    RouterLink,
    CdkCopyToClipboard,
  ],
})
export class ReplicCreatedViewModel implements OnInit {
  /**
   * The route that led to this component being activated.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * The replic service.
   */
  private readonly replicService = inject(ReplicService_Token);

  /**
   * The config service.
   */
  private readonly configService = inject(ConfigService_Token);

  /**
   * The id parameter that was passed to this component via the route.
   */
  protected readonly id = this.route.snapshot.paramMap.get('replic_id');

  /**
   * The resolved replic, or null if it was not found.
   * @protected
   */
  private readonly replic = signal<Replic | null | undefined>(undefined);

  /**
   * The base url.
   * @private
   */
  private readonly urlBase = this.configService.getConfig().backendUrl ?? '';

  /**
   * The host url of the current replic.
   */
  protected readonly hostUrl = computed(() =>
    this.replic()
      ? this.urlBase + this.replic()!.hostUrl
      : (this.replic() as null | undefined)
  );

  ngOnInit(): void {
    this.replicService.refresh().then(() => {
      this.replicService.getReplic(this.id ?? '').subscribe((replic) => {
        this.replic.set(replic);
      });
    });
  }
}
