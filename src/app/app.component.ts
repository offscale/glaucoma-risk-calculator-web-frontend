import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MsAuthService, parseQueryString } from './ms-auth/ms-auth.service';
import { AuthService } from '../api/auth/auth.service';
import { ConfigService } from '../api/config/config.service';
import { AlertsService } from './alerts/alerts.service';
import { AppService } from './app.service';


@Component({
  /* tslint:disable:component-selector */
  selector: 'glaucoma-risk-calculator',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService,
              public appService: AppService,
              private confService: ConfigService,
              private msAuthService: MsAuthService,
              private alertsService: AlertsService,
              private router: Router) {
  }

  ngOnInit() {
    const qs = parseQueryString(location.hash);
    if (Object.keys(qs).length > 0) {
      this.confService
        .get()
        .subscribe(conf => {
            /* tslint:disable:no-console */
            console.info('AppComponent::conf', conf);
            /* tslint:disable:no-unused-expression */
            !!qs.id_token && this.msAuthService.getAccessToken(qs.state);
            this.msAuthService.access_token = qs.access_token;
            !!qs.state && this.router.navigateByUrl(decodeURIComponent(qs.state));
          },
          console.error
        );
    }
  }

  getBottom() {
    return { 'margin-bottom': `${this.alertsService.alerts.length ? this.alertsService.alerts.length * 6 : 6}em` }
  }
}
