import { Routes } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RiskQuizFormComponent } from './risk-quiz-form/risk-quiz-form.component';
// import { AuthGuard } from './api/auth/auth-guard.service';
// NOTE: `canActivate` can only be done manually on all the child routes [true for ng @ 2.4.0]


// 'app/login-signup/login-signup.module#LoginSignupModule'

export const rootRoutes: Routes = [
  { path: '', component: RiskQuizFormComponent },
  { path: 'login-signup', component: LoginSignupComponent },
  // { path: 'admin', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' }
  // { path: 'admin/email', loadChildren: 'app/email/email.module#EmailModule' }
];
