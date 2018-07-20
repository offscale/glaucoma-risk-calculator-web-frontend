import { Routes } from '@angular/router';

import { RiskQuizFormSubmittedComponent } from './risk-quiz-form-submitted.component';
import { RiskQuizFormComponent } from '../risk-quiz-form/risk-quiz-form.component';

export const riskQuizFormSubmittedRoutes: Routes = [
  { path: '', component: RiskQuizFormComponent },
  { path: 'results', component: RiskQuizFormSubmittedComponent },
  { path: 'results/:id', component: RiskQuizFormSubmittedComponent }
];
