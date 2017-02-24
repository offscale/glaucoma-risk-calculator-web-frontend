import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      console.info('You aren\'t logged in!');
      this.router.navigate(['login-signup']);
      return false;
    }
    return true;
  }
}
