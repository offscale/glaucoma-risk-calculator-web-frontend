/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { LoginSignupComponent } from './login-signup.component';
import { AuthService } from '../api/auth/auth.service';
import { Router } from '@angular/router';

describe('Component: LoginSignup', () => {
  it('should create an instance', () => {
    let component = new LoginSignupComponent(null,null);
    expect(component).toBeTruthy();
  });
});
