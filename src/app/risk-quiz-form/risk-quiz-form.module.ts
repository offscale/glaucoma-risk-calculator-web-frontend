import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GaugeModule } from 'ng2-kw-gauge';
import { CollapseModule } from 'ng2-bootstrap';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { RiskStatsService } from '../api/risk_stats/risk-stats.service';
import { RiskResService } from '../api/risk_res/risk_res.service';
import { RiskQuizFormSubmittedComponent } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';
import { riskQuizFormSubmittedRoutes } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.routes';
import { RiskQuizFormComponent } from './risk-quiz-form.component';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, GaugeModule, CollapseModule.forRoot(), ClipboardModule,
    RouterModule, RouterModule.forChild(riskQuizFormSubmittedRoutes)
  ],
  providers: [RiskStatsService, RiskResService],
  declarations: [RiskQuizFormComponent, RiskQuizFormSubmittedComponent],
  exports: [RiskQuizFormComponent]
})
export class RiskQuizFormModule {
}
