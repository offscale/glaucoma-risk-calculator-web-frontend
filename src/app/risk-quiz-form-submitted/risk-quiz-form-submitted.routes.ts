import { Routes } from '@angular/router';

import { RiskQuizFormSubmittedComponent } from './risk-quiz-form-submitted.component';

export const riskQuizFormSubmittedRoutes: Routes = [
  { path: 'results', component: RiskQuizFormSubmittedComponent },
  { path: 'results/:id', component: RiskQuizFormSubmittedComponent }
];
