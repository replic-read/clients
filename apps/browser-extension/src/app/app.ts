import { Component, inject, Injectable, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import {
  BaseUrlSupplier,
  NetworkClient_Token,
} from '@replic-read-clients/shared';

@Injectable()
export class BrowserBaseUrlSupplier implements BaseUrlSupplier {
  supply(): string {
    return 'http://localhost:8080';
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
  private readonly client = inject(NetworkClient_Token);

  ngOnInit() {
    console.log(`Hello there!`);
    this.client
      .signup({
        email: 'simon2@bumiller.me',
        password: 'Anthony!2404',
        profile_color: 0,
        username: 'sim2on123',
      })
      .subscribe((response) =>
        console.log(`Got response: ${JSON.stringify(response)}`)
      );
  }
}
