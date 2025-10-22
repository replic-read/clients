import { Component, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthTokenAccessor,
  BaseUrlSupplier,
} from '@replic-read-clients/shared';

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
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'browser-extension';
}
