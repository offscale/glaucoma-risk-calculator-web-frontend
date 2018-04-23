import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AppService } from './app.service';
import { MsAuthService, parseQueryString } from './ms-auth/ms-auth.service';
import { AuthService } from '../api/auth/auth.service';
import { EmailConfService } from '../api/email_conf/email_conf.service';

@Component({
  /* tslint:disable:component-selector */
  selector: 'glaucoma-risk-calculator',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService,
              public appService: AppService,
              private emailConfService: EmailConfService,
              private msAuthService: MsAuthService,
              private router: Router) {
  }

  ngOnInit() {
    const qs = parseQueryString(location.hash);
    if (Object.keys(qs).length > 0) {
      this.emailConfService
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
