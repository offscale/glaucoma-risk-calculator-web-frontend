import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap';

import { LoginSignupComponent } from './login-signup.component';
import { AuthService } from '../api/auth/auth.service';
import { loginSignupRoutes } from './login-signup.routes';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule.forChild(loginSignupRoutes),
    ButtonsModule
  ],
  providers: [AuthService],
  declarations: [LoginSignupComponent],
  exports: [LoginSignupComponent]
})

export class LoginSignupModule {
}
