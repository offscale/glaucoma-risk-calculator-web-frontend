import { Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { UsersComponent } from './users.component';


export const usersRoutes: Routes = [
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard] }
];
