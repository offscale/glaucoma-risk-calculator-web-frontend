import { Routes } from '@angular/router';

import { AuthGuard } from '../api/auth/auth-guard.service';
import { EmailComponent } from '../email/email.component';
import { UsersComponent } from '../users/users.component';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoutes: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/email', component: EmailComponent, canActivate: [AuthGuard] }
];
