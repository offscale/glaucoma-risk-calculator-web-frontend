import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '@angular/router/src/shared';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';

import { AuthService } from '../api/auth/auth.service';
import { ConfigService } from '../api/config/config.service';
import { MsAuthService, parseQueryString } from './ms-auth/ms-auth.service';
import { AlertsService } from './alerts/alerts.service';
import { AppService } from './app.service';


@Component({
  /* tslint:disable:component-selector */
  selector: 'glaucoma-risk-calculator',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
              private route: ActivatedRoute,
              public authService: AuthService,
              public appService: AppService,
              private confService: ConfigService,
              private msAuthService: MsAuthService,
              private alertsService: AlertsService) {
  }

  ngOnInit() {
    console.info('AppComponent::route.fragment =', this.route.fragment, ';');
    console.info('AppComponent::route.queryParams =', this.route.queryParams, ';');

    /*
    Observable.merge(this.route.fragment, this.route.queryParams)
      .subscribe((allParams) => {
        console.info('typeof allParams =', typeof allParams, 'isobject',
         Object.keys(allParams).length === 0 && allParams.constructor === Object, ';');
        if (typeof allParams === 'string')
          allParams = parseQueryString(allParams);
        console.info('NOW typeof allParams =', typeof allParams, 'isobject',
        Object.keys(allParams).length === 0 && allParams.constructor === Object, ';');
        this.handleParams(allParams);
      });
      */
    this.route.fragment.subscribe((fragment: string) => {
      const qs = parseQueryString(fragment);
      console.log('AppComponent::ngOnInit::ngOnInit::hash_fragment', qs, ';');
      this.handleParams(qs);
    });

    this.route.queryParams.subscribe(
      (params: Params & {id_token: string, state: string, access_token: string}) => {
        // tslint:disable:no-console
        console.info('AppComponent::ngOnInit::queryParams::params', params, ';');
        this.handleParams(params);
      });
  }

  private handleParams(params: Params) {
    if (Object.keys(params).length === 0 && params.constructor === Object || !params.value)
      return;

    console.info('AppComponent::handleParams::params:', params, ';');

    this.confService
      .get()
      .subscribe(conf => {
          /* tslint:disable:no-console */
          console.info('AppComponent::conf', conf, ';');

          this.msAuthService.init();

          const fin = () => this.router.navigateByUrl(params.hasOwnProperty('state') ? decodeURIComponent(params.state) : '/');

          if (params.hasOwnProperty('code'))
            this.msAuthService.login('code', params.code, params.state);
          else if (params.hasOwnProperty('refresh_token'))
            this.msAuthService.login( 'refresh_token', params.refresh_token, params.state);
          else if (params.hasOwnProperty('access_token')) {
            this.msAuthService.access_token = this.confService.config.access_token = params.access_token;
            localStorage.setItem('ms-access-token', this.msAuthService.access_token);
            this.confService.post(this.confService.config).subscribe(() => fin());
          } else if (params.hasOwnProperty('error')) {
            this.alertsService.add([params.error, params.error_description].join(': '));
            console.error(params);
          } else fin();
        },
        console.error
      );
  }

  getBottom() {
    return { 'margin-bottom': `${this.alertsService.alerts.length ? this.alertsService.alerts.length * 6 : 6}em` }
  }
}
