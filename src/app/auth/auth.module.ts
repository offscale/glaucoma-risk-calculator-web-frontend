import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../api/auth/auth.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { authRoutes } from './auth.routes';


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(authRoutes),
    FormsModule, ReactiveFormsModule
  ],
  providers: [AuthService],
  declarations: [
    LoginComponent, LogoutComponent
  ]
})
export class AuthModule {}
