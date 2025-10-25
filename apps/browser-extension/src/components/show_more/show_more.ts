import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  templateUrl: 'show_more.html',
  imports: [MatIcon, TranslatePipe, MatRippleModule],
  styleUrl: 'show_more.scss',
  selector: 're-show-more',
})
export class ShowMore {
  readonly visible = signal(false);

  protected toggle() {
    this.visible.set(!this.visible());
  }
}
