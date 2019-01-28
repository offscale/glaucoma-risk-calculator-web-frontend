import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router,
              public appService: AppService,
              public authService: AuthService,
              public alertsService: AlertsService) {
  }

  logout() {
    this.router
      .navigate(['auth/logout'])
      .then(success => success ? console.info('NavbarComponent::state changed') : this.alertsService.alerts.push(
        { msg: 'state didn\'t change', type: 'warning' }),
        err => this.alertsService.alerts.push({ msg: err, type: 'danger' })
      );
  }
}
