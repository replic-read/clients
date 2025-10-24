import { Component, computed, input } from '@angular/core';

@Component({
  templateUrl: 'profile_circle.html',
  selector: 're-profile-circle',
})
export class ProfileCircle {
  /**
   * Input for the profile color.
   * @private
   */
  public readonly colorInt = input<number>();

  /**
   * The hex-color for the given profile color.
   */
  protected readonly profileColor = computed(
    () => `#${this.colorInt()!.toString(16)}`
  );
}
