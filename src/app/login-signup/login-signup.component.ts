import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/filter';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth/auth.service';
import { User } from '../api/auth/user';
import { AlertsService } from '../alerts/alerts.service';
import { IStatusBody, subHandleError } from '../api/service-utils';

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
    const handleUser = user => {
      if (!this.authService.isLoggedIn()) {
        this.alertsService.alerts.push({msg: JSON.stringify(user), type: 'warning'});
        return;
      }
      console.info(`Logged in with ${this.authService.accessToken}`);
      this.gotoDash();
    };

    this.authService.post(user)
      .subscribe(handleUser,
        (error: IStatusBody) => console.error('error =', error) || error.status === 404 && error._parsed.error_message === 'User not found' ?
          this.authService.create_user(user).subscribe(handleUser, subHandleError.bind(this))
          : subHandleError.bind(this)
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
