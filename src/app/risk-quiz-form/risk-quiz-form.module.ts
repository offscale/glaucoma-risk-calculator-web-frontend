import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GaugeModule } from 'ng-gauge';
import { CollapseModule, PaginationModule, TypeaheadModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SelectModule } from 'ng-next-select';
import { Ng2TableModule } from 'ng2-table';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { RiskStatsService } from '../api/risk_stats/risk-stats.service';
import { RiskResService } from '../api/risk_res/risk_res.service';
import { RiskQuizFormSubmittedComponent } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';
import { riskQuizFormSubmittedRoutes } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.routes';
import { RiskQuizFormComponent } from './risk-quiz-form.component';
import { RiskPointerComponent } from '../risk-pointer/risk-pointer.component';


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, BrowserAnimationsModule, FormsModule,
    RouterModule, RouterModule.forChild(riskQuizFormSubmittedRoutes),
    TypeaheadModule.forRoot(), GaugeModule, CollapseModule.forRoot(),
    ClipboardModule, SelectModule, NgxChartsModule,
    PaginationModule.forRoot(), Ng2TableModule
  ],
  providers: [RiskStatsService, RiskResService],
  declarations: [RiskQuizFormComponent, RiskQuizFormSubmittedComponent, RiskPointerComponent],
  exports: [RiskQuizFormComponent]
})
export class RiskQuizFormModule {
}
