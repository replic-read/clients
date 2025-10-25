import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: `<h1>Replic created: {{ id }}</h1>`,
})
export class ReplicCreatedViewModel {
  private readonly route = inject(ActivatedRoute);

  protected readonly id = this.route.snapshot.paramMap.get('replic_id');
}
