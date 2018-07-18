import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCollapseModule, NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { GaugeChartModule } from 'gauge-chart';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { RiskResService } from '../../api/risk_res/risk_res.service';
import { RiskQuizFormSubmittedComponent } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';
import { riskQuizFormSubmittedRoutes } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.routes';
import { RiskPointerComponent } from '../risk-pointer/risk-pointer.component';
import { RiskQuizFormComponent } from './risk-quiz-form.component';


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, BrowserAnimationsModule, FormsModule,
    RouterModule, RouterModule.forChild(riskQuizFormSubmittedRoutes),
    NgbPaginationModule.forRoot(), NgbCollapseModule.forRoot(),
    NgbTypeaheadModule.forRoot(), NgbModalModule.forRoot(),
    GaugeChartModule, ClipboardModule, NgSelectModule, NgxChartsModule
  ],
  providers: [RiskStatsService, RiskResService],
  declarations: [
    RiskQuizFormComponent, RiskQuizFormSubmittedComponent, RiskPointerComponent
  ],
  exports: [RiskQuizFormComponent]
})
export class RiskQuizFormModule {
}
