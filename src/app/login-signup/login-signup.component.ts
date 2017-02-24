import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/filter';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth/auth.service';
import { User } from '../api/auth/user';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  @ViewChild('formRef') form;

  constructor(private router: Router, private authService: AuthService, private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn() && this.gotoDash();
  }

  onSubmit(user: User): void {
    this.authService.post(user)
      .subscribe(
        user => {
          if (!this.authService.isLoggedIn()) {
            this.alertsService.alerts.push({msg: JSON.stringify(user), type: 'warning'});
            return;
          }
          console.info(`Logged in with ${this.authService.accessToken}`);
          this.gotoDash();
        },
        error => this.alertsService.alerts.push({
          type: 'danger', msg: error.message.startsWith('JSON.parse') ? 'API offline' : error
        })
      );
  }

  private gotoDash() {
    this.router.navigate(['/admin/dashboard']).then(success =>
        success ? console.info('state changed') : this.alertsService.alerts.push(
            {msg: 'state didn\'t change', type: 'warning'}),
      err => this.alertsService.alerts.push({msg: err, type: 'danger'})
    )
  }
}
