import { Component, OnInit } from '@angular/core';
import { AuthService } from './api/auth/auth.service';
import { AppService } from './app.service';
import { MsAuthService, parseQueryString } from './ms-auth/ms-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app',
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
      this.msAuthService.getConf().subscribe(console.info, console.error);
      !!qs.id_token && this.msAuthService.getAccessToken(qs.state);
      this.msAuthService.access_token = qs.access_token;
      !!qs.state && this.router.navigateByUrl(decodeURIComponent(qs.state));
    }
  }
}
