import { Routes } from '@angular/router';

import { AuthGuard } from '../api/auth/auth-guard.service';
import { UsersComponent } from './users.component';

export const usersRoutes: Routes = [
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard] }
];
