import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './api/auth/auth.service';
import { AppService } from './app.service';
import { MsAuthService, parseQueryString } from './ms-auth/ms-auth.service';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService,
              public appService: AppService,
              private msAuthService: MsAuthService,
              private router: Router) {
  }

  ngOnInit() {
    const qs = parseQueryString(location.hash);
    if (Object.keys(qs).length > 0) {
      this.msAuthService
        .getConf()
        .subscribe(conf => {
            /* tslint:disable:no-console */
            console.info(conf);
            /* tslint:disable:no-unused-expression */
            !!qs.id_token && this.msAuthService.getAccessToken(qs.state);
            this.msAuthService.access_token = qs.access_token;
            !!qs.state && this.router.navigateByUrl(decodeURIComponent(qs.state));
          },
          console.error
        );
    }
  }
}
