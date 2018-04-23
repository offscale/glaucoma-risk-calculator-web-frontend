import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginSignupComponent } from './login-signup.component';
import { loginSignupRoutes } from './login-signup.routes';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule, RouterModule.forChild(loginSignupRoutes),
    // ButtonsModule
  ],
  // providers: [AuthService],
  declarations: [LoginSignupComponent]
})

export class LoginSignupModule {
}
