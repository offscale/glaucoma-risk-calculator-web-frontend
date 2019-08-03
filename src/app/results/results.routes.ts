import { Routes } from '@angular/router';

import { ResultsComponent } from './results.component';

export const resultsRoutes: Routes = [
  { path: '', component: ResultsComponent, data: { riskQuiz: null } },
  { path: ':id', component: ResultsComponent, data: { riskQuiz: null } }
];
