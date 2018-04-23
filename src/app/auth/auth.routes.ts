import { Routes } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';

export const authRoutes: Routes = [
  { path: 'auth', component: LoginComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/logout', component: LogoutComponent }
];
