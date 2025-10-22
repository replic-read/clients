import { Component, inject, Injectable, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { AuthTokenAccessor, BaseUrlSupplier, MediaMode, ReplicService_Token } from '@replic-read-clients/shared';

@Injectable()
export class BrowserBaseUrlSupplier implements BaseUrlSupplier {
  supply(): string {
    return 'http://localhost:8080';
  }
}

@Injectable()
export class LocalStorageAuthTokenAccessor implements AuthTokenAccessor {
  getAccess(): string | null {
    return localStorage.getItem('access');
  }

  getRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  setAccess(access: string): void {
    return localStorage.setItem('access', access);
  }

  setRefresh(refresh: string): void {
    return localStorage.setItem('refresh', refresh);
  }
}

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'browser-extension';
  private readonly accService = inject(ReplicService_Token);

  ngOnInit() {
    const htmlContent = '<h1>Idiots!</h1>';

    this.accService
      .createReplic(
        htmlContent,
        'https://google.com/',
        MediaMode.NONE,
        null,
        null,
        null
      )
      .subscribe((res) => {
        if (res.isYes()) {
          console;.log(
            `Got successful replic data: ${JSON.stringify(res.yes())}`
          );
        } else {
          console.log(`Got replic error: ${JSON.stringify(res.no())}`);
        }
      });
  }
}
