import { Routes } from '@angular/router';
// import { AuthGuard } from './api/auth/auth-guard.service';
// NOTE: `canActivate` can only be done manually on all the child routes [true for ng @ 2.4.0]

export const rootRoutes: Routes = [
  {path: '', loadChildren: 'app/home/home.module#HomeModule'},
  {path: 'login-signup', loadChildren: 'app/login-signup/login-signup.module#LoginSignupModule'},
  {path: 'admin', loadChildren: 'app/dashboard/dashboard.module#DashboardModule'}
  // {path: 'admin/email', loadChildren: 'app/email/email.module#EmailModule'}
];
