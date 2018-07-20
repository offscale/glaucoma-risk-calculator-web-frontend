import { Routes } from '@angular/router';

// import { AuthGuard } from './api/auth/auth-guard.service';
// NOTE: `canActivate` can only be done manually on all the child routes [true for ng @ 2.4.0]

export const rootRoutes: Routes = [
  { path: '', loadChildren: './risk-quiz-form/risk-quiz-form.module#RiskQuizFormModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'admin', loadChildren: './dashboard/dashboard.module#DashboardModule' }
];
