import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { AuthService } from '../api/auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, public appService: AppService,
              public authService: AuthService, private alertsService: AlertsService) {
  }

  logout() {
    this.authService.del().subscribe(
      response => !this.router.isActive('', true) && this.router.navigate(['login-signup']).then(success =>
          success ? console.info('state changed') : this.alertsService.alerts.push(
            { msg: 'state didn\'t change', type: 'warning' }),
        err => this.alertsService.alerts.push({ msg: err, type: 'danger' })
      ),
      console.error
    );
  }
}
