import { Routes } from '@angular/router';

import { RiskQuizFormComponent } from './risk-quiz-form/risk-quiz-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { AuthGuard } from './api/auth/auth-guard.service';
// NOTE: `canActivate` can only be done manually on all the child routes [true for ng @ 2.4.0]


// 'app/login-signup/login-signup.module#LoginSignupModule'

export const rootRoutes: Routes = [
  { path: '', component: RiskQuizFormComponent },
  { path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule' },
  { path: 'admin', component: DashboardComponent }
];

// { path: 'admin', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' }
// { path: 'admin/email', loadChildren: 'app/email/email.module#EmailModule' }
