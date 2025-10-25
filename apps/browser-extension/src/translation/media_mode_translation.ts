import { MediaMode } from '@replic-read-clients/shared';
import { Pipe, PipeTransform } from '@angular/core';

const MEDIA_MODE_KEYS: Record<MediaMode, string> = {
  [MediaMode.ALL]: 'media_mode.all',
  [MediaMode.IMAGES]: 'media_mode.images',
  [MediaMode.NONE]: 'media_mode.none',
};

@Pipe({
  name: 'mediaModeKey'
})
export class MediaModeKeyPipe implements PipeTransform {

  transform(value: MediaMode): string {
    return MEDIA_MODE_KEYS[value]
  }

}
